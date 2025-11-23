// kafkaClient.ts
// import { Kafka } from 'kafkajs';

// export const kafka = new Kafka({
//   clientId: 'event-service',
//   brokers: ['localhost:9092'],
// });

import { Kafka } from 'kafkajs';
import fs from 'fs';
import path from 'path';
console.log(__dirname)

export const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENTID,
  brokers: [process.env.KAFKA_BROKER||""],
  ssl: {
    rejectUnauthorized: true,
    ca: [fs.readFileSync(path.join(__dirname, '../certs/ca.pem'), 'utf-8')], // Adjust path if needed
  },
  sasl: {
    mechanism: 'plain',
    username: process.env.KAFKA_USERNAME || "",
    password: process.env.KAFKA_PASSWORD || "",
  },
});

