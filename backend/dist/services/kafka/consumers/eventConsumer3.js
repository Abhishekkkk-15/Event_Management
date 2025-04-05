"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startEventConsumer3 = void 0;
const fs_1 = __importDefault(require("fs"));
const kafkaClient_1 = require("../kafkaClient");
const consumer = kafkaClient_1.kafka.consumer({ groupId: 'event-creation-group' });
const cloudinaryConfig_1 = __importDefault(require("../../../lib/cloudinaryConfig"));
const db_1 = require("../../../lib/db");
const queue_1 = require("../../../bullMQ/queue");
const startEventConsumer3 = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: "create-events", fromBeginning: true });
    try {
        await consumer.run({
            eachMessage: async ({ topic, message }) => {
                const data = JSON.parse(message.value?.toString() || "{}");
                const { event, files, userId } = data;
                console.log("event Consumer3");
                try {
                    console.log("📥 Kafka: Processing event creation");
                    const date = new Date(event.date).toISOString();
                    const images = [];
                    for (const filePath of files) {
                        const uploadedUrl = await (0, cloudinaryConfig_1.default)(filePath);
                        images.push(uploadedUrl);
                        fs_1.default.unlinkSync(filePath); // cleanup
                    }
                    const newEvent = await db_1.db.event.create({
                        data: {
                            title: event.title,
                            description: event.description,
                            location: event.location,
                            date,
                            userId,
                            maxSlots: Number(event.maxSlots) || 10,
                            eventImages: images,
                            price: Number(event.price),
                            category: event.category,
                            startAt: event.startAt,
                            endAt: event.endAt
                        }
                    });
                    queue_1.sendEmailQueue.add("success-email", {
                        userEmail: event.userEmail,
                        eventTitle: event.title,
                        eventDate: date
                    });
                }
                catch (error) {
                    queue_1.sendEmailQueue.add("failure-email", {
                        userEmail: event.userEmail,
                        eventTitle: event.title,
                        errorMessage: error.message
                    });
                    console.log("Error while creating Event");
                }
            }
        });
    }
    catch (error) {
        console.error("Failed to process Kafka message", error);
    }
};
exports.startEventConsumer3 = startEventConsumer3;
