"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = exports.initRedis = void 0;
const redis_1 = require("redis");
const redisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_URL,
    socket: {
        tls: true,
        keepAlive: 10000,
        reconnectStrategy: (retries) => Math.min(retries * 50, 1000)
    },
});
exports.redisClient = redisClient;
// if it not works : {
//    url:'redis://localhost:6379'}
const initRedis = async () => {
    redisClient.on("error", (err) => console.log("Redis Error:", err));
    await redisClient.connect();
    console.log("Connected to Redis!");
    redisClient.on('end', async () => {
        console.log('Redis connection lost. Reconnecting...');
        setTimeout(async () => {
            await redisClient.connect();
        }, 1000);
    });
};
exports.initRedis = initRedis;
