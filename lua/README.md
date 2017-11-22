# Lua Commands

These custom commands are optional and only loaded if specified at runtime.
These are meant to assist in providing efficient handling of specific patterns
while working with Redis.

The custom commands are added to our custom `flowlib` which you can add to your
`.flowconfig` like-so:

```
[libs]
./node_modules/ioredis-utils/flowlibs
```

## KeySet Type

### setkeyset

```js
function setKeySet() {
  // Sets a value on the keyset and on its given destination
  return redis.setkeyset('example:set', 'example:set:one', { example: 'one' });
}
```

### msetkeyset

```js
function mSetKeySet() {
  // Sets a value on the keyset and on all given destinations
  return redis.msetkeyset(
    'example:set',
    new Map([
      ['example:set:one', { example: 'one' }],
      ['example:set:two', { example: 'two' }],
      ['example:set:three', { example: 'three' }],
    ]),
  );
}
// [ 'OK', 'OK', 'OK' ]
```

### delkeyset

```js
function delKeySet() {
  // Removes the KeySet and all keys that are apart of it
  return redis.delkeyset('example:set');
}
/*
  [ 0, 3, [ 'example:set:one', 'example:set:three', 'example:set:two' ] ]
*/

function delKeySetMembers() {
  // Removes the given members from the keyset.  If they exists on the keyset
  // then they are also removed.  They are not removed if not a member.
  return redis.delkeyset('example:set', 'example:set:one', 'example:set:three');
}
/*
  [ 1, 2, [ 'example:set:one', 'example:set:three' ] ]
*/
```

### getkeyset

```js
function getKeySet() {
  // Gets all members in the keyset (their values), returns Map<key, value>
  return redis.getkeyset('example:set');
}
/*
  Map {
    'example:set:one' => { example: 'one' },
    'example:set:three' => { example: 'three' },
    'example:set:two' => { example: 'two' }
  }
*/
```

## Hash Utilities

### hsetifeq

### hsetifget
