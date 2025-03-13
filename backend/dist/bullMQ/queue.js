"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailQueue = exports.eventQueue = void 0;
const bullmq_1 = require("bullmq");
require("./worker");
//Queue
exports.eventQueue = new bullmq_1.Queue('add-event-queue', {
    connection: {
        url: process.env.REDIS_URL
    }
});
exports.sendEmailQueue = new bullmq_1.Queue('send-email-queue', {
    connection: {
        url: process.env.REDIS_URL
    }
});
