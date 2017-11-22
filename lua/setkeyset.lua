--[[
  Summary:
    Sets one or more values on a keyset.  Takes a ES6 Map (KeySet) and
    sets each of the keys on their key while also adding them to the
    given KeySet.

  'mykeyset',
  'mykey',
  { some: 'value' }

]]
--| name:    setkeyset
--| dynamic: false
--| keys:    KeySet KeySetType Key
--[[args => {
  const keyset = args.shift();
  const keysetkey = args.shift();
  const keys = [ keyset, keysetkey ];
  const value = args.shift();
  if (Array.isArray(value) || value instanceof Set) {
    keys.push('set', ...value)
  } else {
    switch(typeof value) {
      case 'number':
      case 'string': {
        keys.push('string', value, ...args);
        break;
      }
      case 'object': {
        keys.push('hash');
        Object.keys(value).reduce((p, k) => {
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
  return keys
}]]
local KeySet     = KEYS[1]
local KeySetKey  = KEYS[2]
local KeySetType = KEYS[3]

local Set = {
  string = function()
    return redis.call("SET", KeySetKey, unpack(ARGV))
  end,
  hash = function()
    return redis.call("HMSET", KeySetKey, unpack(ARGV))
  end,
  set = function()
    return redis.call("SADD", KeySetKey, unpack(ARGV))
  end
}

redis.call("SADD", KeySet, KeySetKey)
return Set[KeySetType]()
