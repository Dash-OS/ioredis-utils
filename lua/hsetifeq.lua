--[[
  Summary:
    Checks if the current hashs fields match the keys, sets the args
    on the hash if they do.

    Additionally allows a 3rd argument for options, namely
    { ttl?: number, expires?: number }

  Returns:
    +OK or null
]]
-- name:    hsetifeq
-- dynamic: true
-- keys:    key field value
--[[args => {
  const keys = [];
  let nkeys = 0;
  if (args.length === 3 || args.length === 4) {
    keys.push(args[0]);
    Object.keys(args[1]).reduce((p, key) => {
      p.push(key, args[1][key]);
      return p;
    }, keys);
    if (args[3]) {
      Object.keys(args[3]).reduce((p, key) => {
        switch(key) {
          case 'expires': {
            p.push(`@EXAT`, args[3][key]);
            break;
          }
          case 'ttl': {
            p.push(`@EXIN`, args[3][key]);
            break;
          }
          case 'keyset': {
            p.push(`@KSET`, args[3][key])
            break
          }
          default: {
            throw new Error(`Unknown hsetifget Parameter ${key}`);
          }
        }
        return p
      }, keys)
    }
    nkeys = keys.length;
    Object.keys(args[2]).reduce((p, key) => {
      p.push(key, args[2][key]);
      return p;
    }, keys);
  }
  return [nkeys, ...keys];
}]]
--[[result => {
  if (!Array.isArray(result)) return result;
  const response = {}
  for (let i = 0; i < result.length / 2; i += 1) {
    const idx = i * 2
    response[ result[idx] ] = result[idx + 1];
  }
  return response;
}]]

local HashKey = KEYS[1]
table.remove(KEYS, 1)

if #KEYS % 2 ~= 0 or #ARGV %2 ~= 0 then
  return redis.error_reply("Keys and args Must be a set of key/value pairs")
end

local PROPS = {
  -- expire at
  ['@EXAT'] = function(ms)
    return redis.call('PEXPIREAT', HashKey, ms)
  end,
  -- expire in
  ['@EXIN'] = function(ms)
    return redis.call('PEXPIRE', HashKey, ms)
  end,
  ['@KSET'] = function(kset)
    return redis.call('SADD', kset, HashKey)
  end,
}

local CheckKeys = {}
local CheckTable = {}

-- NOTE: Speed Hack
local CKPosition = 0

for i=1,#KEYS/2 do
  local k = KEYS[i * 2 - 1]
  local v = KEYS[i * 2]
  if PROPS[k] then
    RequestProps[k] = v
  else
    CKPosition = CKPosition + 1
    CheckKeys[CKPosition] = k
    CheckTable[k] = v
  end
end

if #CheckKeys > 0 then
  local HashArray = redis.call("HMGET", HashKey, unpack(CheckKeys))
  for i=1,#HashArray/2 do
    local k = HashArray[i * 2 - 1]
    local v = HashArray[i * 2]
    if CheckTable[k] ~= v then
      return nil
    end
  end
end

for k,v in pairs(RequestProps) do
  PROPS[k](v)
end

return redis.call("HMSET", HashKey, unpack(ARGV))
