/**
 * index.ts File
 * @description This file is the entry point of the server. It is responsible for starting the server and listening to requests.
 */

import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import express, { Request, Response } from "express";

// port to listen to requests
const PORT = process.env.PORT || 3000;

/**
 * @description Connect to MongoDB
 */
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log("-> Connected to MongoDB!"))
  .catch((err) => console.log("MongoDB Disconnected!", err));

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
 * @description Route to return "Hello World!"
 */
app.get("/hello", async (req: Request, res: Response) => {
  res.json({ message: "Hello World!" });
});

/**
 * @description App listening route to start the server and listen to requests
 */
app.listen(PORT, () => {
  console.log(
    `-> Hello, 𝕬𝖓𝖔𝖔𝖘 🖤! Server is running on http://localhost:${PORT}`
  );
});
