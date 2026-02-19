import pkg from "@prisma/client";
// adapter-pg is required for Prisma v7+ when using the default client engine
import { PrismaPg } from "@prisma/adapter-pg";

const { PrismaClient } = pkg;

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
