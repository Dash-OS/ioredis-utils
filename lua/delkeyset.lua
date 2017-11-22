--[[
  Summary:
    Given a key that contains a Redis "KeySet", iterates and removes each key.
    When complete, deletes the given set.  If args are given, iterates and
    removes the given members if they exist.

    Note: If the key exists but they are not a member of the keyset then they
    will not be removed.

    If the KeySet ends up being empty, it is also removed.

    Returns:
    [ KeySetRemoved (1/0), TotalDeleted (n), Array<SetMembers> ]
]]
--| name:    delkeyset
--| dynamic: false
--| keys:    KeySet
local SetKey = KEYS[1]

local RemoveKeys = {}
local RemovingSet = false

if #ARGV > 0 then
  local TotalMembers = redis.call("SCARD", SetKey)
  if TotalMembers == 0 then
    redis.call("DEL", SetKey)
    return {0, RemoveKeys}
  end

  local RKPosition = 0

  for i = 1, #ARGV do
    local MemberKey = ARGV[i]
    local IsMember = redis.call("SISMEMBER", SetKey, MemberKey)
    if IsMember == 1 then
      RKPosition = RKPosition + 1
      RemoveKeys[RKPosition] = MemberKey
    end
  end

  if RKPosition == TotalMembers then
    RemovingSet = true
  else
    redis.call("SREM", SetKey, unpack(RemoveKeys))
  end
else
  RemoveKeys = redis.call("SMEMBERS", SetKey)
  RemovingSet = true
end

local TotalDeleted
if RemovingSet then
  TotalDeleted = redis.call("DEL", SetKey, unpack(RemoveKeys)) - 1
else
  TotalDeleted = redis.call("DEL", unpack(RemoveKeys))
end

return {RemovingSet, TotalDeleted, RemoveKeys}
