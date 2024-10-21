import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";

import myUserRoute from "./routes/MyUserRoute";
import express, { Request, Response } from "express";

// port to listen to requests
const PORT = process.env.PORT || 3000;

/**
 * @description Connect to MongoDB
 */
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log("🟢 Connected to MongoDB!"))
  .catch((err) => console.log("🔴 MongoDB Connection Failed:", err));

/**
 * @description Express app instance to handle requests and routes for the server
 */
const app = express();

/**
 * @description Middleware to parse JSON data
 */
app.use(express.json());

/**
 * @description Middleware to enable CORS: Cross-Origin Resource Sharing
 */
app.use(cors());

/**
 * @description Routes to handle requests for the server
 */
app.use("/api/my/user", myUserRoute);

/**
 * @description App listening route to start the server and listen to requests
 */
app.listen(PORT, () => {
  console.log(
    `🟢 Hello, 𝕬𝖓𝖔𝖔𝖘 🖤! Server is running on http://localhost:${PORT}`
  );
});
