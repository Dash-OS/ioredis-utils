# ioredis-utils

Documentation Coming Soon...

## Install

```
yarn add ioredis-utils
```

**or**

```
npm install --save ioredis-utils
```

## 100% Flow Coverage

Proudly built with 100% Flow Coverage and exported .flow.js files so your flow
projects will benefit!

We strongly recommend you look over the
[types](https://github.com/Dash-OS/ioredis-utils/tree/master/src/types/index.js)
in the source. This will give you an idea of how the various pieces of the
package work.

## Temporary Overview

Until Documentation - outline of features implemented

* Reading and Loading of Lua scripts
* Read comments from lua scripts to determine key names and length

## Examples

Our
[examples directory](https://github.com/Dash-OS/ioredis-utils/tree/master/examples)
shows a few tests that should be all working.

### Lua Commands

`ioredis` provides the ability to define custom commands using lua scripts. This
is an awesome feature. `ioredis-utils` provides a simple and intuitive (and flow
covered) way of loading all the lua scripts in a given directory and
automatically define commands for you.

```js
/* @flow */
import type Redis from 'ioredis';
import path from 'path';
import { lua } from 'ioredis-utils';

const scriptsDir = path.join(__dirname, 'scripts');

function handleLinkLuaScripts(redis: Redis) {
  return lua
    .loadScripts(scriptsDir, true /* recursive? */)
    .then(scripts => lua.addScriptsToRedis(redis, scripts));
}

export default handleLinkLuaScripts;
```

The lua scripts should be formatted with comments at the top defining the name
and keys. If keys are not provided then it will not define them and you will
need to add them to the arguments each time you call the command.

> If name is not provided it will use the name of the file instead.

Below is an example of a `hsetifeq.lua` script.

```lua
-- name:  hsetifeq
-- keys:  key field value
local value = unpack(redis.call("HMGET", KEYS[1], KEYS[2]))
local check = KEYS[3]
if value == check then
  return redis.call("HMSET", KEYS[1], unpack(ARGV))
else
  return nil
end
```

#### Include Lua Scripts

There are some included and pre-compiled lua scripts with this library. They are
not used by default and are not imported. You can easily add them if you wish:

```js
import { lua } from 'ioredis-utils';
import luaScripts from 'ioredis-utils/extras/scripts';

lua.addScriptsToRedis(redis, luaScripts);
```
