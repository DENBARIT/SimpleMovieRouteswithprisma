import express from "express";
// Import routes
// import movieRoutes from "./routes/movieRoutes.js";
// const express = require("express");
const router = express.Router();

// Define your movie routes here
router.get("/", (req, res) => {
  res.json({ httpmethod: "GET", message: "Welcome to the Movie API!" });
});
router.post("/", (req, res) => {
  res.json({ httpmethod: "POST", message: "Welcome to the Movie API!" });
});
router.put("/", (req, res) => {
  res.json({ httpmethod: "PUT", message: "Welcome to the Movie API!" });
});
router.delete("/", (req, res) => {
  res.json({ httpmethod: "DELETE", message: "Welcome to the Movie API!" });
});
export default router;
