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
      file: 'hsetifeq.lua',
      name: 'hsetifeq',
      ext: '.lua',
    },
    data:
      "local HashKey = KEYS[1]\ntable.remove(KEYS, 1)\n\nif #KEYS % 2 ~= 0 or #ARGV %2 ~= 0 then\n  return redis.error_reply(\"Keys and args Must be a set of key/value pairs\")\nend\n\nlocal PROPS = {\n    ['@EXAT'] = function(ms)\n    return redis.call('PEXPIREAT', HashKey, ms)\n  end,\n    ['@EXIN'] = function(ms)\n    return redis.call('PEXPIRE', HashKey, ms)\n  end\n}\n\nlocal CheckKeys = {}\nlocal CheckTable = {}\n\nfor i=1,#KEYS/2 do\n  local k = KEYS[i * 2 - 1]\n  local v = KEYS[i * 2]\n  if PROPS[k] then\n    RequestProps[k] = v\n  else\n    table.insert(CheckKeys, k)\n    CheckTable[k] = v\n  end\nend\n\nlocal HashArray = redis.call(\"HMGET\", HashKey, unpack(CheckKeys))\n\nfor i=1,#HashArray/2 do\n  local k = HashArray[i * 2 - 1]\n  local v = HashArray[i * 2]\n  if CheckTable[k] ~= v then\n    return nil\n  end\nend\n\nfor k,v in pairs(RequestProps) do\n  PROPS[v](v)\nend\n\nreturn redis.call(\"HMSET\", HashKey, unpack(ARGV))",
    params: { name: 'hsetifeq', dynamic: false, keys: [] },
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
              switch (key) {
                case 'expires': {
                  p.push('@EXAT', args[3][key]);
                  break;
                }
                case 'ttl': {
                  p.push('@EXIN', args[3][key]);
                  break;
                }
                default: {
                  throw new Error(`Unknown hsetifget Parameter ${key}`);
                }
              }
              return p;
            }, keys);
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
        const response = {};
        for (let i = 0; i < result.length / 2; i += 1) {
          const idx = i * 2;
          response[result[idx]] = result[idx + 1];
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
    data:
      'local HashKey = KEYS[1]\ntable.remove(KEYS, 1)\n\nif #KEYS % 2 ~= 0 or #ARGV %2 ~= 0 then\n  return redis.error_reply("Keys and args Must be a set of key/value pairs")\nend\n\nlocal PROPS = {\n    [\'@EXAT\'] = function(ms)\n    return redis.call(\'PEXPIREAT\', HashKey, ms)\n  end,\n    [\'@EXIN\'] = function(ms)\n    return redis.call(\'PEXPIRE\', HashKey, ms)\n  end\n}\n\nlocal CheckKeys = {}\nlocal RequestProps = {}\nlocal CheckTable = {}\n\nfor i=1,#KEYS/2 do\n  local k = KEYS[i * 2 - 1]\n  local v = KEYS[i * 2]\n  if PROPS[k] then\n    RequestProps[k] = v\n  else\n    table.insert(CheckKeys, k)\n    CheckTable[k] = v\n  end\nend\n\nlocal HashArray = redis.call("HMGET", HashKey, unpack(CheckKeys))\n\nfor i=1,#HashArray do\n  local k = CheckKeys[i]\n  local v = HashArray[i]\n  if CheckTable[k] ~= v then\n    return nil\n  end\nend\n\n\nlocal result = redis.call("HMSET", HashKey, unpack(ARGV))\n\nif result["ok"] then\n  for k,v in pairs(RequestProps) do\n    PROPS[v](v)\n  end\n  return redis.call("HGETALL", HashKey)\nend\n\nreturn nil',
    params: {
      name: 'hsetifget',
      dynamic: true,
      keys: ['key', 'ifMatchesThis', 'thenSetThese'],
    },
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
              switch (key) {
                case 'expires': {
                  p.push('@EXAT', args[3][key]);
                  break;
                }
                case 'ttl': {
                  p.push('@EXIN', args[3][key]);
                  break;
                }
                default: {
                  throw new Error(`Unknown hsetifget Parameter ${key}`);
                }
              }
              return p;
            }, keys);
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
        const response = {};
        for (let i = 0; i < result.length / 2; i += 1) {
          const idx = i * 2;
          response[result[idx]] = result[idx + 1];
        }
        return response;
      },
    },
  },
];

function addDefaultScriptsToRedis(redis: Redis) {
  return lua.addScriptsToRedis(redis, descriptors);
}

export default addDefaultScriptsToRedis;
