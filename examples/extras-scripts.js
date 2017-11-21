/* @flow */
import Redis from 'ioredis';
import addDefaultScriptsToRedis from '../src/extras/scripts';
import { log } from '../utils/log';

const redis = new Redis();

addDefaultScriptsToRedis(redis);
log('Default Scripts Added!');

console.log(redis.hsetifget);

function startExampleOne() {
  const START = log('\n-- START EXAMPLE ONE (STANDARD) --\n');
  redis
    .multi()
    .del('hash1')
    .hmset('hash1', { field1: 'value1', isTrue: 1 })
    .hmget('hash1', 'field1', 'isTrue')
    .exec()
    .then(results => {
      const value = results[2][1];
      if (value[0] === 'value1' && value[1] === '1') {
        return redis
          .multi()
          .hmset('hash1', { field2: 'value2', field3: 'value3' })
          .hgetall('hash1')
          .exec();
      }
      return null;
    })
    .then(results => {
      const result = results[1][1];
      const END = log('\n\n-- END EXAMPLE ONE --\n', result);
      log('Example One Duration: ', END - START);

      return startExampleTwo();
    });
}

function startExampleTwo() {
  const START = log('\n-- START EXAMPLE TWO (LUA-DRIVEN) --\n');

  // console.log(cmd);
  return redis
    .multi()
    .del('hash1')
    .hmset('hash1', { field1: 'value1', isTrue: 1 })
    .exec()
    .then(() =>
      redis.hsetifget(
        'hash1',
        { field1: 'value1', isTrue: 1 },
        { field2: 'value2', field3: 'value3' },
      ))
    .then(result => {
      // const result = results[2][1];
      const END = log('\n\n-- END EXAMPLE TWO --\n', result);
      log('Example Two Duration: ', END - START);
    });
}

Promise.resolve().then(() => {
  redis.monitor((err, monitor) => {
    // log('Redis Monitor Started');
    monitor.on('monitor', (time: number, args: Array<mixed>) => {
      // log('[MONITOR] | ', time, args);
    });
    startExampleOne();
  });
});

/*
  +2.6588    958958752.830661     Default Scripts Added!
  [Function]
*/
