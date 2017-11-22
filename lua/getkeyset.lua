--[[
  Summary:
    Given a key that contains a Redis Set, iterates and returns the
    values of the keys at each given set.  Expects that the set contains
    a group of strings that point to other keys which should be retrieved.

    All items in the set are expected to be the same type, which should be
    provided as the second argument. If the second argument is not provided
    then 'hash' is expected.

    'myset:key',
    'hash' || 'set' || 'string'

  Returns:
   ES6 Map of keys to values, transformed if possible so that:
    set    === Map<string, Set<string>>,
    hash   === Map<string, { [key: string]: string }>
    string === Map<string, string>
]]
--| name:    getkeyset
--| dynamic: true
--| keys:    key type
--[[args => {
  if (args.length === 1) {
    return [1, ...args]
  } else if (args.length === 2) {
    return [2, ...args]
  } else {
    throw new Error(`[REDIS] | Invalid # of Keys: ${args.length}`)
  }
}]]
--[[result => {
  if (!Array.isArray(result)) return result;
  const type = result.shift();
  const response = new Map()
  for (let i = 0; i < result.length / 2; i += 1) {
    const idx = i * 2
    const key = result[idx]
    const val = result[idx + 1]
    switch(type) {
      case 'hash': {
        const hash = {}
        for (let i2 = 0; i2 < val.length / 2; i2 += 1) {
          const idx2 = i2 * 2
          hash[ val[idx2] ] = val[idx2 + 1]
        }
        response.set(key, hash);
        break
      }
      case 'string': {
        response.set(key, val)
        break;
      }
      case 'set': {
        response.set(key, new Set(val))
        break;
      }
    }
  }
  return response;
}]]
-- TODO: Make it so that one can pass ARGV values to specify the  members to remove
local SetKey     = KEYS[1]
local SetKeyType = KEYS[2]

if not SetKeyType then
  SetKeyType = 'hash'
end

local ResponseTable = { SetKeyType }
local SetMembers = redis.call("SMEMBERS", SetKey)

if #SetMembers == 0 then return ResponseTable end

local Get = {
  string = function(key)
    return redis.call("GET", key)
  end,
  hash = function(key)
    return redis.call("HGETALL", key)
  end,
  set = function(key)
    return redis.call("SMEMBERS", key)
  end
}

for _,v in pairs(SetMembers) do
  local i = #ResponseTable
  ResponseTable[i + 1] = v
  ResponseTable[i + 2] = Get[SetKeyType](v)
end

return ResponseTable
