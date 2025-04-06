"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startTicketBookingConsumer3 = void 0;
const kafkaClient_1 = require("../kafkaClient");
const db_1 = require("../../../lib/db");
const redis_1 = require("../../redis");
const generatePdf_1 = require("../../../lib/generatePdf");
const queue_1 = require("../../../bullMQ/queue");
const consumer = kafkaClient_1.kafka.consumer({ groupId: "ticket-booking-group" });
const startTicketBookingConsumer3 = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: "ticket_booking", fromBeginning: false });
    await consumer.run({
        eachMessage: async ({ topic, message }) => {
            try {
                console.log("consumer 3");
                const { eventId, userEmail, tickets, userId } = JSON.parse(message.value.toString());
                console.log(eventId, userEmail, tickets, userId);
                const event = await db_1.db.event.findFirst({ where: { id: eventId } });
                if (!event || event.bookedSlots + tickets > event.maxSlots) {
                    console.log("Booking rejected: No slots or event not found.");
                    return;
                }
                const ticket = await db_1.db.booking.create({
                    data: {
                        userId,
                        eventId,
                        tickets,
                    },
                    include: {
                        event: true,
                    },
                });
                await db_1.db.event.update({
                    where: { id: eventId },
                    data: {
                        bookedSlots: event.bookedSlots + tickets,
                    },
                });
                const ticketId = ticket.id;
                const pdfPath = await (0, generatePdf_1.generateTicketPDF)(ticketId, userEmail, ticket.event.title, tickets);
                await queue_1.sendEmailQueue.add("book-ticket-email", {
                    ticketId,
                    userEmail,
                    eventTitleForBookEvent: ticket.event.title,
                    tickets,
                });
                await redis_1.redisClient.del(`event:${eventId}`);
                console.log("✅ Ticket booked and email queued:", ticketId);
            }
            catch (err) {
                console.error("❌ Failed to process booking:", err);
            }
        },
    });
};
exports.startTicketBookingConsumer3 = startTicketBookingConsumer3;
