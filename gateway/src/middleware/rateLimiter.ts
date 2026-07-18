import type { Request, Response, NextFunction } from 'express';
import redisClient from "../redis.js";

export interface RateLimiterRule {
    rate_limit: {
        time: number;
        limit: number;
    };
}

export const rateLimiter = (rule: RateLimiterRule) => {
    const { rate_limit } = rule;
    return async (request: Request, response: Response, next: NextFunction) => {
        const ipAddress = request.ip;
        const currentEndpoint = request.path;
        const redisId = `${currentEndpoint}/${ipAddress}`;

        const requests = await redisClient.incr(redisId);
        if (requests === 1) {
            await redisClient.expire(redisId, rate_limit.time);
        }

        if (requests > rate_limit.limit) {
            const ttlLeft = await redisClient.ttl(redisId);
            response.setHeader("Retry-After", ttlLeft);
            return response.status(429).json({
                message: `too many requests!! retry after ${ttlLeft} seconds`,
            });
        }
        next();
    };
};