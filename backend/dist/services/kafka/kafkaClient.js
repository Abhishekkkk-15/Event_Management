"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kafka = void 0;
// kafkaClient.ts
const kafkajs_1 = require("kafkajs");
exports.kafka = new kafkajs_1.Kafka({
    clientId: 'event-service',
    brokers: ['localhost:9092'],
});
