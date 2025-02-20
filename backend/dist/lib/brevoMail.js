"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
async function sendEmail() {
    await axios_1.default.post('https://api.brevo.com/v3/smtp/email', {
        sender: { email: 'your-email@gmail.com', name: 'Your Name' },
        to: [{ email: 'recipient@example.com' }],
        subject: 'Your Ticket',
        htmlContent: '<h1>Your Event Ticket</h1><p>Scan the QR Code below:</p>',
        attachment: [
            { url: 'https://yourwebsite.com/ticket.pdf', name: 'ticket.pdf' },
            { url: 'https://yourwebsite.com/qrcode.png', name: 'qrcode.png' }
        ]
    }, {
        headers: { 'eventManagment': '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' }
    });
    console.log('Email sent!');
}
sendEmail().catch(console.error);
