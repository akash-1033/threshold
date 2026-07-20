import { createClient } from "redis";
import type { RedisClientType } from "redis";

const REDIS_CONFIG = {
    HOST: process.env.REDIS_HOST || 'localhost',
    PORT: parseInt(process.env.REDIS_PORT || '6379', 10),
};

export const redisClient: RedisClientType = createClient({
    socket: {
        host: REDIS_CONFIG.HOST,
        port: REDIS_CONFIG.PORT,
    },
});

redisClient.connect().catch((err) => {
    console.error("Failed to connect to Redis:", err);
});

export default redisClient;