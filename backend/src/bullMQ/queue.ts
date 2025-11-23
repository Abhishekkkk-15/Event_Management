import { Queue } from 'bullmq';
import uploadOnCloudinary from "../lib/cloudinaryConfig";
import { db } from "../lib/db";
import { Worker   } from "bullmq";
import { failureMailOptions, sendEmail, successMailOptions, transporter } from '../lib/mailTransporter';
import "./worker"


//Queue

export const eventQueue = new Queue('add-event-queue', {
    connection: {
        url:process.env.REDIS_URL
    }

});

export const sendEmailQueue = new Queue('send-email-queue', {
    connection:{
        url: process.env.REDIS_URL
    }
});
