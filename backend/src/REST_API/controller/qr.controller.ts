import { generateTicketPDF } from "../../lib/generatePdf";
import { db } from "../../lib/db.js";
import { sendEmail, transporter } from "../../lib/mailTransporter.js";
import { Request, Response } from "express";
import fs from 'fs'
import { redisClient } from "../../services/redis.js";
import { sendEmailQueue } from "../../bullMQ/queue";
import { ticketBooking } from "../../services/kafka/producers/ticketBooking";

export const bookTicket = async (req: Request, res: Response) => {
  const { eventId, userEmail, tickets }: { eventId: string, userEmail: string, tickets: number } = req.body;

  try {
    const event = await db.event.findFirst({
      where: { id: eventId },
    });

    if (!event || event.bookedSlots >= event.maxSlots) {
      return res.status(400).json({ success: false, message: "Tickets are full or event not found" });
    }

    const userId = req.user.payload.id;


    const messagePayload = {
      eventId,
      userEmail,
      tickets,
      userId,
    };


    ticketBooking(messagePayload)

    await redisClient.del(`event:${eventId}`);

    return res.status(200).json({ success: true, message: "Ticket request received. You'll receive your ticket shortly." });

  } catch (error) {
    console.error("Error booking ticket:", error);
    return res.status(500).json({ success: false, message: "Error booking ticket" });
  }
};

export const downloadTicket = async (req: Request, res: Response) => {
  const ticketId = req.params.ticketId
  const pdfPath = `../ticket/ticketPdfs/ticket-${ticketId}.pdf`;
  if (fs.existsSync(pdfPath)) return res.download(pdfPath)
  res.status(404).json({ message: "Ticket not found" })

}

export const verifyTicket = async (req: Request, res: Response) => {
  const { ticketId, eventId }: { ticketId: string, eventId: string } = req.body
  const userId = req.user.payload.id

  let event;

  const eventFromCached = await redisClient.get(`event:${eventId}`)
  if (!eventId && !ticketId) {
    return res.status(400).json({ success: false, messsage: "Event or Ticket not found" })

  }
  try {
    if (eventFromCached) {

      event = JSON.parse(eventFromCached)
    } else {
      event = await db.event.findFirst({
        where: {
          id: eventId
        }
      })


    }

    const booking = await db.booking.findUnique({
      where: {
        id: ticketId
      }
    })
    if (!event && !booking) {

      return res.status(400).json({ success: false, messsage: "Event or Ticket not found" })

    }
    console.log("Event Id ", eventId)
    console.log("Ticket  Id ", ticketId)
    console.log("Ticket  Id ", req.body)

    console.log(event?.userId, userId)
    if (event?.userId != userId) {
      console.log(event?.userId, userId)
      return res.status(400).json({ success: false, messsage: "Not Admin" })
    }

    if (booking?.isUsed) {
      return res.status(200).json({ success: false, message: "Ticket already used" })
    }


    await redisClient.set(`event:${eventId}`, JSON.stringify(event))

    await db.booking.update({
      where: {
        id: ticketId
      },
      data: {
        isUsed: true
      }
    })


    return res.json({ success: true, message: "Ticket Booked", tickets: booking?.tickets })

  } catch (error) {
    console.log(error)
  }

}