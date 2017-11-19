// flow-typed signature: 2d182fd12b11b5fd372e9465d1bfa6a0
// flow-typed version: e62b70fad9/ioredis_v3.x.x/flow_>=v0.46.x

// @flow
// Flowtype definitions for ioredis
// Project: https://github.com/luin/ioredis
// Definitions by: York Yao <https://github.com/plantain-00/>
//                 Christopher Eck <https://github.com/chrisleck>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
//
// Ported to Flow by Samuel Reed <https://github.com/strml>

/* =================== USAGE ===================
    import * as Redis from "ioredis";
    const redis = new Redis();
 =============================================== */

declare module 'ioredis' {
  declare class Commander extends events$EventEmitter {
    getBuiltinCommands(): string[];
    createBuiltinCommand(commandName: string): {};
    defineCommand(
      name: string,
      definition: {
        numberOfKeys?: number,
        lua?: string,
      },
    ): void;
    sendCommand(): void;
  }

  declare class Redis extends Commander {
    constructor(port?: number, host?: string, options?: RedisOptions): void;
    constructor(host?: string, options?: RedisOptions): void;
    constructor(options: RedisOptions): void;
    constructor(url: string): void;

    status: | 'close'
      | 'disconnecting'
      | 'wait'
      | 'connecting'
      | 'connect'
      | 'ready'
      | 'end';
    connect(callback?: Function): Promise<any>;
    disconnect(): void;
    duplicate(): Redis;
    monitor(
      callback?: (error: Error, monitor: events$EventEmitter) => void,
    ): Promise<events$EventEmitter>;

    send_command(command: string, ...args: any[]): any;
    auth(password: string, callback?: ResCallbackT<any>): Promise<any>;
    ping(callback?: ResCallbackT<number>): Promise<number>;
    append(
      key: string,
      value: string,
      callback?: ResCallbackT<number>,
    ): Promise<number>;
    bitcount(key: string, callback?: ResCallbackT<number>): Promise<number>;
    bitcount(
      key: string,
      start: number,
      end: number,
      callback?: ResCallbackT<number>,
    ): Promise<number>;
    set(
      key: string,
      value: string,
      nx?: 'NX',
      ex?: 'EX',
      expires?: number,
      callback?: ResCallbackT<string>,
    ): Promise<string>;
    get(key: string, callback?: ResCallbackT<string>): Promise<string>;
    exists(
      key: string,
      value: string,
      callback?: ResCallbackT<number>,
    ): Promise<number>;
    publish(channel: string, value: any): Promise<void>;
    subscribe(channel: string): Promise<void>;
    psubscribe(channel: string): Promise<void>;
    unsubscribe(...args: Array<string>): Promise<void>;

    getBuffer(key: string, callback?: ResCallbackT<Buffer>): Promise<Buffer>;

    // NOTE: These are complete, replacing the stubbed versions
    //       underneath them.
    hgetall<V>(key: string): Promise<V>;
    hgetall<V>(key: string, callback: Redis$Callback<V>): any;
    hmset<K, V: Object>(key: K, hash: V): Promise<Redis$SimpleResult>;
    hmset<K, V: Object>(
      key: K,
      hash: V,
      callback: Redis$Callback<Redis$SimpleResult>,
    ): any;
    hmset(...args: Array<string>): Promise<Redis$SimpleResult>;
    multi(): Redis$Pipeline<>;
    multi(config: { +pipeline: false }): Redis$Pipeline<>;
    pipeline(): Redis$Pipeline<>;

