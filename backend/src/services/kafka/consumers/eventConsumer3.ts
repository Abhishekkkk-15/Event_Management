import fs from 'fs'
import { kafka } from "../kafkaClient";
const consumer = kafka.consumer({ groupId: 'event-creation-group' });
import uploadOnCloudinary from "../../../lib/cloudinaryConfig";
import { db } from "../../../lib/db";
import { sendEmailQueue } from "../../../bullMQ/queue";


export const startEventConsumer3 = async () => {
    await consumer.connect()
    await consumer.subscribe({ topic: "create-events", fromBeginning: true })
   

   try {
     await consumer.run({
         eachMessage: async ({ topic, message }) => {
             const data = JSON.parse(message.value?.toString() || "{}")
             const { event, files, userId } = data;
             console.log("event Consumer3")
             try {
                 console.log("📥 Kafka: Processing event creation")
 
                 const date = new Date(event.date).toISOString();
                 const images: string[] = []
                 for (const filePath of files) {
                     const uploadedUrl = await uploadOnCloudinary(filePath);
                     images.push(uploadedUrl!);
                     fs.unlinkSync(filePath); // cleanup
                 }
                 const newEvent = await db.event.create({
                     data: {
                         title: event.title,
                         description: event.description,
                         location: event.location,
                         date,
                         userId,
                         maxSlots: Number(event.maxSlots) || 10,
                         eventImages: images,
                         price: Number(event.price),
                         category: event.category,
                         startAt: event.startAt,
                         endAt: event.endAt
                     }
                 });
                 sendEmailQueue.add("success-email", {
                     userEmail: event.userEmail,
                     eventTitle: event.title,
                     eventDate: date
                 });
                
             } catch (error: any) {
                 sendEmailQueue.add("failure-email", {
                     userEmail: event.userEmail,
                     eventTitle: event.title,
                     errorMessage: error.message
                 });
                 console.log("Error while creating Event")
             }
 
         }
     })
   } catch (error) {
    console.error("Failed to process Kafka message", error);
    
   }

}