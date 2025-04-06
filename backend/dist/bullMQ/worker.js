"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailWorker = void 0;
const bullmq_1 = require("bullmq");
const mailTransporter_1 = require("../lib/mailTransporter");
exports.sendEmailWorker = new bullmq_1.Worker('send-email-queue', async (job) => {
    const { userEmail, eventTitle, errorMessage, eventDate, ticketId, tickets, eventTitleForBookEvent } = job.data;
    if (job.name === "success-email") {
        console.log(`Sending success email to ${userEmail}`);
        console.log("job id : ", job.id);
        try {
            await mailTransporter_1.transporter.sendMail((0, mailTransporter_1.successMailOptions)(userEmail, eventTitle, eventDate));
        }
        catch (error) {
            console.log("Error while sending email : ", error);
        }
    }
    else if (job.name === "failure-email") {
        console.log(`Sending failure email to ${userEmail}`);
        console.log("job id : ", job.id);
        // Send failure email
        try {
            await mailTransporter_1.transporter.sendMail((0, mailTransporter_1.failureMailOptions)(userEmail, eventTitle, errorMessage));
        }
        catch (error) {
            console.log("Error while sending email : ", error);
        }
    }
    else if (job.name === "book-ticket-email") {
        console.log(`Sending ticket email to ${userEmail}`);
        console.log("job id : ", job.id);
        console.log(eventTitleForBookEvent);
        // Send ticket email
        (0, mailTransporter_1.sendEmail)(ticketId, userEmail, eventTitleForBookEvent, tickets);
    }
}, {
    connection: {
        url: process.env.REDIS_URL,
    }
});
