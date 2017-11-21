--[[
  Summary:
    Checks if the hash with key KEYS[1] matches the KEYS.  If it does,
    then it sets the values on the hash given in ARGV.

    So "hash1", { field1: 'value1', field2: 'value2' }, { field3: 'value3' }
    if hash with key "hash1"
     has field "field1" with value "value1" AND
     has field "field2" with value "value2"
    THEN
      set "hash1" "field3" "value3"

  Returns the modified hash
]]
--| name:    hsetifget
--| dynamic: true
--| keys:    key ifMatchesThis thenSetThese
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

-- local KEYS = {"hash1", "field1", "value1", "field2", "value2", "field3", "value3"}
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
  end
}

local CheckKeys = {}
local RequestProps = {}
local CheckTable = {}

for i=1,#KEYS/2 do
  local k = KEYS[i * 2 - 1]
  local v = KEYS[i * 2]
  if PROPS[k] then
    RequestProps[k] = v
  else
    table.insert(CheckKeys, k)
    CheckTable[k] = v
  end
end

if #CheckKeys > 0 then
  local HashArray = redis.call("HMGET", HashKey, unpack(CheckKeys))
  for i=1,#HashArray do
    local k = CheckKeys[i]
    local v = HashArray[i]
    if CheckTable[k] ~= v then
      return nil
    end
  end
end

-- All values match, we can get the ARGV now

local result = redis.call("HMSET", HashKey, unpack(ARGV))

if result["ok"] then
  for k,v in pairs(RequestProps) do
    PROPS[k](v)
  end
  return redis.call("HGETALL", HashKey)
end

return nil
