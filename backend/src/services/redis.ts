import { createClient } from "redis";

const redisClient = createClient({
    url: process.env.REDIS_URL,
    socket: {
        
        tls: true,
        rejectUnauthorized: false,
        keepAlive: 30,  // Increased keep-alive time
        reconnectStrategy: (retries) => Math.min(retries * 200, 5000), // Improved reconnect strategy
    },
    pingInterval: 10000, // Send PING every 10 seconds
});

const initRedis = async () => {
    redisClient.on("error", (err) => console.log("❌ Redis Error:", err));

    try {
        await redisClient.connect();
        console.log("✅ Connected to Redis!");
    } catch (error) {
        console.error("❌ Redis connection failed:", error);
    }

    redisClient.on("end", async () => {
        console.log("⚠️ Redis connection lost. Checking connection...");
        try {
            await redisClient.ping();
        } catch (error) {
            console.log("🔄 Reconnecting to Redis...");
            await redisClient.connect();
        }
    });
};

export { initRedis, redisClient };