    // These are mostly stubbed, TODO
    setnx(args: any[], callback: ResCallbackT<any>): void;
    setnx(...args: any[]): Promise<any>;
    setex(args: any[], callback: ResCallbackT<any>): void;
    setex(...args: any[]): Promise<any>;
    psetex(args: any[], callback: ResCallbackT<any>): void;
    psetex(...args: any[]): Promise<any>;
    append(args: any[], callback: ResCallbackT<any>): void;
    append(...args: any[]): Promise<any>;
    strlen(args: any[], callback: ResCallbackT<any>): void;
    strlen(...args: any[]): Promise<any>;
    del(args: any[], callback: ResCallbackT<any>): void;
    del(...args: any[]): Promise<any>;
    exists(args: any[], callback: ResCallbackT<any>): void;
    exists(...args: any[]): Promise<any>;
    setbit(args: any[], callback: ResCallbackT<any>): void;
    setbit(...args: any[]): Promise<any>;
    getbit(args: any[], callback: ResCallbackT<any>): void;
    getbit(...args: any[]): Promise<any>;
    setrange(args: any[], callback: ResCallbackT<any>): void;
    setrange(...args: any[]): Promise<any>;
    getrange(args: any[], callback: ResCallbackT<any>): void;
    getrange(...args: any[]): Promise<any>;
    substr(args: any[], callback: ResCallbackT<any>): void;
    substr(...args: any[]): Promise<any>;
    incr(args: any[], callback: ResCallbackT<any>): void;
    incr(...args: any[]): Promise<any>;
    decr(args: any[], callback: ResCallbackT<any>): void;
    decr(...args: any[]): Promise<any>;
    mget(args: any[], callback: ResCallbackT<any>): void;
    mget(...args: any[]): Promise<any>;
    rpush(...args: any[]): Promise<any>;
    lpush(args: any[], callback: ResCallbackT<any>): void;
    lpush(...args: any[]): Promise<any>;
    rpushx(args: any[], callback: ResCallbackT<any>): void;
    rpushx(...args: any[]): Promise<any>;
    lpushx(args: any[], callback: ResCallbackT<any>): void;
    lpushx(...args: any[]): Promise<any>;
    linsert(args: any[], callback: ResCallbackT<any>): void;
    linsert(...args: any[]): Promise<any>;
    rpop(args: any[], callback: ResCallbackT<any>): void;
    rpop(...args: any[]): Promise<any>;
    lpop(args: any[], callback: ResCallbackT<any>): void;
    lpop(...args: any[]): Promise<any>;
    brpop(args: any[], callback: ResCallbackT<any>): void;
    brpop(...args: any[]): Promise<any>;
    brpoplpush(args: any[], callback: ResCallbackT<any>): void;
    brpoplpush(...args: any[]): Promise<any>;
    blpop(args: any[], callback: ResCallbackT<any>): void;
    blpop(...args: any[]): Promise<any>;
    llen(args: any[], callback: ResCallbackT<any>): void;
    llen(...args: any[]): Promise<any>;
    lindex(args: any[], callback: ResCallbackT<any>): void;
    lindex(...args: any[]): Promise<any>;
    lset(args: any[], callback: ResCallbackT<any>): void;
    lset(...args: any[]): Promise<any>;
    lrange(args: any[], callback: ResCallbackT<any>): void;
    lrange(...args: any[]): Promise<any>;
    ltrim(args: any[], callback: ResCallbackT<any>): void;
    ltrim(...args: any[]): Promise<any>;
    lrem(args: any[], callback: ResCallbackT<any>): void;
    lrem(...args: any[]): Promise<any>;
    rpoplpush(args: any[], callback: ResCallbackT<any>): void;
    rpoplpush(...args: any[]): Promise<any>;
    sadd(args: any[], callback: ResCallbackT<any>): void;
    sadd(...args: any[]): Promise<any>;
    srem(args: any[], callback: ResCallbackT<any>): void;
    srem(...args: any[]): Promise<any>;
    smove(args: any[], callback: ResCallbackT<any>): void;
    smove(...args: any[]): Promise<any>;
    sismember(args: any[], callback: ResCallbackT<any>): void;
    sismember(...args: any[]): Promise<any>;
    scard(args: any[], callback: ResCallbackT<any>): void;
    scard(...args: any[]): Promise<any>;
    spop(args: any[], callback: ResCallbackT<any>): void;
    spop(...args: any[]): Promise<any>;
    srandmember(args: any[], callback: ResCallbackT<any>): void;
    srandmember(...args: any[]): Promise<any>;
    sinter(args: any[], callback: ResCallbackT<any>): void;
    sinter(...args: any[]): Promise<any>;
    sinterstore(args: any[], callback: ResCallbackT<any>): void;
    sinterstore(...args: any[]): Promise<any>;
    sunion(args: any[], callback: ResCallbackT<any>): void;
    sunion(...args: any[]): Promise<any>;
    sunionstore(args: any[], callback: ResCallbackT<any>): void;
    sunionstore(...args: any[]): Promise<any>;
    sdiff(args: any[], callback: ResCallbackT<any>): void;
    sdiff(...args: any[]): Promise<any>;
    sdiffstore(args: any[], callback: ResCallbackT<any>): void;
    sdiffstore(...args: any[]): Promise<any>;
    smembers(args: any[], callback: ResCallbackT<any>): void;
    smembers(...args: any[]): Promise<any>;
    zadd(args: any[], callback: ResCallbackT<any>): void;
    zadd(...args: any[]): Promise<any>;
    zincrby(args: any[], callback: ResCallbackT<any>): void;
    zincrby(...args: any[]): Promise<any>;
    zrem(args: any[], callback: ResCallbackT<any>): void;
    zrem(...args: any[]): Promise<any>;
    zremrangebyscore(args: any[], callback: ResCallbackT<any>): void;
    zremrangebyscore(...args: any[]): Promise<any>;
    zremrangebyrank(args: any[], callback: ResCallbackT<any>): void;
    zremrangebyrank(...args: any[]): Promise<any>;
    zunionstore(args: any[], callback: ResCallbackT<any>): void;
    zunionstore(...args: any[]): Promise<any>;
    zinterstore(args: any[], callback: ResCallbackT<any>): void;
    zinterstore(...args: any[]): Promise<any>;
    zrange(args: any[], callback: ResCallbackT<any>): void;
    zrange(...args: any[]): Promise<any>;
    zrangebyscore(args: any[], callback: ResCallbackT<any>): void;
    zrangebyscore(...args: any[]): Promise<any>;
    zrevrangebyscore(args: any[], callback: ResCallbackT<any>): void;
    zrevrangebyscore(...args: any[]): Promise<any>;
    zcount(args: any[], callback: ResCallbackT<any>): void;
    zcount(...args: any[]): Promise<any>;
    zrevrange(args: any[], callback: ResCallbackT<any>): void;
    zrevrange(...args: any[]): Promise<any>;
    zcard(args: any[], callback: ResCallbackT<any>): void;
    zcard(...args: any[]): Promise<any>;
    zscore(args: any[], callback: ResCallbackT<any>): void;
    zscore(...args: any[]): Promise<any>;
    zrank(args: any[], callback: ResCallbackT<any>): void;
    zrank(...args: any[]): Promise<any>;
    zrevrank(args: any[], callback: ResCallbackT<any>): void;
    zrevrank(...args: any[]): Promise<any>;
    hset(args: any[], callback: ResCallbackT<any>): void;
    hset(...args: any[]): Promise<any>;
    hsetnx(args: any[], callback: ResCallbackT<any>): void;
    hsetnx(...args: any[]): Promise<any>;
    hget(args: any[], callback: ResCallbackT<any>): void;
    hget(...args: any[]): Promise<any>;
    // hmset(args: any[], callback: ResCallbackT<any>): void;
    // hmset(key: string, hash: any, callback: ResCallbackT<any>): void;
    // hmset(...args: any[]): Promise<any>;
    hmget(args: any[], callback: ResCallbackT<any>): void;
    hmget(...args: any[]): Promise<any>;
    hincrby(args: any[], callback: ResCallbackT<any>): void;
    hincrby(...args: any[]): Promise<any>;
    hincrbyfloat(args: any[], callback: ResCallbackT<any>): void;
    hincrbyfloat(...args: any[]): Promise<any>;
    hdel(args: any[], callback: ResCallbackT<any>): void;
    hdel(...args: any[]): Promise<any>;
    hlen(args: any[], callback: ResCallbackT<any>): void;
    hlen(...args: any[]): Promise<any>;
    hkeys(args: any[], callback: ResCallbackT<any>): void;
    hkeys(...args: any[]): Promise<any>;
    hvals(args: any[], callback: ResCallbackT<any>): void;
    hvals(...args: any[]): Promise<any>;
    // hgetall(args: any[], callback: ResCallbackT<any>): void;
    // hgetall(...args: any[]): Promise<any>;
    // hgetall(key: string, callback: ResCallbackT<any>): void;
    hexists(args: any[], callback: ResCallbackT<any>): void;
    hexists(...args: any[]): Promise<any>;
    incrby(args: any[], callback: ResCallbackT<any>): void;
    incrby(...args: any[]): Promise<any>;
    incrbyfloat(args: any[], callback: ResCallbackT<any>): void;
    incrbyfloat(...args: any[]): Promise<any>;
    decrby(args: any[], callback: ResCallbackT<any>): void;
    decrby(...args: any[]): Promise<any>;
    getset(args: any[], callback: ResCallbackT<any>): void;
    getset(...args: any[]): Promise<any>;
    mset(args: any[], callback: ResCallbackT<any>): void;
    mset(...args: any[]): Promise<any>;
    msetnx(args: any[], callback: ResCallbackT<any>): void;
    msetnx(...args: any[]): Promise<any>;
    randomkey(args: any[], callback: ResCallbackT<any>): void;
    randomkey(...args: any[]): Promise<any>;
    select(args: any[], callback: ResCallbackT<any>): void;
    select(...args: any[]): Promise<any>;
    move(args: any[], callback: ResCallbackT<any>): void;
    move(...args: any[]): Promise<any>;
    rename(args: any[], callback: ResCallbackT<any>): void;
    rename(...args: any[]): Promise<any>;
    renamenx(args: any[], callback: ResCallbackT<any>): void;
    renamenx(...args: any[]): Promise<any>;
    expire(args: any[], callback: ResCallbackT<any>): void;
    expire(...args: any[]): Promise<any>;
    pexpire(args: any[], callback: ResCallbackT<any>): void;
    pexpire(...args: any[]): Promise<any>;
    expireat(args: any[], callback: ResCallbackT<any>): void;
    expireat(...args: any[]): Promise<any>;
    pexpireat(args: any[], callback: ResCallbackT<any>): void;
    pexpireat(...args: any[]): Promise<any>;
    keys(args: any[], callback: ResCallbackT<any>): void;
    keys(...args: any[]): Promise<any>;
    dbsize(args: any[], callback: ResCallbackT<any>): void;
    dbsize(...args: any[]): Promise<any>;
    auth(args: any[], callback: ResCallbackT<any>): void;
    auth(...args: any[]): Promise<any>;
    ping(args: any[], callback: ResCallbackT<any>): void;
    ping(...args: any[]): Promise<any>;
    echo(args: any[], callback: ResCallbackT<any>): void;
    echo(...args: any[]): Promise<any>;
    save(args: any[], callback: ResCallbackT<any>): void;
    save(...args: any[]): Promise<any>;
    bgsave(args: any[], callback: ResCallbackT<any>): void;
    bgsave(...args: any[]): Promise<any>;
    bgrewriteaof(args: any[], callback: ResCallbackT<any>): void;
    bgrewriteaof(...args: any[]): Promise<any>;
    shutdown(args: any[], callback: ResCallbackT<any>): void;
    shutdown(...args: any[]): Promise<any>;
    lastsave(args: any[], callback: ResCallbackT<any>): void;
    lastsave(...args: any[]): Promise<any>;
    type(args: any[], callback: ResCallbackT<any>): void;
    type(...args: any[]): Promise<any>;
    // multi(args: any[], callback: ResCallbackT<any>): void;
    // multi(...args: any[]): Promise<any>;
    exec(args: any[], callback: ResCallbackT<any>): void;
    exec<+U>(...args: any[]): Promise<U>;
    discard(args: any[], callback: ResCallbackT<any>): void;
    discard(...args: any[]): Promise<any>;
    sync(args: any[], callback: ResCallbackT<any>): void;
    sync(...args: any[]): Promise<any>;
    flushdb(args: any[], callback: ResCallbackT<any>): void;
    flushdb(...args: any[]): Promise<any>;
    flushall(args: any[], callback: ResCallbackT<any>): void;
    flushall(...args: any[]): Promise<any>;
    sort(args: any[], callback: ResCallbackT<any>): void;
    sort(...args: any[]): Promise<any>;
    info(args: any[], callback: ResCallbackT<any>): void;
    info(...args: any[]): Promise<any>;
    time(args: any[], callback: ResCallbackT<any>): void;
    time(...args: any[]): Promise<any>;
    monitor(args: any[], callback: ResCallbackT<any>): void;
    monitor(...args: any[]): Promise<any>;
    ttl(args: any[], callback: ResCallbackT<any>): void;
    ttl(...args: any[]): Promise<any>;
    persist(args: any[], callback: ResCallbackT<any>): void;
    persist(...args: any[]): Promise<any>;
    slaveof(args: any[], callback: ResCallbackT<any>): void;
    slaveof(...args: any[]): Promise<any>;
    debug(args: any[], callback: ResCallbackT<any>): void;
    debug(...args: any[]): Promise<any>;
    config(args: any[], callback: ResCallbackT<any>): void;
    config(...args: any[]): Promise<any>;
    subscribe(args: any[], callback: ResCallbackT<any>): void;
    subscribe(...args: any[]): Promise<any>;

