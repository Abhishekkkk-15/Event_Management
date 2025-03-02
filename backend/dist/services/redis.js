"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = exports.initRedis = void 0;
const redis_1 = require("redis");
const redisClient = (0, redis_1.createClient)();
exports.redisClient = redisClient;
// if it not works : {
//    url:'redis://localhost:6379'}
const initRedis = async () => {
    redisClient.on("error", (err) => console.log("Redis Error:", err));
    await redisClient.connect();
    console.log("Connected to Redis!");
};
exports.initRedis = initRedis;
