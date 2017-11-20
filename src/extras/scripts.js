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
      file: 'hsetifget.lua',
      name: 'hsetifget',
      ext: '.lua',
    },
    data: '-- name:  hsetifget\n-- keys:  key field value\n-- If field equals value, set then return new hash\nlocal value = unpack(redis.call("HMGET", KEYS[1], KEYS[2]))\nlocal check = KEYS[3]\nif value == check then\n  local result = redis.call("HMSET", KEYS[1], unpack(ARGV))\n  if result["ok"] then\n    return redis.call("HGETALL", KEYS[1])\n  end\nelse\n  return nil\nend\n',
    params: (new Map([["name","hsetifget"],["keys",["key","field","value"]]]): Map<string, Array<string> | string>)
  },

  {
    descriptor: {
      file: 'hsetifeq.lua',
      name: 'hsetifeq',
      ext: '.lua',
    },
    data: '-- name:  hsetifeq\n-- keys:  key field value\n-- Set hash values only if field equals \nlocal value = unpack(redis.call("HMGET", KEYS[1], KEYS[2]))\nlocal check = KEYS[3]\nif value == check then\n  return redis.call("HMSET", KEYS[1], unpack(ARGV))\nelse\n  return nil\nend\n',
    params: (new Map([["name","hsetifeq"],["keys",["key","field","value"]]]): Map<string, Array<string> | string>)
  },
];

function addDefaultScriptsToRedis(redis: Redis) {
  return lua.addScriptsToRedis(redis, descriptors);
}

export default addDefaultScriptsToRedis;
