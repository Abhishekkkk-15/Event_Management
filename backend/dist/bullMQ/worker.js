"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinaryConfig_1 = __importDefault(require("../lib/cloudinaryConfig"));
const db_1 = require("../lib/db");
const fileHandling_1 = __importDefault(require("../lib/fileHandling"));
const bullmq_1 = require("bullmq");
const redisConnetion = {
    host: "localhost",
    port: 6379,
};
const addEventWorker = new bullmq_1.Worker('add-event-queue', async (job) => {
    try {
        console.log("Its working");
        console.log("Processing job", job.id);
        const { event, files, userId } = job.data;
        const date = new Date(event.date).toISOString();
        const images = [];
        console.log(event.userEmail);
        for (const file of files) {
            const filePath = await (0, fileHandling_1.default)(file);
            const upload = await (0, cloudinaryConfig_1.default)(filePath);
            images.push(upload);
        }
        const newEvent = await db_1.db.event.create({
            data: {
                title: event.title,
                description: event.description,
                location: event.location,
                date: date,
                userId,
                maxSlots: Number(event.maxSlots) || 10,
                eventImages: images,
                price: event.price,
                category: event.category,
                startAt: event.startAt,
                endAt: event.endAt
            }
        });
        console.log(`Event created successfully: ${newEvent.id}`);
        return newEvent;
    }
    catch (error) {
        console.error("Error processing event job:", error);
        throw error;
    }
}, {
    connection: {
        host: "localhost",
        port: 6379,
    }
});
