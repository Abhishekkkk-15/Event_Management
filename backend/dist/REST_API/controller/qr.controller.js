"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTicket = exports.downloadTicket = exports.bookTicket = void 0;
const db_js_1 = require("../../lib/db.js");
const fs_1 = __importDefault(require("fs"));
const redis_js_1 = require("../../services/redis.js");
const ticketBooking_1 = require("../../services/kafka/producers/ticketBooking");
const bookTicket = async (req, res) => {
    const { eventId, userEmail, tickets } = req.body;
    try {
        const event = await db_js_1.db.event.findFirst({
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
        (0, ticketBooking_1.ticketBooking)(messagePayload);
        await redis_js_1.redisClient.del(`event:${eventId}`);
        return res.status(200).json({ success: true, message: "Ticket request received. You'll receive your ticket shortly." });
    }
    catch (error) {
        console.error("Error booking ticket:", error);
        return res.status(500).json({ success: false, message: "Error booking ticket" });
    }
};
exports.bookTicket = bookTicket;
const downloadTicket = async (req, res) => {
    const ticketId = req.params.ticketId;
    const pdfPath = `../ticket/ticketPdfs/ticket-${ticketId}.pdf`;
    if (fs_1.default.existsSync(pdfPath))
        return res.download(pdfPath);
    res.status(404).json({ message: "Ticket not found" });
};
exports.downloadTicket = downloadTicket;
const verifyTicket = async (req, res) => {
    const { ticketId, eventId } = req.body;
    const userId = req.user.payload.id;
    let event;
    const eventFromCached = await redis_js_1.redisClient.get(`event:${eventId}`);
    if (!eventId && !ticketId) {
        return res.status(400).json({ success: false, messsage: "Event or Ticket not found" });
    }
    try {
        if (eventFromCached) {
            event = JSON.parse(eventFromCached);
        }
        else {
            event = await db_js_1.db.event.findFirst({
                where: {
                    id: eventId
                }
            });
        }
        const booking = await db_js_1.db.booking.findUnique({
            where: {
                id: ticketId
            }
        });
        if (!event && !booking) {
            return res.status(400).json({ success: false, messsage: "Event or Ticket not found" });
        }
        console.log("Event Id ", eventId);
        console.log("Ticket  Id ", ticketId);
        console.log("Ticket  Id ", req.body);
        console.log(event?.userId, userId);
        if (event?.userId != userId) {
            console.log(event?.userId, userId);
            return res.status(400).json({ success: false, messsage: "Not Admin" });
        }
        if (booking?.isUsed) {
            return res.status(200).json({ success: false, message: "Ticket already used" });
        }
        await redis_js_1.redisClient.set(`event:${eventId}`, JSON.stringify(event));
        await db_js_1.db.booking.update({
            where: {
                id: ticketId
            },
            data: {
                isUsed: true
            }
        });
        return res.json({ success: true, message: "Ticket Booked", tickets: booking?.tickets });
    }
    catch (error) {
        console.log(error);
    }
};
exports.verifyTicket = verifyTicket;
