import cluster from 'cluster';
import http from 'http';
import os from 'os';
import express from 'express';
import { ApolloServer, BaseContext } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import { typeDefs } from './graphql/typedefs';
import { resolvers } from './graphql/resolvers';
import { Request, Response } from 'express';
import authenticate from './lib/authincate';
import cookieParser from 'cookie-parser';
import { graphqlUploadExpress } from 'graphql-upload-minimal';
// import { graphqlUploadExpress  } from 'graphql-upload';
import { initRedis } from './services/redis';
import ticketRotue from './REST_API/routes/booking.route.js'
import verifiyRotue from './REST_API/routes/verification.route'
import reviewRoute from './REST_API/routes/review.route'
import eventRoute from './REST_API/routes/event.route'
import userRoute from './REST_API/routes/user.route'
import forgetEmailRoute from './REST_API/routes/forgetEmail.route'
import { config } from 'dotenv';
import bodyParser from 'body-parser';
import auth from './lib/auth';
import { connectProducer } from './services/kafka/producers/eventProducer';
import { startEventConsumer } from './services/kafka/consumers/eventConsumer';
import { startEventConsumer2 } from './services/kafka/consumers/eventConsumer2';
import { startEventConsumer3 } from './services/kafka/consumers/eventConsumer3';
import { connectTicketBookingProducer } from './services/kafka/producers/ticketBooking';
import { startTicketBookingConsumer1 } from './services/kafka/consumers/ticketBookingConsumer1';
import { startTicketBookingConsumer2 } from './services/kafka/consumers/ticketBookingConsumer2';
import { startTicketBookingConsumer3 } from './services/kafka/consumers/ticketBookingConsumer3';

const statusMonitor = require('express-status-monitor')();

const app = express();

initRedis();
config()

app.use(statusMonitor);
app.get('/status', statusMonitor.pageRoute);
app.use(cookieParser());
app.use(express.json({ limit: "15mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "15mb", extended: true }));
// app.use(graphqlUploadExpress({t
//   maxFileSize:5*1024*1024,
//   maxFiles:3
// }));
// app.use(authenticate);
app.use(
  cors({
    origin: [process.env.FRONTEND_URL!, "http://localhost:5173"],
    credentials: true,
  })
);

function initKafkaService() {
  connectProducer()
  connectTicketBookingProducer()
  startTicketBookingConsumer1()
  startTicketBookingConsumer2()
  startTicketBookingConsumer3()
  startEventConsumer()
  startEventConsumer2()
  startEventConsumer3()

}
initKafkaService()

const startServer = async () => {
  // Create Apollo Server instance
  type Context = {
    req: Request;
    res: Response;
  };

  const server = new ApolloServer<BaseContext>({
    typeDefs,
    resolvers,

    csrfPrevention: false, // ✅ Disable CSRF protection to allow uploads
    introspection: true, // ✅ Allow testing in Postman
  });


  await server.start();

  app.use('/events', eventRoute)

  app.use('/forgetPassword', forgetEmailRoute)

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req, res }) => ({ req, res, user: req.user }),
    })
  );
  app.use('/booking', auth, ticketRotue)
  app.use('/emailVerification', auth, verifiyRotue)
  app.use('/review', auth, reviewRoute)
  app.use('/user', auth, userRoute)

  if (cluster.isMaster) {
    const numCPUs = os.cpus().length;
    console.log(`Master process ${process.pid} forking ${numCPUs} workers...`);
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
      console.log(`Worker ${worker.process.pid} died. Restarting...`);
      cluster.fork();
    });
  } else {
    // In worker process, create the server and listen to port
    http.createServer(app).listen(process.env.PORT, () => {
      console.log(`Worker ${process.pid} started and listening on port ${process.env.PORT}`);
    });
  }
};

startServer();
