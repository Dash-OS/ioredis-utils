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

Additionally, we support transformations on the custom commands (which `ioredis`
does not allow natively). These transformers are defined inline within the lua
script as shown below.

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

Below is an example of a `hsetifeq.lua` script (excuse the poor lua skills -
feel free to improve upon it via pull request :)).

> **Note:** All comments are stripped (including multiline) during the
> processing of the script.

```lua
-- name:    hsetifeq
-- dynamic: true
-- keys:    key field value
--[[(args: { [key: string]: * }) => {
  const keys = [];
  let nkeys = 0;
  if (args.length === 3) {
    keys.push(args[0]);
    Object.keys(args[1]).reduce((p, key) => {
      p.push(key, args[1][key]);
      return p;
    }, keys);
    nkeys = keys.length;
    Object.keys(args[2]).reduce((p, key) => {
      p.push(key, args[2][key]);
      return p;
    }, keys);
  }
  return [nkeys, ...keys];
}]]
--[[(result: Array<*>): { [key: string]: * } => {
  if (!Array.isArray(result)) return result;
  const response = {}
  for (let i = 0; i < result.length / 2; i += 1) {
    response[ result[i * 2] ] = result[i * 2 + 1];
  }
  return response;
}]]
--[[
  Summary:
    Checks if the current hashs fields match the keys, sets the args
    on the hash if they do.

  Returns:
    +OK or null
]]
local HashKey = KEYS[1]
table.remove(KEYS, 1)

if #KEYS % 2 ~= 0 or #ARGV %2 ~= 0 then
  return redis.error_reply("Keys and args Must be a set of key/value pairs")
end

local CheckKeys = {}
local CheckTable = {}

for i=1,#KEYS/2 do
  local k = KEYS[i * 2 - 1]
  local v = KEYS[i * 2]
  table.insert(CheckKeys, k)
  CheckTable[k] = v
end

local HashArray = redis.call("HMGET", HashKey, unpack(CheckKeys))

for i=1,#HashArray/2 do
  local k = HashArray[i * 2 - 1]
  local v = HashArray[i * 2]
  if CheckTable[k] ~= v then
    return nil
  end
end

return redis.call("HMSET", HashKey, unpack(ARGV))
```

#### Included Lua Scripts

There are some included and
[pre-compiled lua scripts](https://github.com/Dash-OS/ioredis-utils/blob/master/src/extras/scripts.js)
with this library. They are not used by default and are not imported. They are
automatically built whenever the package is published from the
[lua directory](https://github.com/Dash-OS/ioredis-utils/tree/master/lua). You
can easily add them if you wish:

```js
import addDefaultScriptsToRedis from 'ioredis-utils/extras/scripts';
import redisInstance from './somewhere';

addDefaultScriptsToRedis(redisInstance);
```

##### Include Custom FlowLibs

Since the above will add commands to the redis instance, you may want to use our
built-in flowlibs which are also published. Simply add
`./node_modules/ioredis/flowlibs` to the `[libs]` sections of your
`.flowconfig`.

These improve upon the standard `flow-typed` library and includes our custom
commands as well as indexing of the custom commands you may add for basic type
safety. It also includes very crude support for type coverage of pipelines.
