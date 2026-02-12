import express from "express";
import movieRoutes from "./routes/movieRoutes.js";
const app = express();
// app.get("/hello", (req, res) => {
//   res.json({ message: "Hello, World!" });
// });
app.use("/movies", movieRoutes);
const port = 8080;
app.listen(port, () => console.log(`Server is running on port ${port}`));

//GET,POST,DELETE.PUT
