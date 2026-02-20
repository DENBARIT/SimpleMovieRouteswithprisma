// ensure env vars are available as soon as this module loads
import "dotenv/config";

import pkg from "@prisma/client";
// adapter-pg is required for Prisma v7+ when using the default client engine
import { PrismaPg } from "@prisma/adapter-pg";

const { PrismaClient } = pkg;

// validate connection string early and strictly
if (!process.env.DATABASE_URL || typeof process.env.DATABASE_URL !== "string") {
  console.error(
    "DATABASE_URL must be set and a string. Check your .env file or environment."
  );
  process.exit(1);
}

// build adapter instance using the DATABASE_URL environment variable
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

// create a single PrismaClient instance for the app
const prisma = new PrismaClient({
  adapter,
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "info", "warn", "error"]
      : ["error"],
});

// export the Prisma instance so other modules (controllers, services) can use it
export { prisma };

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1); // Exit the process with an error code
  }
};
const disconnectDB = async () => {
  try {
    await prisma.$disconnect();
    console.log("Database disconnected successfully");
  } catch (error) {
    console.error(`Database disconnection error: ${error.message}`);
  }
};

export { connectDB, disconnectDB };
