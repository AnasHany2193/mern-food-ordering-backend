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

export default { createCurrentUser };
