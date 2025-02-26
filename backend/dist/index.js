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
const graphql_upload_minimal_1 = require("graphql-upload-minimal");
const redis_1 = require("./services/redis");
const booking_route_js_1 = __importDefault(require("./REST_API/routes/booking.route.js"));
const verification_route_1 = __importDefault(require("./REST_API/routes/verification.route"));
const review_route_1 = __importDefault(require("./REST_API/routes/review.route"));
const dotenv_1 = require("dotenv");
const statusMonitor = require('express-status-monitor')();
const app = (0, express_1.default)();
(0, redis_1.initRedis)();
(0, dotenv_1.config)();
app.use(statusMonitor);
app.get('/status', statusMonitor.pageRoute);
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(authincate_1.default);
app.use((0, graphql_upload_minimal_1.graphqlUploadExpress)({
    maxFileSize: 5 * 1024 * 1024,
    maxFiles: 3
}));
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
    app.use('/booking', booking_route_js_1.default);
    app.use('/emailVerification', verification_route_1.default);
    app.use('/review', review_route_1.default);
    app.use('/graphql', (0, express4_1.expressMiddleware)(server, {
        context: async ({ req, res }) => ({ req, res, user: req.user }),
    }));
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
