-- name:  hsetifget
-- keys:  key field value
-- If field equals value, set then return new hash
local value = unpack(redis.call("HMGET", KEYS[1], KEYS[2]))
local check = KEYS[3]
if value == check then
  local result = redis.call("HMSET", KEYS[1], unpack(ARGV))
  if result["ok"] then
    return redis.call("HGETALL", KEYS[1])
  end
else
  return nil
end
