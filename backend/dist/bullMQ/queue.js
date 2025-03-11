"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailQueue = exports.eventQueue = void 0;
const bullmq_1 = require("bullmq");
require("./worker");
//Queue
exports.eventQueue = new bullmq_1.Queue('add-event-queue', {
    connection: {
        url: process.env.REDIS_URL
    }
});
exports.sendEmailQueue = new bullmq_1.Queue('send-email-queue', {
    connection: {
        url: process.env.REDIS_URL
    }
});
// Worker
// const addEventWorker = new Worker('add-event-queue', async (job) => {
//     const { event, files, userId } = job.data;
//     try {
//         console.log("Processing job", job.id);
//         const date = new Date(event.date).toISOString();
//         const images: string[] = [];
//         for (const filePath of files) {  // ✅ Now it contains file paths
//             const uploadedUrl = await uploadOnCloudinary(filePath);  // ✅ Upload directly
//             images.push(uploadedUrl!);
//         }
//         const newEvent = await db.event.create({
//             data: {
//                 title: event.title,
//                 description: event.description,
//                 location: event.location,
//                 date,
//                 userId,
//                 maxSlots: Number(event.maxSlots) || 10,
//                 eventImages: images,
//                 price: Number(event.price),
//                 category: event.category,
//                 startAt: event.startAt,
//                 endAt: event.endAt
//             }
//         });
//         sendEmailQueue.add("success-email", {
//             userEmail: event.userEmail,  
//             eventTitle: event.title,
//             eventDate: date
//         });
//         console.log(`Event created successfully: ${newEvent.id}`);
//         return newEvent;
//     } catch (error:any) {
//         console.error("Error processing event job:", error);
//         sendEmailQueue.add("failure-email", {
//             userEmail: event.userEmail,
//             eventTitle: event.title,
//             errorMessage: error.message
//         });
//         throw error;
//     }
// }, {
//     connection: {
//         url:process.env.REDIS_URL
//     }
// });
// const sendEmailWorker = new Worker('send-email-queue',async(job)=>{
//     const {userEmail,eventTitle,errorMessage,eventDate,ticketId} = job.data;
//     if(job.name === "success-email"){
//         console.log(`Sending success email to ${userEmail}`);
//         console.log("job id : ",job.id)
//        try {
//        await transporter.sendMail(successMailOptions(userEmail,eventTitle,eventDate))
//        } catch (error) {
//               console.log("Error while sending email : ",error)
//        }
//     }
//     else if(job.name === "failure-email"){
//         console.log(`Sending failure email to ${userEmail}`);
//         console.log("job id : ",job.id)
//         // Send failure email
//         try {
//             await transporter.sendMail(failureMailOptions(userEmail, eventTitle, errorMessage));
//         } catch (error) {
//             console.log("Error while sending email : ",error)
//         }
//     }else if(job.name === "book-ticket-email"){
//         console.log(`Sending ticket email to ${userEmail}`);
//         console.log("job id : ",job.id)
//         // Send ticket email
//         sendEmail(ticketId,userEmail)
//     }
// },{
//     connection: {
//        url:process.env.REDIS_URL,
//     } 
// })
