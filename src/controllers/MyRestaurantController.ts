import mongoose from "mongoose";
import cloudinary from "cloudinary";

import { Request, Response } from "express";

import Restaurant from "../models/restaurant";
import Order from "../models/order";

/**
 * Get my restaurant
 * @description This function returns the current user's restaurant.
 */
const getMyRestaurant = async (req: Request, res: Response) => {
  try {
    // 01. Get the restaurant from the database
    const restaurant = await Restaurant.findOne({ user: req.userId });

    // 02. Check if the restaurant exists
    if (!restaurant) {
      res.status(404).json({ message: "Restaurant not found" });
      return;
    }

    // 03. Return the restaurant
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: "Error getting restaurant", error });
  }
};

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
    const imageUrl = await uploadImage(req.file as Express.Multer.File);

    // 03. Create a new restaurant
    const newRestaurant = new Restaurant(req.body);
    newRestaurant.imageUrl = imageUrl; // 03.2 Set the image URL
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

const updateMyRestaurant = async (req: Request, res: Response) => {
  try {
    // 01. Check if the restaurant already exists
    const {
      restaurantName,
      city,
      country,
      deliveryPrice,
      estimatedDeliveryTime,
      cuisines,
      menuItems,
      imageUrl,
    } = req.body;
    const existingRestaurant = await Restaurant.findOne({ user: req.userId });

    if (!existingRestaurant) {
      res.status(404).json({ message: "Restaurant not found" });
      return;
    }

    // 02. Update the restaurant
    existingRestaurant.restaurantName = restaurantName;
    existingRestaurant.city = city;
    existingRestaurant.country = country;
    existingRestaurant.deliveryPrice = deliveryPrice;
    existingRestaurant.estimatedDeliveryTime = estimatedDeliveryTime;
    existingRestaurant.cuisines = cuisines;
    existingRestaurant.menuItems = menuItems;
    existingRestaurant.lastUpdated = new Date();

    if (req.file) {
      const imageUrl = await uploadImage(req.file as Express.Multer.File);
      existingRestaurant.imageUrl = imageUrl;
    }

    await existingRestaurant.save();

    // 03. Return the updated restaurant
    res.status(200).send(existingRestaurant);
  } catch (error) {
    res.status(500).json({ message: "Error updating restaurant", error });
  }
};

/**
 * Upload an image to Cloudinary
 * @description This function uploads an image to Cloudinary and returns the URL.
 */
const uploadImage = async (file: Express.Multer.File) => {
  const image = file as Express.Multer.File;
  const base64Image = Buffer.from(image.buffer).toString("base64");

  const dataURI = `data:${image.mimetype};base64,${base64Image}`;
  const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);

  return uploadResponse.url;
};

/**
 * Get my restaurant orders
 * @description This function returns the orders for the current user's restaurant.
 */
const getMyRestaurantOrders = async (req: Request, res: Response) => {
  try {
    // 01. Check if the restaurant exists in the database
    const restaurant = await Restaurant.findOne({ user: req.userId });

    if (!restaurant) {
      res.status(404).json({ message: "Restaurant not found" });
      return;
    }

    // 02. Get the orders for the restaurant
    const orders = await Order.find({ restaurant: restaurant._id })
      .populate("restaurant")
      .populate("user");

    // 03. Return the orders for the restaurant
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error getting restaurant orders", error });
  }
};

const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    // 01. Check if the order exists
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    // 02. Check if the user is the owner of the restaurant
    const restaurant = await Restaurant.findById(order.restaurant);

    if (restaurant?.user?._id.toString() !== req.userId) {
      res.status(401).json({ message: "Unauthorized user" });
      return;
    }

    // 03. Update the order status
    order.status = req.body.status;
    await order.save();

    // 04. Return the updated order
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error updating order status", error });
  }
};

export default {
  getMyRestaurant,
  updateOrderStatus,
  createMyRestaurant,
  updateMyRestaurant,
  getMyRestaurantOrders,
};
