"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = exports.initRedis = void 0;
const redis_1 = require("redis");
const redisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_URL,
    socket: {
        tls: true,
        rejectUnauthorized: false,
        keepAlive: 10000,
        reconnectStrategy: (retries) => Math.min(retries * 50, 1000),
    },
});
exports.redisClient = redisClient;
const initRedis = async () => {
    redisClient.on("error", (err) => console.log("Redis Error:", err));
    try {
        await redisClient.connect();
        console.log("✅ Connected to Redis!");
    }
    catch (error) {
        console.error("❌ Redis connection failed:", error);
    }
    redisClient.on("end", async () => {
        console.log("Redis connection lost. Reconnecting...");
        await redisClient.quit();
        await redisClient.connect();
    });
};
exports.initRedis = initRedis;
