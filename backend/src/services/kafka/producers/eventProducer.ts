import { kafka } from "../kafkaClient";
const producer = kafka.producer();

export const connectProducer = async () => {
  await producer.connect();
};

export const publishEventCreated  = async(data:any)=>{
    await producer.send({
        topic:"create-events",
        messages:[
            {value:JSON.stringify(data)}
        ]
    })
}

