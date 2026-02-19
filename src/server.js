import express from "express";
import { config } from "dotenv";
import { connectDB } from "./config/db.js";
// Import routes
import movieRoutes from "./routes/movieRoutes.js";
import authRoutes from "./routes/authRoutes.js";
const app = express();

// API Routes
config(); // Load environment variables from .env file
connectDB(); // Connect to the database
app.use("/movies", movieRoutes);
app.use("/auth", authRoutes);

const port = 8080;
// store server instance to allow graceful shutdown
const server = app.listen(port, () =>
  console.log(`Server is running on port ${port}`),
);

//GET,POST,DELETE.PUT
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);

  if (server) {
    server.close(() => {
      shutdown(1);
    });
  } else {
    shutdown(1);
  }
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);

  if (server) {
    server.close(() => {
      shutdown(1);
    });
  } else {
    shutdown(1);
  }
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");

  if (server) {
    server.close(() => {
      shutdown(0);
    });
  } else {
    shutdown(0);
  }
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  if (server) {
    server.close(() => {
      shutdown(0);
    });
  } else {
    shutdown(0);
  }
});
