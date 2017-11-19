/* @flow */
import Redis from 'ioredis';
import addDefaultScriptsToRedis from 'ioredis-utils/extras/scripts';
import { log } from '../utils/log';

const redis = new Redis();

addDefaultScriptsToRedis(redis);

log('Default Scripts Added!');

console.log(redis.hsetifeq);

/*
  +2.6588    958958752.830661     Default Scripts Added!
  [Function]
*/