    psubscribe(args: any[], callback: ResCallbackT<any>): void;
    psubscribe(...args: any[]): Promise<any>;
    punsubscribe(args: any[], callback: ResCallbackT<any>): void;
    punsubscribe(...args: any[]): Promise<any>;
    publish(args: any[], callback: ResCallbackT<any>): void;
    publish(...args: any[]): Promise<any>;
    watch(args: any[], callback: ResCallbackT<any>): void;
    watch(...args: any[]): Promise<any>;
    unwatch(args: any[], callback: ResCallbackT<any>): void;
    unwatch(...args: any[]): Promise<any>;
    cluster(args: any[], callback: ResCallbackT<any>): void;
    cluster(...args: any[]): Promise<any>;
    restore(args: any[], callback: ResCallbackT<any>): void;
    restore(...args: any[]): Promise<any>;
    migrate(args: any[], callback: ResCallbackT<any>): void;
    migrate(...args: any[]): Promise<any>;
    dump(args: any[], callback: ResCallbackT<any>): void;
    dump(...args: any[]): Promise<any>;
    object(args: any[], callback: ResCallbackT<any>): void;
    object(...args: any[]): Promise<any>;
    client(args: any[], callback: ResCallbackT<any>): void;
    client(...args: any[]): Promise<any>;
    eval(args: any[], callback: ResCallbackT<any>): void;
    eval(...args: any[]): Promise<any>;
    evalsha(args: any[], callback: ResCallbackT<any>): void;
    evalsha(...args: any[]): Promise<any>;
    script(args: any[], callback: ResCallbackT<any>): void;
    script(...args: any[]): Promise<any>;
    script(key: string, callback: ResCallbackT<any>): void;
    quit(...args: any[]): Promise<any>;
    quit(args: any[], callback: ResCallbackT<any>): void;
    scan(...args: any[]): Promise<any>;
    scan(args: any[], callback: ResCallbackT<any>): void;
    hscan(...args: any[]): Promise<any>;
    hscan(args: any[], callback: ResCallbackT<any>): void;
    zscan(...args: any[]): Promise<any>;
    zscan(args: any[], callback: ResCallbackT<any>): void;

