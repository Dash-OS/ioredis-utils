/* @flow */
import Redis from 'ioredis';
import RedisBuffer from '../src/extras/buffer';
import { log } from '../utils/log';

const redis = new Redis();

const buffer = new RedisBuffer({
  redis,
  timeout: 3000,
});

function startExample() {
  log('Add key1');
  buffer
    .add('set', 'key1', 'value')
    .promise()
    .then(result => {
      log('Buffer Result 1: ', result);
      buffer.add('set', 'key4', 'value4');
    });
  log('Add key2');

  buffer
    .add('set', 'key2', 'value2')
    .promise()
    .then(result => {
      log('Buffer Result 2: ', result);
      buffer.add('set', 'key5', 'value5');
    });

  setTimeout(() => {
    log('Add key3');
    buffer.add('set', 'key3', 'value3');
  }, 2000);
}

redis.monitor((err, monitor) => {
  log('Redis Monitor Started');
  monitor.on('monitor', (time: number, args: Array<mixed>) => {
    log('[MONITOR] | ', time, args);
  });
  startExample();
});

/*
  +136.4782  962275924.598205     Redis Monitor Started
  +0.5174    962275925.115562     Add key1
  +0.9911    962275926.106647     Add key2

  +2000.7995 962277926.906186     Add key3

  +1002.9448 962278929.850938     [MONITOR] |  1511133568.989172 [ 'set', 'key1', 'value' ]
  +1.6330    962278931.483895     [MONITOR] |  1511133568.989204 [ 'set', 'key2', 'value2' ]
  +0.1294    962278931.613328     [MONITOR] |  1511133568.989213 [ 'set', 'key3', 'value3' ]
  +0.9247    962278932.538075     Buffer Result 1:  [ [ null, 'OK' ], [ null, 'OK' ], [ null, 'OK' ] ]
  +0.2670    962278932.805092     Buffer Result 2:  [ [ null, 'OK' ], [ null, 'OK' ], [ null, 'OK' ] ]

  +3003.3282 962281936.133255     [MONITOR] |  1511133571.995707 [ 'set', 'key4', 'value4' ]
  +0.1829    962281936.31615      [MONITOR] |  1511133571.995730 [ 'set', 'key5', 'value5' ]
*/
