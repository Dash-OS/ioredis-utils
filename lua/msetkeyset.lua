--[[
  Summary:
    Sets one or more values on a keyset.  Takes a ES6 Map (KeySet) and
    sets each of the keys on their key while also adding them to the
    given KeySet.

  'mykeyset',
  new Map([
    ['keyone', { one: 'two' }],
    ['keytwo', { one: 'two' }]
  ])
  -->
  'mykeyset': KeySet<'keyone', 'keytwo'>
  'keyone': { one: 'two' }
  'keytwo': { one: 'two' }

]]
--| name:    msetkeyset
--| dynamic: false
--| keys:    KeySet TotalKeysInMap
--[[args => {
  const keyset = args.shift();
  const map = args.shift();
  const keys = [ keyset, map.size ];
  for (const [key, value] of map) {
    keys.push(key)
    if (Array.isArray(value) || value instanceof Set) {
      keys.push('set')
      if (Array.isArray(value)) {
        keys.push(value.length)
      } else {
        keys.push(value.size)
      }
      keys.push(...value)
    } else {
      switch(typeof value) {
        case 'number':
        case 'string': {
          keys.push('string', 1, value);
          break;
        }
        case 'object': {
          const objkeys = Object.keys(value)
          keys.push('hash', objkeys.length * 2);
          objkeys.reduce((p, k) => {
            p.push(k, value[k]);
            return p;
          }, keys);
          break;
        }
        default: {
          throw new Error(`Unknown Type for setkeyset ${typeof value}`)
        }
      }
    }
  }
  return keys
}]]
local KeySet = KEYS[1]
local RemainingKeys = tonumber(KEYS[2])

local AddMembers = {}
local Responses  = {}

local IDX = 0

local Set = {
  string = 'SET',
  hash   = 'HMSET',
  set    = 'SADD'
}

local function ShiftArgs(arg)
  local n    = tonumber(arg.n)
  local r    = {}
  local lidx = 0
  while n > 0 do
    n       = n - 1
    IDX     = IDX + 1
    lidx    = lidx + 1
    r[lidx] = ARGV[IDX]
  end
  return r
end

while RemainingKeys > 0 do

  local meta = ShiftArgs{n = 3}
  local args = ShiftArgs{n = meta[3]}

  if Set[meta[2]] then
    AddMembers[#AddMembers + 1] = meta[1]
    Responses[#Responses + 1] = redis.call(
      Set[meta[2]],
      meta[1],
      unpack(args)
    )
  end

  RemainingKeys = RemainingKeys - 1

end

if #AddMembers > 0 then
  redis.call("SADD", KeySet, unpack(AddMembers))
end

return Responses
