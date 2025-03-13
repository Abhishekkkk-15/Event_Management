"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailWorker = exports.addEventWorker = void 0;
const cloudinaryConfig_1 = __importDefault(require("../lib/cloudinaryConfig"));
const db_1 = require("../lib/db");
const bullmq_1 = require("bullmq");
const mailTransporter_1 = require("../lib/mailTransporter");
const queue_1 = require("./queue");
const fs_1 = __importDefault(require("fs"));
exports.addEventWorker = new bullmq_1.Worker('add-event-queue', async (job) => {
    const { event, files, userId } = job.data;
    try {
        console.log("Processing job", job.id);
        const date = new Date(event.date).toISOString();
        const images = [];
        for (const filePath of files) { // ✅ Now it contains file paths
            const uploadedUrl = await (0, cloudinaryConfig_1.default)(filePath); // ✅ Upload directly
            images.push(uploadedUrl);
            fs_1.default.unlinkSync(filePath);
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
        console.log(`Event created successfully: ${newEvent.id}`);
        return newEvent;
    }
    catch (error) {
        console.error("Error processing event job:", error);
        queue_1.sendEmailQueue.add("failure-email", {
            userEmail: event.userEmail,
            eventTitle: event.title,
            errorMessage: error.message
        });
        throw error;
    }
}, {
    connection: {
        url: process.env.REDIS_URL
    }
});
exports.sendEmailWorker = new bullmq_1.Worker('send-email-queue', async (job) => {
    const { userEmail, eventTitle, errorMessage, eventDate, ticketId, tickets, eventTitleForBookEvent } = job.data;
    if (job.name === "success-email") {
        console.log(`Sending success email to ${userEmail}`);
        console.log("job id : ", job.id);
        try {
            await mailTransporter_1.transporter.sendMail((0, mailTransporter_1.successMailOptions)(userEmail, eventTitle, eventDate));
        }
        catch (error) {
            console.log("Error while sending email : ", error);
        }
    }
    else if (job.name === "failure-email") {
        console.log(`Sending failure email to ${userEmail}`);
        console.log("job id : ", job.id);
        // Send failure email
        try {
            await mailTransporter_1.transporter.sendMail((0, mailTransporter_1.failureMailOptions)(userEmail, eventTitle, errorMessage));
        }
        catch (error) {
            console.log("Error while sending email : ", error);
        }
    }
    else if (job.name === "book-ticket-email") {
        console.log(`Sending ticket email to ${userEmail}`);
        console.log("job id : ", job.id);
        console.log(eventTitleForBookEvent);
        // Send ticket email
        (0, mailTransporter_1.sendEmail)(ticketId, userEmail, eventTitleForBookEvent, tickets);
    }
}, {
    connection: {
        url: process.env.REDIS_URL,
    }
});
