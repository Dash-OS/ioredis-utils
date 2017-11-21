/* @flow */
import Redis from 'ioredis';
import addDefaultScriptsToRedis from '../../src/extras/scripts';
import { log } from '../../utils/log';

const redis = new Redis();

addDefaultScriptsToRedis(redis);

function startExample() {
  const START = log('\n-- START EXAMPLE --\n');
  return redis.getkeysinset('example:set').then(result => {
    const END = log('Result Ready!', result);
    log('Time for Execution: ', END - START);
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
      .multi()
      .del(
        'example:set',
        'example:set:one',
        'example:set:two',
        'example:set:three',
      )
      .hmset('example:set:one', { example: 'one' })
      .hmset('example:set:two', { example: 'two' })
      .hmset('example:set:three', { example: 'three' })
      .sadd(
        'example:set',
        'example:set:one',
        'example:set:two',
        'example:set:three',
      )
      .exec()
      .then(() => {
        log('Redis Example Prepared - Executing Example:');
        return startExample();
      })
      .then(() => {
        log('Example Complete');
      });
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
