import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL + "?connection_limit=5", // Limit connections
      },
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
