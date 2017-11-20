--| name:    hsetifget
--| dynamic: true
--| keys:    key ifMatchesThis thenSetThese
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

-- local KEYS = {"hash1", "field1", "value1", "field2", "value2", "field3", "value3"}
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

-- All values match, we can get the ARGV now

local result = redis.call("HMSET", HashKey, unpack(ARGV))

if result["ok"] then
  return redis.call("HGETALL", HashKey)
end

return nil
