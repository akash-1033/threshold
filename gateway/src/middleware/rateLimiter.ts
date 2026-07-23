import type { Request, Response, NextFunction } from 'express';
import redisClient from "../redis.js";
import fs from "node:fs";
import path from "node:path";

const luaScriptPath = path.resolve(process.cwd(), "src/lua/slidingWindow.lua");
const luaScript = fs.readFileSync(luaScriptPath, "utf8");

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

        const result = await redisClient.eval(luaScript, {
            keys: [redisId],
            arguments: [
                rate_limit.limit.toString(),
                rate_limit.time.toString(),
                Date.now().toString()
            ]
        }) as [boolean, number, number];

        const [success, requests, ttlLeft] = result;

        if (!success) {
            response.setHeader("Retry-After", ttlLeft);
            return response.status(429).json({
                message: `too many requests!! retry after ${ttlLeft} seconds`,
            });
        }
        next();
    };
};