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
    data: '-- name:  hsetifeq\n-- keys:  key field value\nlocal value = unpack(redis.call("HMGET", KEYS[1], KEYS[2]))\nlocal check = KEYS[3]\nif value == check then\n  return redis.call("HMSET", KEYS[1], unpack(ARGV))\nelse\n  return nil\nend\n',
    params: (new Map([["name","hsetifeq"],["keys",["key","field","value"]]]): Map<string, Array<string> | string>)
  },
];

function addDefaultScriptsToRedis(redis: Redis) {
  return lua.addScriptsToRedis(redis, descriptors);
}

export default addDefaultScriptsToRedis;
