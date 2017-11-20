/* @flow */
import Redis from 'ioredis';
import addDefaultScriptsToRedis from '../src/extras/scripts';
import { log } from '../utils/log';

const redis = new Redis();

addDefaultScriptsToRedis(redis);

log('Default Scripts Added!');

console.log(redis.hsetifget);

function startExample() {
  redis.hset('hash1', 'field1', 'value1').then(() => {
    log('Field1 Set');
    redis
      .hsetifget('hash1', 'field1', 'value2', 'field2', 'value2')
      .then(results => {
        log('hsetifget result: ', results);
        return redis.hsetifget(
          'hash1',
          'field1',
          'value1',
          'field2',
          'newvalue',
        );
      })
      .then(results => {
        log('hsetifget results 2: ', results);
      });
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
