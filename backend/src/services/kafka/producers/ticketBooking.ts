import { kafka } from "../kafkaClient";
const producer = kafka.producer();

export const connectTicketBookingProducer = async () => {
  await producer.connect();
};

export const ticketBooking  = async(data:any)=>{
    await producer.send({
        topic:"ticket_booking",
        messages:[
            {value:JSON.stringify(data)}
        ]
    })
}

