/* @flow */
/*
  getNativeAsyncCost() is used on any example which utilizes node.js's
  timers.  This is done to "fire up" the node.js timers which have a
  delay on their first execution.

  This gives us a more realistic look at the performance when utilizing
  the performance.now() testing that our log() command provides.
*/
import path from 'path';
import { log } from '../utils/log';

import { lua } from '../src';

log('Directory: ', __dirname);

lua.loadScripts(path.join(__dirname, 'scripts'), true).then(scripts => {
  scripts.forEach(script => {
    log(script.params);
  });
});
