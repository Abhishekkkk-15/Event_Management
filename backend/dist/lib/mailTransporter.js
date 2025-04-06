"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.failureMailOptions = exports.successMailOptions = exports.transporter = void 0;
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const fs_1 = __importDefault(require("fs"));
exports.transporter = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Replace this with your correct App Password
    }
});
async function sendEmail(ticketId, toEmail, eventTitleForBookEvent, tickets) {
    // Read QR code and PDF files
    const qrImage = fs_1.default.readFileSync(`./tickets/qrcode-${ticketId}.png`).toString('base64');
    const pdfPath = `./tickets/ticket-${ticketId}.pdf`;
    // 🎨 Beautiful HTML Template
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;">
      <div style="max-width: 600px; background: white; padding: 20px; margin: auto; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);">
      
        <h2 style="color: #007bff;">🎟 Your Event Ticket</h2>
        <h1>${eventTitleForBookEvent}</h1>
      <h2> No of Seat's : ${tickets}</h2>
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
    console.log("Deleting PDF : ", fs_1.default.unlink(pdfPath, () => {
        console.log("deleted");
    }));
    console.log("Deleting QR Png : ", fs_1.default.unlinkSync(`./tickets/qrcode-${ticketId}.png`));
}
const successMailOptions = (userEmail, eventTitle, eventDate) => ({
    from: '"Event Manager" <your-email@example.com>', // Replace with your email
    to: userEmail,
    subject: "🎉 Event Created Successfully!",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #4CAF50;">🎉 Your Event Has Been Successfully Created!</h2>
              <p>Dear Organizer,</p>
              <p>We are excited to inform you that your event <strong>"${eventTitle}"</strong> has been successfully created and is now live.</p>
              <p><strong>📅 Event Date:</strong> ${eventDate}</p>
              <p>You can manage your event and view more details from your dashboard.</p>
              <p>Thank you for using our platform!</p>
              <hr style="border: 0; border-top: 1px solid #ddd;">
              <p style="color: #555;">Best Regards, <br><strong>Event Buddy Team</strong></p>
          </div>
      </div>
  `,
});
exports.successMailOptions = successMailOptions;
const failureMailOptions = (userEmail, eventTitle, errorMessage) => ({
    from: '"Event Manager" <your-email@example.com>', // Replace with your email
    to: userEmail,
    subject: "⚠️ Event Creation Failed",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #FF5733;">⚠️ Event Creation Failed</h2>
              <p>Dear Organizer,</p>
              <p>Unfortunately, we were unable to create your event <strong>"${eventTitle}"</strong> due to an error.</p>
              <p><strong>🔍 Error Details:</strong> ${errorMessage}</p>
              <p>Please try again later or contact support if the issue persists.</p>
              <hr style="border: 0; border-top: 1px solid #ddd;">
              <p style="color: #555;">Best Regards, <br><strong>Event Manager Team</strong></p>
          </div>
      </div>
  `,
});
exports.failureMailOptions = failureMailOptions;
