"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketBooking = exports.connectTicketBookingProducer = void 0;
const kafkaClient_1 = require("../kafkaClient");
const producer = kafkaClient_1.kafka.producer();
const connectTicketBookingProducer = async () => {
    await producer.connect();
};
exports.connectTicketBookingProducer = connectTicketBookingProducer;
const ticketBooking = async (data) => {
    await producer.send({
        topic: "ticket_booking",
        messages: [
            { value: JSON.stringify(data) }
        ]
    });
};
exports.ticketBooking = ticketBooking;
