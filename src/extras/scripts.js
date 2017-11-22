/* @flow */
// Auto-Generated by build-lua script in utils folder
// These are pre-compiled lua script descriptors which can be loaded
// into
import type Redis from 'ioredis';
import type { File$SimpleData } from 'ioredis-utils/lib/types';
import { lua } from 'ioredis-utils';

const descriptors: Array<File$SimpleData> = [
  {
    descriptor: {
      file: 'delkeyset.lua',
      name: 'delkeyset',
      ext: '.lua',
    },
    data: 'local SetKey = KEYS[1]\n\nlocal RemoveKeys = {}\nlocal RemovingSet = false\n\nlocal TotalMembers = redis.call(\"SCARD\", SetKey)\nif TotalMembers == 0 then\n  redis.call(\"DEL\", SetKey)\n  return {1, 0, RemoveKeys}\nend\n\nif #ARGV > 0 then\n  local RKPosition = 0\n\n  for i = 1, #ARGV do\n    local MemberKey = ARGV[i]\n    local IsMember = redis.call(\"SISMEMBER\", SetKey, MemberKey)\n    if IsMember == 1 then\n      RKPosition = RKPosition + 1\n      RemoveKeys[RKPosition] = MemberKey\n    end\n  end\n\n  if RKPosition == TotalMembers then\n    RemovingSet = true\n  else\n    redis.call(\"SREM\", SetKey, unpack(RemoveKeys))\n  end\nelse\n  RemoveKeys = redis.call(\"SMEMBERS\", SetKey)\n  RemovingSet = true\nend\n\nlocal TotalDeleted\nif RemovingSet then\n  TotalDeleted = redis.call(\"DEL\", SetKey, unpack(RemoveKeys)) - 1\nelse\n  TotalDeleted = redis.call(\"DEL\", unpack(RemoveKeys))\nend\n\nreturn {TotalMembers - TotalDeleted, TotalDeleted, RemoveKeys}',
    params: {"name":"delkeyset","dynamic":false,"keys":["KeySet"]},
  },
  {
    descriptor: {
      file: 'getkeyset.lua',
      name: 'getkeyset',
      ext: '.lua',
    },
    data: 'local SetKey     = KEYS[1]\nlocal SetKeyType = KEYS[2]\n\nif not SetKeyType then\n  SetKeyType = \'hash\'\nend\n\nlocal ResponseTable = { SetKeyType }\nlocal SetMembers = redis.call(\"SMEMBERS\", SetKey)\n\nif #SetMembers == 0 then return ResponseTable end\n\nlocal Get = {\n  string = function(key)\n    return redis.call(\"GET\", key)\n  end,\n  hash = function(key)\n    return redis.call(\"HGETALL\", key)\n  end,\n  set = function(key)\n    return redis.call(\"SMEMBERS\", key)\n  end\n}\n\nfor _,v in pairs(SetMembers) do\n  local i = #ResponseTable\n  ResponseTable[i + 1] = v\n  ResponseTable[i + 2] = Get[SetKeyType](v)\nend\n\nreturn ResponseTable',
    params: {"name":"getkeyset","dynamic":true,"keys":["key","type"]},
    transforms: {
        args: args => {
  if (args.length === 1) {
    return [1, ...args]
  } else if (args.length === 2) {
    return [2, ...args]
  } else {
    throw new Error(`[REDIS] | Invalid # of Keys: ${args.length}`)
  }
},
        result: result => {
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
},
    },
    
  },
  {
    descriptor: {
      file: 'hsetifeq.lua',
      name: 'hsetifeq',
      ext: '.lua',
    },
    data: 'local HashKey = KEYS[1]\ntable.remove(KEYS, 1)\n\nif #KEYS % 2 ~= 0 or #ARGV %2 ~= 0 then\n  return redis.error_reply(\"Keys and args Must be a set of key/value pairs\")\nend\n\nlocal PROPS = {\n    [\'@EXAT\'] = function(ms)\n    return redis.call(\'PEXPIREAT\', HashKey, ms)\n  end,\n    [\'@EXIN\'] = function(ms)\n    return redis.call(\'PEXPIRE\', HashKey, ms)\n  end,\n  [\'@KSET\'] = function(kset)\n    return redis.call(\'SADD\', kset, HashKey)\n  end,\n}\n\nlocal CheckKeys = {}\nlocal CheckTable = {}\n\nlocal CKPosition = 0\n\nfor i=1,#KEYS/2 do\n  local k = KEYS[i * 2 - 1]\n  local v = KEYS[i * 2]\n  if PROPS[k] then\n    RequestProps[k] = v\n  else\n    CKPosition = CKPosition + 1\n    CheckKeys[CKPosition] = k\n    CheckTable[k] = v\n  end\nend\n\nif #CheckKeys > 0 then\n  local HashArray = redis.call(\"HMGET\", HashKey, unpack(CheckKeys))\n  for i=1,#HashArray/2 do\n    local k = HashArray[i * 2 - 1]\n    local v = HashArray[i * 2]\n    if CheckTable[k] ~= v then\n      return nil\n    end\n  end\nend\n\nfor k,v in pairs(RequestProps) do\n  PROPS[k](v)\nend\n\nreturn redis.call(\"HMSET\", HashKey, unpack(ARGV))',
    params: {"name":"hsetifeq","dynamic":false,"keys":[]},
    transforms: {
        args: args => {
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
},
        result: result => {
  if (!Array.isArray(result)) return result;
  const response = {}
  for (let i = 0; i < result.length / 2; i += 1) {
    const idx = i * 2
    response[ result[idx] ] = result[idx + 1];
  }
  return response;
},
    },
    
  },
  {
    descriptor: {
      file: 'hsetifget.lua',
      name: 'hsetifget',
      ext: '.lua',
    },
    data: 'local HashKey = KEYS[1]\ntable.remove(KEYS, 1)\n\nif #KEYS % 2 ~= 0 or #ARGV %2 ~= 0 then\n  return redis.error_reply(\"Keys and args Must be a set of key/value pairs\")\nend\n\nlocal PROPS = {\n    [\'@EXAT\'] = function(ms)\n    return redis.call(\'PEXPIREAT\', HashKey, ms)\n  end,\n    [\'@EXIN\'] = function(ms)\n    return redis.call(\'PEXPIRE\', HashKey, ms)\n  end,\n  [\'@KSET\'] = function(kset)\n    return redis.call(\'SADD\', kset, HashKey)\n  end,\n}\n\nlocal CheckKeys = {}\nlocal RequestProps = {}\nlocal CheckTable = {}\n\nlocal CKPosition = 0\n\nfor i=1,#KEYS/2 do\n  local k = KEYS[i * 2 - 1]\n  local v = KEYS[i * 2]\n  if PROPS[k] then\n    RequestProps[k] = v\n  else\n    CKPosition = CKPosition + 1\n    CheckKeys[CKPosition] = k\n    CheckTable[k] = v\n  end\nend\n\nif #CheckKeys > 0 then\n  local HashArray = redis.call(\"HMGET\", HashKey, unpack(CheckKeys))\n  for i=1,#HashArray do\n    local k = CheckKeys[i]\n    local v = HashArray[i]\n    if CheckTable[k] ~= v then\n      return nil\n    end\n  end\nend\n\n\nlocal result = redis.call(\"HMSET\", HashKey, unpack(ARGV))\n\nif result[\"ok\"] then\n  for k,v in pairs(RequestProps) do\n    PROPS[k](v)\n  end\n  return redis.call(\"HGETALL\", HashKey)\nend\n\nreturn nil',
    params: {"name":"hsetifget","dynamic":true,"keys":["key","ifMatchesThis","thenSetThese"]},
    transforms: {
        args: args => {
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
},
        result: result => {
  if (!Array.isArray(result)) return result;
  const response = {}
  for (let i = 0; i < result.length / 2; i += 1) {
    const idx = i * 2
    response[ result[idx] ] = result[idx + 1];
  }
  return response;
},
    },
    
  },
  {
    descriptor: {
      file: 'msetkeyset.lua',
      name: 'msetkeyset',
      ext: '.lua',
    },
    data: 'local KeySet = KEYS[1]\nlocal RemainingKeys = tonumber(KEYS[2])\n\nlocal AddMembers = {}\nlocal Responses  = {}\n\nlocal IDX = 0\n\nlocal Set = {\n  string = \'SET\',\n  hash   = \'HMSET\',\n  set    = \'SADD\'\n}\n\nlocal function ShiftArgs(arg)\n  local n    = tonumber(arg.n)\n  local r    = {}\n  local lidx = 0\n  while n > 0 do\n    n       = n - 1\n    IDX     = IDX + 1\n    lidx    = lidx + 1\n    r[lidx] = ARGV[IDX]\n  end\n  return r\nend\n\nwhile RemainingKeys > 0 do\n\n  local meta = ShiftArgs{n = 3}\n  local args = ShiftArgs{n = meta[3]}\n\n  if Set[meta[2]] then\n    AddMembers[#AddMembers + 1] = meta[1]\n    Responses[#Responses + 1] = redis.call(\n      Set[meta[2]],\n      meta[1],\n      unpack(args)\n    )\n  end\n\n  RemainingKeys = RemainingKeys - 1\n\nend\n\nif #AddMembers > 0 then\n  redis.call(\"SADD\", KeySet, unpack(AddMembers))\nend\n\nreturn Responses',
    params: {"name":"msetkeyset","dynamic":false,"keys":["KeySet","TotalKeysInMap"]},
    transforms: {
        args: args => {
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
},
    },
    
  },
  {
    descriptor: {
      file: 'setkeyset.lua',
      name: 'setkeyset',
      ext: '.lua',
    },
    data: 'local KeySet     = KEYS[1]\nlocal KeySetKey  = KEYS[2]\nlocal KeySetType = KEYS[3]\n\nlocal Set = {\n  string = function()\n    return redis.call(\"SET\", KeySetKey, unpack(ARGV))\n  end,\n  hash = function()\n    return redis.call(\"HMSET\", KeySetKey, unpack(ARGV))\n  end,\n  set = function()\n    return redis.call(\"SADD\", KeySetKey, unpack(ARGV))\n  end\n}\n\nredis.call(\"SADD\", KeySet, KeySetKey)\nreturn Set[KeySetType]()',
    params: {"name":"setkeyset","dynamic":false,"keys":["KeySet","KeySetType","Key"]},
    transforms: {
        args: args => {
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
},
    },
    
  },
];

function addDefaultScriptsToRedis(redis: Redis) {
  return lua.addScriptsToRedis(redis, descriptors);
}

export default addDefaultScriptsToRedis;
