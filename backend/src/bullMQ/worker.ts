import uploadOnCloudinary from "../lib/cloudinaryConfig";
import { db } from "../lib/db";
import { Worker   } from "bullmq";
import { failureMailOptions, sendEmail, successMailOptions, transporter } from '../lib/mailTransporter';
import { sendEmailQueue } from "./queue";
import fs from 'fs'

export const sendEmailWorker = new Worker('send-email-queue',async(job)=>{
    const {userEmail,eventTitle,errorMessage,eventDate,ticketId, tickets,eventTitleForBookEvent} = job.data;
    if(job.name === "success-email"){
        console.log(`Sending success email to ${userEmail}`);
        console.log("job id : ",job.id)

       try {
       await transporter.sendMail(successMailOptions(userEmail,eventTitle,eventDate))
       } catch (error) {

              console.log("Error while sending email : ",error)
       }
    }
    else if(job.name === "failure-email"){
        console.log(`Sending failure email to ${userEmail}`);
        console.log("job id : ",job.id)

        // Send failure email
        try {
            await transporter.sendMail(failureMailOptions(userEmail, eventTitle, errorMessage));
        } catch (error) {
            console.log("Error while sending email : ",error)
        }
    }else if(job.name === "book-ticket-email"){
        console.log(`Sending ticket email to ${userEmail}`);
        console.log("job id : ",job.id)
        console.log(eventTitleForBookEvent)
        // Send ticket email
        sendEmail(ticketId,userEmail,eventTitleForBookEvent,tickets)
    }
},{
    connection: {
       url:process.env.REDIS_URL,
    } 
})