import { kafka } from "../kafkaClient";
import { db } from "../../../lib/db";
import { redisClient } from "../../redis";
import {generateTicketPDF} from "../../../lib/generatePdf";
import { sendEmailQueue } from "../../../bullMQ/queue";
import fs from 'fs/promises';

const consumer = kafka.consumer({ groupId: "ticket-booking-group" });

export const startTicketBookingConsumer2 = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "ticket_booking", fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      try {
        const { eventId, userEmail, tickets, userId } = JSON.parse(message.value!.toString());
        console.log(eventId,userEmail,tickets,userId)
        const event = await db.event.findFirst({ where: { id: eventId } });
        console.log("consumer 2")

        if (!event || event.bookedSlots + tickets > event.maxSlots) {
          console.log("Booking rejected: No slots or event not found.");
          return;
        }

        const ticket = await db.booking.create({
          data: {
            userId,
            eventId,
            tickets,
          },
          include: {
            event: true,
          },
        });

        await db.event.update({
          where: { id: eventId },
          data: {
            bookedSlots: event.bookedSlots + tickets,
          },
        });

        const ticketId = ticket.id;
        const pdfPath:string = await generateTicketPDF(ticketId, userEmail, ticket.event.title, tickets) as string;

        await sendEmailQueue.add("book-ticket-email", {
          ticketId,
          userEmail,
          eventTitleForBookEvent: ticket.event.title,
          tickets,
        });

        await redisClient.del(`event:${eventId}`);
       

        console.log("✅ Ticket booked and email queued:", ticketId);
      } catch (err) {
        console.error("❌ Failed to process booking:", err);
      }
    },
  });
};
