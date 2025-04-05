"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishEventCreated = exports.connectProducer = void 0;
const kafkaClient_1 = require("../kafkaClient");
const producer = kafkaClient_1.kafka.producer();
const connectProducer = async () => {
    await producer.connect();
};
exports.connectProducer = connectProducer;
const publishEventCreated = async (data) => {
    await producer.send({
        topic: "create-events",
        messages: [
            { value: JSON.stringify(data) }
        ]
    });
};
exports.publishEventCreated = publishEventCreated;
