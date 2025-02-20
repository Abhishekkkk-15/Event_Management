"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTicket = exports.downloadTicket = exports.bookTicket = void 0;
const generatePdf_1 = require("../../lib/generatePdf");
const db_js_1 = require("../../lib/db.js");
const mailTransporter_js_1 = require("../../lib/mailTransporter.js");
const fs_1 = __importDefault(require("fs"));
const redis_js_1 = require("../../services/redis.js");
// import {} from "../../../"
const bookTicket = async (req, res) => {
    const { eventId, userEmail, tickets } = req.body;
    try {
        const userId = req.user.payload.id;
        const ticket = await db_js_1.db.booking.create({
            data: {
                userId,
                eventId,
                tickets,
            }
        });
        const ticketId = ticket.id;
        // console.log("It comes here")
        const pdfPath = await (0, generatePdf_1.generateTicketPDF)(ticketId, userEmail);
        console.log(pdfPath);
        const mailOptions = {
            from: "mrabhi748@gmail.com",
            to: userEmail,
            subject: "Your Event Ticket",
            text: `Downlaod your ticker : http://localhost:5000/download-ticket/${ticketId}`,
            attacments: [{
                    filePath: 'Event-Ticket.pdf',
                    path: pdfPath
                }]
        };
        try {
            await (0, mailTransporter_js_1.sendEmail)(ticketId, userEmail);
            console.log("Mail sent");
        }
        catch (error) {
            console.log("Error while Sending Email : ", error);
        }
        // await   sendTicketEmail(ticketId,ticketId,userEmail)       
        return res.json({ success: true, message: "Ticket generated & email sent", ticketId });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Error generating ticket" });
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
    console.log("its getting called ");
    let event;
    const eventFromCached = await redis_js_1.redisClient.get(`event:${eventId}`);
    if (eventFromCached) {
        console.log("DATA from cached");
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
    console.log(event?.userId, userId);
    if (event?.userId != userId) {
        return res.status(400).json({ success: false, messsage: "Not Admin" });
    }
    if (booking?.isUsed) {
        return res.status(404).json({ success: false, message: "Ticket already used" });
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
    return res.json({ success: true, message: "Ticket Booked" });
};
exports.verifyTicket = verifyTicket;
