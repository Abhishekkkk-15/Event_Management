"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const client_1 = require("@prisma/client");
const globalForPrisma = global;
exports.db = globalForPrisma.prisma ||
    new client_1.PrismaClient({
        datasources: {
            db: {
                url: process.env.DATABASE_URL + "?connection_limit=5", // Limit connections
            },
        },
    });
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = exports.db;
}
