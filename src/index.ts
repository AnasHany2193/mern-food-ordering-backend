import express, { Request, Response } from "express";

import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

import orderRoute from "./routes/OrderRoute";
import myUserRoute from "./routes/MyUserRoute";
import restaurantRoute from "./routes/RestaurantRoute";
import myRestaurantRoute from "./routes/MyRestaurantRoute";

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
 * @description Configure Cloudinary for image uploading and manipulation
 */
cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

// This route is used to check if the server is up and running
app.get("/health", (req: Request, res: Response) => {
  res.send({
    status: "UP",
    message: "🟢 Server is up and running",
  });
});

/**
 * @description Routes to handle requests for the server
 */
app.use("/api/order", orderRoute);
app.use("/api/my/user", myUserRoute);
app.use("/api/restaurant", restaurantRoute);
app.use("/api/my/restaurant", myRestaurantRoute);

/**
 * @description App listening route to start the server and listen to requests
 */
app.listen(PORT, () => {
  console.log(
    `🟢 Hello, 𝕬𝖓𝖔𝖔𝖘 🖤! Server is running on http://localhost:${PORT}`
  );
});
