-- name:  hsetifeq
-- keys:  key field value
local value = unpack(redis.call("HMGET", KEYS[1], KEYS[2]))
local check = KEYS[3]
if value == check then
  return redis.call("HMSET", KEYS[1], unpack(ARGV))
else
  return nil
end
