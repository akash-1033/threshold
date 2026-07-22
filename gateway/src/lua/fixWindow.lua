local key = KEYS[1]
local limit = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local current = redis.call('get', key)
if current and tonumber(current) >= limit then
    return { tonumber(current) + 1, redis.call('ttl', key) }
else
    local newVal = redis.call('incr', key)
    if newVal == 1 then
        redis.call('expire', key, window)
    end
    return { newVal, redis.call('ttl', key) }
end