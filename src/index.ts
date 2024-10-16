import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";

/**
 * @description Connect to MongoDB
 */
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log("-> Connected to MongoDB!"))
  .catch((err) => console.log("MongoDB Disconnected!", err));

// const PORT = process.env.PORT || 3000;
const PORT = 5000;

/**
 * @description Express app
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
 * @description Route to start the server.
 */
app.listen(PORT, () => {
  console.log(
    `-> Hello, 𝕬𝖓𝖔𝖔𝖘 🖤! Server is running on http://localhost:${PORT}`
  );
});
