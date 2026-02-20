// load environment variables first so any imported modules can use them
import "dotenv/config";
import express from "express";
import { connectDB } from "./config/db.js";
// Import routes
import movieRoutes from "./routes/movieRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import watchlistRoutes from "./routes/watchlistRoutes.js";
const app = express();

// body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //for html parsing

// Connect to the database (dotenv already loaded via import)
connectDB();
app.use("/movies", movieRoutes);
app.use("/auth", authRoutes);
app.use("/watchlist", watchlistRoutes);
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
