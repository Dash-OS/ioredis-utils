/* @flow */
import Redis from 'ioredis';
import addDefaultScriptsToRedis from '../src/extras/scripts';
import { log } from '../utils/log';

const redis = new Redis();

addDefaultScriptsToRedis(redis);
log('Default Scripts Added!');

console.log(redis.hsetifget);

function startExample() {
  redis
    .del('hash1')
    .then(() => redis.hmset('hash1', { field1: 'value1', isTrue: 1 }))
    .then(() => redis.hsetifget(
      'hash1',
      { field1: 'value1', isTrue: 1 },
      { field2: 'value2', field3: 'value3' },
    ))
    .then(results => {
      log('hsetifget result: ', results);
    });
}

redis.monitor((err, monitor) => {
  log('Redis Monitor Started');
  monitor.on('monitor', (time: number, args: Array<mixed>) => {
    log('[MONITOR] | ', time, args);
  });
  startExample();
});

/*
  +2.6588    958958752.830661     Default Scripts Added!
  [Function]
*/
