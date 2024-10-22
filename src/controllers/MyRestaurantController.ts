import mongoose from "mongoose";
import cloudinary from "cloudinary";

import { Request, Response } from "express";

import Restaurant from "../models/restaurant";

/**
 * Create a new restaurant
 * @description This function creates a new restaurant in the database if it doesn't already exist.
 */
const createMyRestaurant = async (req: Request, res: Response) => {
  try {
    // 01. Check if the restaurant already exists
    const existingRestaurant = await Restaurant.findOne({ user: req.userId });

    if (existingRestaurant) {
      res.status(409).json({ message: "Restaurant already exists" });
      return;
    }

    // 02. Upload the restaurant image to Cloudinary
    const image = req.file as Express.Multer.File;
    const base64Image = Buffer.from(image.buffer).toString("base64");
    3;

    const dataURI = `data:${image.mimetype};base64,${base64Image}`;
    const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);

    // 03. Create a new restaurant
    const newRestaurant = new Restaurant(req.body);
    newRestaurant.imageUrl = uploadResponse.url; // 03.2 Set the image URL
    newRestaurant.user = new mongoose.Types.ObjectId(req.userId); // 03.3 Set the user ID
    newRestaurant.lastUpdated = new Date(); // 03.4 Set the last updated date
    await newRestaurant.save();

    // 04. Return the created restaurant
    res.status(200).send(newRestaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating restaurant", error });
  }
};

export default { createMyRestaurant };