    // pipeline(): Pipeline;
    // pipeline(commands: string[][]): Pipeline;

    scanStream(options?: ScanStreamOption): events$EventEmitter;
    hscanStream(key: string, options?: ScanStreamOption): events$EventEmitter;
    zscanStream(key: string, options?: ScanStreamOption): events$EventEmitter;
  }

  declare type Redis$IntegerResult = 1 | 0;

  declare type Redis$SimpleResult = 'OK';

  declare function Redis$Callback<R>(err: void | Error, result: R): *;

  declare function $GetResults<T>(t: T): [void | Error, T];

  declare type $Results<T> = $Call<typeof $GetResults, T>;

  declare type Redis$ArrayOfResults<T> = Array<$Results<T>>;

  // declare function $MapTuple<T: $ComposeReverse>(T: T): [void | Error, T];

  // declare function $Reverse<A, B, C, D, E, F, G, H, I>(a: [A, B, C, D, E, F, G, H, I]): $NonMaybeType<[I, H, G, F, E, D, C, B, A]>;

  // $TupleMap<
  //   $Call<typeof $Filter, $Call<typeof $Reverse, $NonMaybeType<AA>>, typeof $Reverse>,
  //   typeof $MapTuple
  // >;

  declare type AnyObj = { [key: string]: mixed };

