local key = KEYS[1]
local limit = tonumber(ARGV[1])
local window = tonumber(ARGV[2]) -- in seconds
local now = tonumber(ARGV[3]) -- in milliseconds

local clearBefore = now - (window * 1000)
redis.call('zremrangebyscore', key, '-inf', clearBefore)
local currentCount = redis.call('zcard', key)

if currentCount >= limit then
    local oldest = redis.call('zrange', key, 0, 0, 'withscores')
    local oldest_time = tonumber(oldest[2])
    
    local retryAfter = math.max(0, math.ceil((oldest_time + (window * 1000) - now) / 1000))
    
    return {false, retryAfter}
else
    local reqId = redis.call('incr', 'global:request:id')
    redis.call('zadd', key, now, now .. ":" .. reqId)
    redis.call('expire', key, window)
    
    return {true, window}
end
