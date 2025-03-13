"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cluster_1 = __importDefault(require("cluster"));
const http_1 = __importDefault(require("http"));
const os_1 = __importDefault(require("os"));
const express_1 = __importDefault(require("express"));
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const cors_1 = __importDefault(require("cors"));
const typedefs_1 = require("./graphql/typedefs");
const resolvers_1 = require("./graphql/resolvers");
const authincate_1 = __importDefault(require("./lib/authincate"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// import { graphqlUploadExpress  } from 'graphql-upload';
const redis_1 = require("./services/redis");
const booking_route_js_1 = __importDefault(require("./REST_API/routes/booking.route.js"));
const verification_route_1 = __importDefault(require("./REST_API/routes/verification.route"));
const review_route_1 = __importDefault(require("./REST_API/routes/review.route"));
const event_route_1 = __importDefault(require("./REST_API/routes/event.route"));
const user_route_1 = __importDefault(require("./REST_API/routes/user.route"));
const forgetEmail_route_1 = __importDefault(require("./REST_API/routes/forgetEmail.route"));
const dotenv_1 = require("dotenv");
const body_parser_1 = __importDefault(require("body-parser"));
const auth_1 = __importDefault(require("./lib/auth"));
const statusMonitor = require('express-status-monitor')();
const app = (0, express_1.default)();
(0, redis_1.initRedis)();
(0, dotenv_1.config)();
app.use(statusMonitor);
app.get('/status', statusMonitor.pageRoute);
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json({ limit: "15mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(body_parser_1.default.urlencoded({ limit: "15mb", extended: true }));
// app.use(graphqlUploadExpress({t
//   maxFileSize:5*1024*1024,
//   maxFiles:3
// }));
app.use(authincate_1.default);
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true,
}));
const startServer = async () => {
    const server = new server_1.ApolloServer({
        typeDefs: typedefs_1.typeDefs,
        resolvers: resolvers_1.resolvers,
        csrfPrevention: false, // ✅ Disable CSRF protection to allow uploads
        introspection: true, // ✅ Allow testing in Postman
    });
    await server.start();
    app.use('/events', event_route_1.default);
    app.use('/forgetPassword', forgetEmail_route_1.default);
    app.use('/graphql', (0, express4_1.expressMiddleware)(server, {
        context: async ({ req, res }) => ({ req, res, user: req.user }),
    }));
    app.use('/booking', auth_1.default, booking_route_js_1.default);
    app.use('/emailVerification', auth_1.default, verification_route_1.default);
    app.use('/review', auth_1.default, review_route_1.default);
    app.use('/user', auth_1.default, user_route_1.default);
    if (cluster_1.default.isMaster) {
        const numCPUs = os_1.default.cpus().length;
        console.log(`Master process ${process.pid} forking ${numCPUs} workers...`);
        for (let i = 0; i < numCPUs; i++) {
            cluster_1.default.fork();
        }
        cluster_1.default.on('exit', (worker, code, signal) => {
            console.log(`Worker ${worker.process.pid} died. Restarting...`);
            cluster_1.default.fork();
        });
    }
    else {
        // In worker process, create the server and listen to port
        http_1.default.createServer(app).listen(4000, () => {
            console.log(`Worker ${process.pid} started and listening on port 4000`);
        });
    }
};
startServer();
