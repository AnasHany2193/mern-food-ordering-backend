import { Request, Response } from "express";
import User from "../models/user";
import { error } from "console";

/**
 * Create a new user
 * @description This function creates a new user in the database if it doesn't already exist.
 */
const createCurrentUser = async (req: Request, res: Response) => {
  try {
    // 1. Check if user exists
    const { auth0Id } = req.body;
    const existingUser = await User.findOne({ auth0Id });

    if (existingUser) {
      res.status(200).send();
      return;
    }

    // 2. Create user if not exists
    const newUser = new User(req.body);
    await newUser.save();

    // 3. Return user object to the calling client
    res.status(201).json(newUser.toObject());
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating user", error });
  }
};

/**
 * Update a user
 * @description This function updates a user in the database if it exists.
 */
const updateCurrentUser = async (req: Request, res: Response) => {
  try {
    // 01. Check if user exists
    const { name, addressLine1, country, city } = req.body;
    const existingUser = await User.findById(req.userId);

    if (!existingUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // 02. Update user and save changes to database
    existingUser.name = name;
    existingUser.city = city;
    existingUser.country = country;
    existingUser.addressLine1 = addressLine1;

    await existingUser.save();

    // 03. Return user object to the calling client
    res.status(200).send(existingUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating user", error });
  }
};
export default { createCurrentUser, updateCurrentUser };
