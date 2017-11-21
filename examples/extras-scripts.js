/* @flow */
import Redis from 'ioredis';
import addDefaultScriptsToRedis from '../src/extras/scripts';
import { log } from '../utils/log';

const redis = new Redis();

addDefaultScriptsToRedis(redis);

function startExampleOne() {
  const START = log('\n-- START EXAMPLE ONE (STANDARD) --\n');
  return redis
    .hmget('hash1', 'field1', 'isTrue')
    .then(result => {
      if (Array.isArray(result)) {
        if (result[0] === 'value1' && result[1] === '1') {
          return redis
            .multi()
            .hmset('hash1', { field2: 'value2', field3: 'value3' })
            .hgetall('hash1')
            .exec();
        }
      }
      return null;
    })
    .then(results => {
      if (results) {
        const result = results[1][1];
        const END = log('\n\n-- END EXAMPLE ONE --\n', result);
        log('Example One Duration: ', END - START);
      }
    });
}

function startExampleTwo() {
  const START = log('\n-- START EXAMPLE TWO (LUA-DRIVEN) --\n');
  return redis
    .hsetifget(
      'hash1',
      { field1: 'value1', isTrue: 1 },
      { field2: 'value2', field3: 'value3' },
    )
    .then(result => {
      // const result = results[2][1];
      const END = log('\n\n-- END EXAMPLE TWO --\n', result);
      log('Example Two Duration: ', END - START);
    });
}

Promise.resolve().then(() => {
  redis.monitor((err, monitor) => {
    // log('Redis Monitor Started');
    // eslint-disable-next-line
    monitor.on('monitor', (time: number, args: Array<mixed>) => {
      // see each command execution by uncommenting this
      // log('[MONITOR] | ', time, args);
    });
    redis
      .del('hash1')
      .then(() => redis.hmset('hash1', { field1: 'value1', isTrue: 1 }))
      .then(() => startExampleOne())
      .then(() => redis.del('hash1'))
      .then(() => redis.hmset('hash1', { field1: 'value1', isTrue: 1 }))
      .then(() => startExampleTwo());
  });
});

/*
  +17.0790   1058489502.422319
  -- START EXAMPLE ONE (STANDARD) --

  +3.3570    1058489505.779367
  -- END EXAMPLE ONE --
  { field1: 'value1',
  isTrue: '1',
  field2: 'value2',
  field3: 'value3' }
  +1.2867    1058489507.0661      Example One Duration:  3.357047915458679

  +0.5961    1058489507.662159
  -- START EXAMPLE TWO (LUA-DRIVEN) --

  +0.8865    1058489508.548647

  -- END EXAMPLE TWO --
  { field1: 'value1',
  isTrue: '1',
  field2: 'value2',
  field3: 'value3' }
  +0.0962    1058489508.644885    Example Two Duration:  0.8864880800247192

*/
