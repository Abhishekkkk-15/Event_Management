"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTicketEmail = sendTicketEmail;
const resend_1 = require("resend");
const fs_1 = __importDefault(require("fs"));
// import {} from "../../tickets"
const resend = new resend_1.Resend('re_8ZQd2NbQ_2DWU99Cq9WKkFtMJEDY6HcYu');
async function sendTicketEmail(pdfPath, qrImgPath, userEmail) {
    try {
        // Read the QR image & PDF file
        const pdfBuffer = fs_1.default.readFileSync(`./tickets/ticket-${pdfPath}.pdf`);
        const qrImageBase64 = fs_1.default.readFileSync(`./tickets/qrcode-${qrImgPath}.png`, 'base64');
        console.log(userEmail);
        // Send email
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: userEmail,
            subject: '🎟️ Your Event Ticket is Ready!',
            html: `
        <div style="font-family: Arial, sans-serif; text-align: center; background: #f4f4f4; padding: 20px;">
          <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #333;">🎉 Your Event Ticket</h2>
            <p style="color: #555; font-size: 16px;">Scan the QR code below to access your ticket.</p>
            
            <img src="data:image/png;base64,${qrImageBase64}" alt="QR Code" style="width: 150px; height: 150px; margin: 15px 0;" />
            
            <p style="font-size: 14px; color: #777;">Click below to download your ticket:</p>
            <a href="https://your-website.com/download/ticket.pdf" 
               style="display: inline-block; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px;">
               🎫 Download Ticket
            </a>
            
            <p style="margin-top: 20px; font-size: 12px; color: #aaa;">
              If you have any issues, contact us at support@yourdomain.com.
            </p>
          </div>
        </div>
      `,
            //   attachments: [
            //     {
            //       filename: 'ticket.pdf',
            //       content: pdfBuffer.toString('base64'),
            //       contentType: 'application/pdf',
            //     },
            //   ],
        });
        console.log('✅ Ticket email sent successfully!');
    }
    catch (error) {
        console.error('❌ Error sending email:', error);
    }
}
