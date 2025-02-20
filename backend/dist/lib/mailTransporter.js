"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const fs_1 = __importDefault(require("fs"));
exports.transporter = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "jangidabhishek276@gmail.com",
        pass: "wihb dagq jfys xgne", // Replace this with your correct App Password
    },
    logger: true, // Enable debugging logs
    debug: true,
});
async function sendEmail(ticketId, toEmail) {
    // Read QR code and PDF files
    const qrImage = fs_1.default.readFileSync(`./tickets/qrcode-${ticketId}.png`).toString('base64');
    const pdfPath = `./tickets/ticket-${ticketId}.pdf`;
    // 🎨 Beautiful HTML Template
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;">
      <div style="max-width: 600px; background: white; padding: 20px; margin: auto; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #007bff;">🎟 Your Event Ticket</h2>
        <p style="color: #555;">Scan the QR code below to access your ticket:</p>
        <img src="cid:qrcode" alt="QR Code" style="width: 200px; border: 2px solid #ddd; padding: 5px; border-radius: 10px;"/>
        <p style="margin-top: 20px;">
          <a href="cid:ticketpdf" download="ticket.pdf"
            style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            📥 Download Ticket PDF
          </a>
        </p>
        <p style="color: #888; font-size: 12px;">Thank you for your registration! 🎉</p>
      </div>
    </div>
  `;
    // 📩 Sending Email
    await exports.transporter.sendMail({
        from: 'jangidabhishek276@gmail.com',
        to: toEmail,
        subject: '🎟 Your Event Ticket',
        html: htmlContent,
        attachments: [
            { filename: 'qrcode.png', path: `./tickets/qrcode-${ticketId}.png`, cid: 'qrcode' }, // Inline QR code
            { filename: 'ticket.pdf', path: pdfPath, contentType: 'application/pdf', cid: 'ticketpdf' } // PDF attachment
        ]
    });
    console.log('✅ Email sent successfully!');
}
// Run function
// sendEmail("1c30db43-3026-4c96-b823-249d40655ef6","mrabhi748@gmail.com")
