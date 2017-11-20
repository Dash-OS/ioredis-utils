-- name:    hsetifeq
-- dynamic: true
-- keys:    key field value
--[[(args: { [key: string]: * }) => {
  const keys = [];
  let nkeys = 0;
  if (args.length === 3) {
    keys.push(args[0]);
    Object.keys(args[1]).reduce((p, key) => {
      p.push(key, args[1][key]);
      return p;
    }, keys);
    nkeys = keys.length;
    Object.keys(args[2]).reduce((p, key) => {
      p.push(key, args[2][key]);
      return p;
    }, keys);
  }
  return [nkeys, ...keys];
}]]
--[[(result: Array<*>): { [key: string]: * } => {
  if (!Array.isArray(result)) return result;
  const response = {}
  for (let i = 0; i < result.length / 2; i += 1) {
    response[ result[i * 2] ] = result[i * 2 + 1];
  }
  return response;
}]]
--[[
  Summary:
    Checks if the current hashs fields match the keys, sets the args
    on the hash if they do.

  Returns:
    +OK or null
]]
local HashKey = KEYS[1]
table.remove(KEYS, 1)

if #KEYS % 2 ~= 0 or #ARGV %2 ~= 0 then
  return redis.error_reply("Keys and args Must be a set of key/value pairs")
end

local CheckKeys = {}
local CheckTable = {}

for i=1,#KEYS/2 do
  local k = KEYS[i * 2 - 1]
  local v = KEYS[i * 2]
  table.insert(CheckKeys, k)
  CheckTable[k] = v
end

local HashArray = redis.call("HMGET", HashKey, unpack(CheckKeys))

for i=1,#HashArray/2 do
  local k = HashArray[i * 2 - 1]
  local v = HashArray[i * 2]
  if CheckTable[k] ~= v then
    return nil
  end
end

return redis.call("HMSET", HashKey, unpack(ARGV))
