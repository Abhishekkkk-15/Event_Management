"use strict";
// kafkaClient.ts
// import { Kafka } from 'kafkajs';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.kafka = void 0;
// export const kafka = new Kafka({
//   clientId: 'event-service',
//   brokers: ['localhost:9092'],
// });
const kafkajs_1 = require("kafkajs");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
exports.kafka = new kafkajs_1.Kafka({
    clientId: process.env.KAFKA_CLIENTID,
    brokers: [process.env.KAFKA_BROKER || ""],
    ssl: {
        rejectUnauthorized: true,
        ca: [fs_1.default.readFileSync(path_1.default.join(__dirname, '../certs/ca.pem'), 'utf-8')], // Adjust path if needed
    },
    sasl: {
        mechanism: 'plain',
        username: process.env.KAFKA_USERNAME || "",
        password: process.env.KAFKA_PASSWORD || "",
    },
});