  declare export type Redis$Pipeline<
    A = void,
    B = void,
    C = void,
    D = void,
    E = void,
    F = void,
    G = void,
    H = void,
    I = void,
  > = {
    length: number,

    exec: () => Promise<
      Redis$ArrayOfResults<A | B | C | D | E | F | G | H | I>,
    >,
    // exec(callback: Redis$Callback<Redis$ArrayOfResults<A | B | C | D | E | F | G | H | I>>): any;

    hgetall<K: string>(
      key: K,
    ): Redis$Pipeline<void | AnyObj, A, B, C, D, E, F, G, H>,
    hgetall<K: string>(
      key: K,
      callback: Redis$Callback<*>,
    ): Redis$Pipeline<void | Object, A, B, C, D, E, F, G, H>,
    hmset<K, V>(
      key: K,
      value: V,
    ): Redis$Pipeline<Redis$SimpleResult, A, B, C, D, E, F, G, H>,
    hmset<K, V>(
      key: K,
      value: V,
      callback: Redis$Callback<Redis$SimpleResult>,
    ): Redis$Pipeline<Redis$SimpleResult, A, B, C, D, E, F, G, H>,
    pexpireat<K, T: number>(
      key: K,
      time: T,
    ): Redis$Pipeline<Redis$IntegerResult, A, B, C, D, E, F, G, H>,
    pexpireat<K, T: number>(
      key: K,
      time: T,
      callback: Redis$Callback<Redis$IntegerResult>,
    ): Redis$Pipeline<Redis$IntegerResult, A, B, C, D, E, F, G, H>,

    // stubs
    get(
      args: any[],
      callback?: ResCallbackT<string>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    get(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    set(
      args: any[],
      callback?: ResCallbackT<string>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    set(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    setnx(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    setnx(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    setex(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    setex(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    psetex(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    psetex(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    append(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    append(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    strlen(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    strlen(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    del(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    del(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    exists(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    exists(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    setbit(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    setbit(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    getbit(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    getbit(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    setrange(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    setrange(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    getrange(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    getrange(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    substr(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    substr(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    incr(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    incr(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    decr(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    decr(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    mget(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    mget(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    rpush(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    lpush(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    lpush(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    rpushx(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    rpushx(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    lpushx(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    lpushx(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    linsert(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    linsert(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    rpop(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    rpop(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    lpop(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    lpop(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    brpop(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    brpop(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    brpoplpush(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    brpoplpush(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    blpop(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    blpop(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    llen(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    llen(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    lindex(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    lindex(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    lset(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    lset(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    lrange(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    lrange(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    ltrim(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    ltrim(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    lrem(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    lrem(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    rpoplpush(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    rpoplpush(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    sadd(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    sadd(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    srem(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    srem(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    smove(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    smove(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    sismember(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    sismember(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    scard(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    scard(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    spop(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    spop(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    srandmember(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    srandmember(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    sinter(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    sinter(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    sinterstore(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    sinterstore(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    sunion(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    sunion(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    sunionstore(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    sunionstore(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    sdiff(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    sdiff(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    sdiffstore(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    sdiffstore(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    smembers(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    smembers(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    zadd(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    zadd(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    zincrby(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    zincrby(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    zrem(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    zrem(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    zremrangebyscore(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    zremrangebyscore(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    zremrangebyrank(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    zremrangebyrank(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    zunionstore(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    zunionstore(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    zinterstore(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    zinterstore(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    zrange(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    zrange(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    zrangebyscore(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    zrangebyscore(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    zrevrangebyscore(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    zrevrangebyscore(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    zcount(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    zcount(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    zrevrange(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    zrevrange(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    zcard(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    zcard(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    zscore(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    zscore(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    zrank(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    zrank(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    zrevrank(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    zrevrank(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    hset(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    hset(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    hsetnx(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    hsetnx(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    hget(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    hget(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    hincrby(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    hincrby(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    hincrbyfloat(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    hincrbyfloat(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    hdel(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    hdel(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    hlen(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    hlen(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    hkeys(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    hkeys(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    hvals(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    hvals(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    hexists(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    hexists(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    incrby(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    incrby(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    incrbyfloat(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    incrbyfloat(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    decrby(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    decrby(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    getset(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    getset(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    mset(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    mset(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    msetnx(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    msetnx(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    randomkey(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    randomkey(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    select(args: any[], callback?: ResCallbackT<any>): void,
    select(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    move(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    move(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    rename(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    rename(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    renamenx(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    renamenx(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    expire(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    expire(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    pexpire(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    pexpire(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    expireat(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    expireat(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    keys(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    keys(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    dbsize(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    dbsize(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    auth(args: any[], callback?: ResCallbackT<any>): void,
    auth(...args: any[]): void,
    ping(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    ping(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    echo(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    echo(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    save(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    save(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    bgsave(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    bgsave(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    bgrewriteaof(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    bgrewriteaof(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    shutdown(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    shutdown(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    lastsave(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    lastsave(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    type(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    type(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    multi(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    multi(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    discard(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    discard(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    sync(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    sync(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    flushdb(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    flushdb(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    flushall(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    flushall(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    sort(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    sort(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    info(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    info(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    time(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    time(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    monitor(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    monitor(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    ttl(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    ttl(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    persist(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    persist(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    slaveof(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    slaveof(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    debug(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    debug(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    config(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    config(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    subscribe(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    subscribe(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    unsubscribe(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    unsubscribe(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    psubscribe(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    psubscribe(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    punsubscribe(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    punsubscribe(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    publish(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    publish(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    watch(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    watch(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    unwatch(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    unwatch(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    cluster(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    cluster(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    restore(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    restore(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    migrate(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    migrate(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    dump(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    dump(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    object(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    object(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    client(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    client(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    eval(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    eval(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    evalsha(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    evalsha(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    quit(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    quit(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    scan(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    scan(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    hscan(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    hscan(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    zscan(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    zscan(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    hmget(
      args: any[],
      callback?: ResCallbackT<any>,
    ): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
    hmget(...args: any[]): Redis$Pipeline<A, B, C, D, E, F, G, H, I>,
  };

  // declare export interface Redis$Pipeline<
  //   A = empty,
  //   B = empty,
  //   C = empty,
  //   D = empty,
  //   E = empty,
  //   F = empty,
  //   G = empty,
  //   H = empty,
  //   I = empty
  // > {
  //   hgetall<K: string>(key: K): Redis$Pipeline<Object, A, B, C, D, E, F, G, H>;
  //   hgetall<K: string, V>(key: K, callback: Redis$Callback<V>): Redis$Pipeline<V, A, B, C, D, E, F, G, H>;
  //   hmset<K, V: *>(key: K, value: V): Redis$Pipeline<Redis$SimpleResult, A, B, C, D, E, F, G, H>;
  //   hmset<K, V: *>(key: K, value: V, callback: Redis$Callback<Redis$SimpleResult>): Redis$Pipeline<Redis$SimpleResult, A, B, C, D, E, F, G, H>;
  //   exec(): Promise<Redis$TupleOfResults<A, B, C, D, E, F, G, H, I>>;
  //   exec(callback: Redis$Callback<Redis$TupleOfResults<A, B, C, D, E, F, G, H, I>>): any;
  // }

  // declare interface Redis$Transaction extends Redis$Pipeline<> {
  //
  // }

  declare type Pipeline = {
    exec(callback?: ResCallbackT<any[]>): any,

    get(args: any[], callback?: ResCallbackT<string>): Pipeline,
    get(...args: any[]): Pipeline,
    set(args: any[], callback?: ResCallbackT<string>): Pipeline,
    set(...args: any[]): Pipeline,
    setnx(args: any[], callback?: ResCallbackT<any>): Pipeline,
    setnx(...args: any[]): Pipeline,
    setex(args: any[], callback?: ResCallbackT<any>): Pipeline,
    setex(...args: any[]): Pipeline,
    psetex(args: any[], callback?: ResCallbackT<any>): Pipeline,
    psetex(...args: any[]): Pipeline,
    append(args: any[], callback?: ResCallbackT<any>): Pipeline,
    append(...args: any[]): Pipeline,
    strlen(args: any[], callback?: ResCallbackT<any>): Pipeline,
    strlen(...args: any[]): Pipeline,
    del(args: any[], callback?: ResCallbackT<any>): Pipeline,
    del(...args: any[]): Pipeline,
    exists(args: any[], callback?: ResCallbackT<any>): Pipeline,
    exists(...args: any[]): Pipeline,
    setbit(args: any[], callback?: ResCallbackT<any>): Pipeline,
    setbit(...args: any[]): Pipeline,
    getbit(args: any[], callback?: ResCallbackT<any>): Pipeline,
    getbit(...args: any[]): Pipeline,
    setrange(args: any[], callback?: ResCallbackT<any>): Pipeline,
    setrange(...args: any[]): Pipeline,
    getrange(args: any[], callback?: ResCallbackT<any>): Pipeline,
    getrange(...args: any[]): Pipeline,
    substr(args: any[], callback?: ResCallbackT<any>): Pipeline,
    substr(...args: any[]): Pipeline,
    incr(args: any[], callback?: ResCallbackT<any>): Pipeline,
    incr(...args: any[]): Pipeline,
    decr(args: any[], callback?: ResCallbackT<any>): Pipeline,
    decr(...args: any[]): Pipeline,
    mget(args: any[], callback?: ResCallbackT<any>): Pipeline,
    mget(...args: any[]): Pipeline,
    rpush(...args: any[]): Pipeline,
    lpush(args: any[], callback?: ResCallbackT<any>): Pipeline,
    lpush(...args: any[]): Pipeline,
    rpushx(args: any[], callback?: ResCallbackT<any>): Pipeline,
    rpushx(...args: any[]): Pipeline,
    lpushx(args: any[], callback?: ResCallbackT<any>): Pipeline,
    lpushx(...args: any[]): Pipeline,
    linsert(args: any[], callback?: ResCallbackT<any>): Pipeline,
    linsert(...args: any[]): Pipeline,
    rpop(args: any[], callback?: ResCallbackT<any>): Pipeline,
    rpop(...args: any[]): Pipeline,
    lpop(args: any[], callback?: ResCallbackT<any>): Pipeline,
    lpop(...args: any[]): Pipeline,
    brpop(args: any[], callback?: ResCallbackT<any>): Pipeline,
    brpop(...args: any[]): Pipeline,
    brpoplpush(args: any[], callback?: ResCallbackT<any>): Pipeline,
    brpoplpush(...args: any[]): Pipeline,
    blpop(args: any[], callback?: ResCallbackT<any>): Pipeline,
    blpop(...args: any[]): Pipeline,
    llen(args: any[], callback?: ResCallbackT<any>): Pipeline,
    llen(...args: any[]): Pipeline,
    lindex(args: any[], callback?: ResCallbackT<any>): Pipeline,
    lindex(...args: any[]): Pipeline,
    lset(args: any[], callback?: ResCallbackT<any>): Pipeline,
    lset(...args: any[]): Pipeline,
    lrange(args: any[], callback?: ResCallbackT<any>): Pipeline,
    lrange(...args: any[]): Pipeline,
    ltrim(args: any[], callback?: ResCallbackT<any>): Pipeline,
    ltrim(...args: any[]): Pipeline,
    lrem(args: any[], callback?: ResCallbackT<any>): Pipeline,
    lrem(...args: any[]): Pipeline,
    rpoplpush(args: any[], callback?: ResCallbackT<any>): Pipeline,
    rpoplpush(...args: any[]): Pipeline,
    sadd(args: any[], callback?: ResCallbackT<any>): Pipeline,
    sadd(...args: any[]): Pipeline,
    srem(args: any[], callback?: ResCallbackT<any>): Pipeline,
    srem(...args: any[]): Pipeline,
    smove(args: any[], callback?: ResCallbackT<any>): Pipeline,
    smove(...args: any[]): Pipeline,
    sismember(args: any[], callback?: ResCallbackT<any>): Pipeline,
    sismember(...args: any[]): Pipeline,
    scard(args: any[], callback?: ResCallbackT<any>): Pipeline,
    scard(...args: any[]): Pipeline,
    spop(args: any[], callback?: ResCallbackT<any>): Pipeline,
    spop(...args: any[]): Pipeline,
    srandmember(args: any[], callback?: ResCallbackT<any>): Pipeline,
    srandmember(...args: any[]): Pipeline,
    sinter(args: any[], callback?: ResCallbackT<any>): Pipeline,
    sinter(...args: any[]): Pipeline,
    sinterstore(args: any[], callback?: ResCallbackT<any>): Pipeline,
    sinterstore(...args: any[]): Pipeline,
    sunion(args: any[], callback?: ResCallbackT<any>): Pipeline,
    sunion(...args: any[]): Pipeline,
    sunionstore(args: any[], callback?: ResCallbackT<any>): Pipeline,
    sunionstore(...args: any[]): Pipeline,
    sdiff(args: any[], callback?: ResCallbackT<any>): Pipeline,
    sdiff(...args: any[]): Pipeline,
    sdiffstore(args: any[], callback?: ResCallbackT<any>): Pipeline,
    sdiffstore(...args: any[]): Pipeline,
    smembers(args: any[], callback?: ResCallbackT<any>): Pipeline,
    smembers(...args: any[]): Pipeline,
    zadd(args: any[], callback?: ResCallbackT<any>): Pipeline,
    zadd(...args: any[]): Pipeline,
    zincrby(args: any[], callback?: ResCallbackT<any>): Pipeline,
    zincrby(...args: any[]): Pipeline,
    zrem(args: any[], callback?: ResCallbackT<any>): Pipeline,
    zrem(...args: any[]): Pipeline,
    zremrangebyscore(args: any[], callback?: ResCallbackT<any>): Pipeline,
    zremrangebyscore(...args: any[]): Pipeline,
    zremrangebyrank(args: any[], callback?: ResCallbackT<any>): Pipeline,
    zremrangebyrank(...args: any[]): Pipeline,
    zunionstore(args: any[], callback?: ResCallbackT<any>): Pipeline,
    zunionstore(...args: any[]): Pipeline,
    zinterstore(args: any[], callback?: ResCallbackT<any>): Pipeline,
    zinterstore(...args: any[]): Pipeline,
    zrange(args: any[], callback?: ResCallbackT<any>): Pipeline,
    zrange(...args: any[]): Pipeline,
    zrangebyscore(args: any[], callback?: ResCallbackT<any>): Pipeline,
    zrangebyscore(...args: any[]): Pipeline,
    zrevrangebyscore(args: any[], callback?: ResCallbackT<any>): Pipeline,
    zrevrangebyscore(...args: any[]): Pipeline,
    zcount(args: any[], callback?: ResCallbackT<any>): Pipeline,
    zcount(...args: any[]): Pipeline,
    zrevrange(args: any[], callback?: ResCallbackT<any>): Pipeline,
    zrevrange(...args: any[]): Pipeline,
    zcard(args: any[], callback?: ResCallbackT<any>): Pipeline,
    zcard(...args: any[]): Pipeline,
    zscore(args: any[], callback?: ResCallbackT<any>): Pipeline,
    zscore(...args: any[]): Pipeline,
    zrank(args: any[], callback?: ResCallbackT<any>): Pipeline,
    zrank(...args: any[]): Pipeline,
    zrevrank(args: any[], callback?: ResCallbackT<any>): Pipeline,
    zrevrank(...args: any[]): Pipeline,
    hset(args: any[], callback?: ResCallbackT<any>): Pipeline,
    hset(...args: any[]): Pipeline,
    hsetnx(args: any[], callback?: ResCallbackT<any>): Pipeline,
    hsetnx(...args: any[]): Pipeline,
    hget(args: any[], callback?: ResCallbackT<any>): Pipeline,
    hget(...args: any[]): Pipeline,
    hmset(args: any[], callback?: ResCallbackT<any>): Pipeline,
    hmset(key: string, hash: any, callback?: ResCallbackT<any>): Pipeline,
    hmset(...args: any[]): Pipeline,
    hmget(args: any[], callback?: ResCallbackT<any>): Pipeline,
    hmget(...args: any[]): Pipeline,
    hincrby(args: any[], callback?: ResCallbackT<any>): Pipeline,
    hincrby(...args: any[]): Pipeline,
    hincrbyfloat(args: any[], callback?: ResCallbackT<any>): Pipeline,
    hincrbyfloat(...args: any[]): Pipeline,
    hdel(args: any[], callback?: ResCallbackT<any>): Pipeline,
    hdel(...args: any[]): Pipeline,
    hlen(args: any[], callback?: ResCallbackT<any>): Pipeline,
    hlen(...args: any[]): Pipeline,
    hkeys(args: any[], callback?: ResCallbackT<any>): Pipeline,
    hkeys(...args: any[]): Pipeline,
    hvals(args: any[], callback?: ResCallbackT<any>): Pipeline,
    hvals(...args: any[]): Pipeline,
    hgetall(args: any[], callback?: ResCallbackT<any>): Pipeline,
    hgetall(...args: any[]): Pipeline,
    hgetall(key: string, callback?: ResCallbackT<any>): Pipeline,
    hexists(args: any[], callback?: ResCallbackT<any>): Pipeline,
    hexists(...args: any[]): Pipeline,
    incrby(args: any[], callback?: ResCallbackT<any>): Pipeline,
    incrby(...args: any[]): Pipeline,
    incrbyfloat(args: any[], callback?: ResCallbackT<any>): Pipeline,
    incrbyfloat(...args: any[]): Pipeline,
    decrby(args: any[], callback?: ResCallbackT<any>): Pipeline,
    decrby(...args: any[]): Pipeline,
    getset(args: any[], callback?: ResCallbackT<any>): Pipeline,
    getset(...args: any[]): Pipeline,
    mset(args: any[], callback?: ResCallbackT<any>): Pipeline,
    mset(...args: any[]): Pipeline,
    msetnx(args: any[], callback?: ResCallbackT<any>): Pipeline,
    msetnx(...args: any[]): Pipeline,
    randomkey(args: any[], callback?: ResCallbackT<any>): Pipeline,
    randomkey(...args: any[]): Pipeline,
    select(args: any[], callback?: ResCallbackT<any>): void,
    select(...args: any[]): Pipeline,
    move(args: any[], callback?: ResCallbackT<any>): Pipeline,
    move(...args: any[]): Pipeline,
    rename(args: any[], callback?: ResCallbackT<any>): Pipeline,
    rename(...args: any[]): Pipeline,
    renamenx(args: any[], callback?: ResCallbackT<any>): Pipeline,
    renamenx(...args: any[]): Pipeline,
    expire(args: any[], callback?: ResCallbackT<any>): Pipeline,
    expire(...args: any[]): Pipeline,
    pexpire(args: any[], callback?: ResCallbackT<any>): Pipeline,
    pexpire(...args: any[]): Pipeline,
    expireat(args: any[], callback?: ResCallbackT<any>): Pipeline,
    expireat(...args: any[]): Pipeline,
    pexpireat(args: any[], callback?: ResCallbackT<any>): Pipeline,
    pexpireat(...args: any[]): Pipeline,
    keys(args: any[], callback?: ResCallbackT<any>): Pipeline,
    keys(...args: any[]): Pipeline,
    dbsize(args: any[], callback?: ResCallbackT<any>): Pipeline,
    dbsize(...args: any[]): Pipeline,
    auth(args: any[], callback?: ResCallbackT<any>): void,
    auth(...args: any[]): void,
    ping(args: any[], callback?: ResCallbackT<any>): Pipeline,
    ping(...args: any[]): Pipeline,
    echo(args: any[], callback?: ResCallbackT<any>): Pipeline,
    echo(...args: any[]): Pipeline,
    save(args: any[], callback?: ResCallbackT<any>): Pipeline,
    save(...args: any[]): Pipeline,
    bgsave(args: any[], callback?: ResCallbackT<any>): Pipeline,
    bgsave(...args: any[]): Pipeline,
    bgrewriteaof(args: any[], callback?: ResCallbackT<any>): Pipeline,
    bgrewriteaof(...args: any[]): Pipeline,
    shutdown(args: any[], callback?: ResCallbackT<any>): Pipeline,
    shutdown(...args: any[]): Pipeline,
    lastsave(args: any[], callback?: ResCallbackT<any>): Pipeline,
    lastsave(...args: any[]): Pipeline,
    type(args: any[], callback?: ResCallbackT<any>): Pipeline,
    type(...args: any[]): Pipeline,
    multi(args: any[], callback?: ResCallbackT<any>): Pipeline,
    multi(...args: any[]): Pipeline,
    exec(args: any[], callback?: ResCallbackT<any>): Pipeline,
    exec(...args: any[]): Pipeline,
    discard(args: any[], callback?: ResCallbackT<any>): Pipeline,
    discard(...args: any[]): Pipeline,
    sync(args: any[], callback?: ResCallbackT<any>): Pipeline,
    sync(...args: any[]): Pipeline,
    flushdb(args: any[], callback?: ResCallbackT<any>): Pipeline,
    flushdb(...args: any[]): Pipeline,
    flushall(args: any[], callback?: ResCallbackT<any>): Pipeline,
    flushall(...args: any[]): Pipeline,
    sort(args: any[], callback?: ResCallbackT<any>): Pipeline,
    sort(...args: any[]): Pipeline,
    info(args: any[], callback?: ResCallbackT<any>): Pipeline,
    info(...args: any[]): Pipeline,
    time(args: any[], callback?: ResCallbackT<any>): Pipeline,
    time(...args: any[]): Pipeline,
    monitor(args: any[], callback?: ResCallbackT<any>): Pipeline,
    monitor(...args: any[]): Pipeline,
    ttl(args: any[], callback?: ResCallbackT<any>): Pipeline,
    ttl(...args: any[]): Pipeline,
    persist(args: any[], callback?: ResCallbackT<any>): Pipeline,
    persist(...args: any[]): Pipeline,
    slaveof(args: any[], callback?: ResCallbackT<any>): Pipeline,
    slaveof(...args: any[]): Pipeline,
    debug(args: any[], callback?: ResCallbackT<any>): Pipeline,
    debug(...args: any[]): Pipeline,
    config(args: any[], callback?: ResCallbackT<any>): Pipeline,
    config(...args: any[]): Pipeline,
    subscribe(args: any[], callback?: ResCallbackT<any>): Pipeline,
    subscribe(...args: any[]): Pipeline,
    unsubscribe(args: any[], callback?: ResCallbackT<any>): Pipeline,
    unsubscribe(...args: any[]): Pipeline,
    psubscribe(args: any[], callback?: ResCallbackT<any>): Pipeline,
    psubscribe(...args: any[]): Pipeline,
    punsubscribe(args: any[], callback?: ResCallbackT<any>): Pipeline,
    punsubscribe(...args: any[]): Pipeline,
    publish(args: any[], callback?: ResCallbackT<any>): Pipeline,
    publish(...args: any[]): Pipeline,
    watch(args: any[], callback?: ResCallbackT<any>): Pipeline,
    watch(...args: any[]): Pipeline,
    unwatch(args: any[], callback?: ResCallbackT<any>): Pipeline,
    unwatch(...args: any[]): Pipeline,
    cluster(args: any[], callback?: ResCallbackT<any>): Pipeline,
    cluster(...args: any[]): Pipeline,
    restore(args: any[], callback?: ResCallbackT<any>): Pipeline,
    restore(...args: any[]): Pipeline,
    migrate(args: any[], callback?: ResCallbackT<any>): Pipeline,
    migrate(...args: any[]): Pipeline,
    dump(args: any[], callback?: ResCallbackT<any>): Pipeline,
    dump(...args: any[]): Pipeline,
    object(args: any[], callback?: ResCallbackT<any>): Pipeline,
    object(...args: any[]): Pipeline,
    client(args: any[], callback?: ResCallbackT<any>): Pipeline,
    client(...args: any[]): Pipeline,
    eval(args: any[], callback?: ResCallbackT<any>): Pipeline,
    eval(...args: any[]): Pipeline,
    evalsha(args: any[], callback?: ResCallbackT<any>): Pipeline,
    evalsha(...args: any[]): Pipeline,
    quit(args: any[], callback?: ResCallbackT<any>): Pipeline,
    quit(...args: any[]): Pipeline,
    scan(...args: any[]): Pipeline,
    scan(args: any[], callback?: ResCallbackT<any>): Pipeline,
    hscan(...args: any[]): Pipeline,
    hscan(args: any[], callback?: ResCallbackT<any>): Pipeline,
    zscan(...args: any[]): Pipeline,
    zscan(args: any[], callback?: ResCallbackT<any>): Pipeline,
  };

  declare export type Redis$Commands = $Keys<Pipeline>;

  declare class Cluster extends Redis {
    constructor(
      nodes: { host: string, port: number }[],
      options?: ClusterOptions,
    ): void;
    nodes(role: string): Redis[];
  }

  declare type ResCallbackT<R> = (err: Error, res: R) => void;

  declare type RedisOptions = {
    port?: number,
    host?: string,
    /**
     * 4 (IPv4) or 6 (IPv6), Defaults to 4.
     */
    family?: number,
    /**
     * Local domain socket path. If set the port, host and family will be ignored.
     */
    path?: string,
    /**
     * TCP KeepAlive on the socket with a X ms delay before start. Set to a non-number value to disable keepAlive.
     */
    keepAlive?: number,
    connectionName?: string,
    /**
     * If set, client will send AUTH command with the value of this option when connected.
     */
    password?: string,
    /**
     * Database index to use.
     */
    db?: number,
    /**
     * When a connection is established to the Redis server, the server might still be loading
     * the database from disk. While loading, the server not respond to any commands.
     * To work around this, when this option is true, ioredis will check the status of the Redis server,
     * and when the Redis server is able to process commands, a ready event will be emitted.
     */
    enableReadyCheck?: boolean,
    keyPrefix?: string,
    /**
     * When the return value isn't a number, ioredis will stop trying to reconnect.
     * Fixed in: https://github.com/DefinitelyTyped/DefinitelyTyped/pull/15858
     */
    retryStrategy?: (times: number) => number | false,
    reconnectOnError?: (error: Error) => boolean,
    /**
     * By default, if there is no active connection to the Redis server, commands are added to a queue
     * and are executed once the connection is "ready" (when enableReadyCheck is true, "ready" means
     * the Redis server has loaded the database from disk, otherwise means the connection to the Redis
     * server has been established). If this option is false, when execute the command when the connection
     * isn't ready, an error will be returned.
     */
    enableOfflineQueue?: boolean,
    /**
     * The milliseconds before a timeout occurs during the initial connection to the Redis server.
     * default: 10000.
     */
    connectTimeout?: number,
    /**
     * After reconnected, if the previous connection was in the subscriber mode, client will auto re-subscribe these channels.
     * default: true.
     */
    autoResubscribe?: boolean,
    /**
     * If true, client will resend unfulfilled commands(e.g. block commands) in the previous connection when reconnected.
     * default: true.
     */
    autoResendUnfulfilledCommands?: boolean,
    lazyConnect?: boolean,
    tls?: {
      ca: Buffer,
    },
    sentinels?: { host: string, port: number }[],
    name?: string,
    /**
     * Enable READONLY mode for the connection. Only available for cluster mode.
     * default: false.
     */
    readOnly?: boolean,
    /**
     * If you are using the hiredis parser, it's highly recommended to enable this option.
     * Create another instance with dropBufferSupport disabled for other commands that you want to return binary instead of string:
     */
    dropBufferSupport?: boolean,
  };

  declare type ScanStreamOption = {
    match?: string,
    count?: number,
  };

  declare type ClusterNodeType = 'all' | 'slave' | 'master';

  declare type ClusterOptions = {
    clusterRetryStrategy?: (times: number) => number,
    enableOfflineQueue?: boolean,
    enableReadyCheck?: boolean,
    scaleReads?: ClusterNodeType,
    maxRedirections?: number,
    retryDelayOnFailover?: number,
    retryDelayOnClusterDown?: number,
    retryDelayOnTryAgain?: number,
    redisOptions?: RedisOptions,
  };

  declare class RedisStatic extends Redis {
    static Cluster: Class<Cluster>;
    static Commander: Class<Commander>;
  }

  declare var exports: typeof RedisStatic;
}
