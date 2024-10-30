import mongoose, { Schema } from "mongoose";

/**
 * User Schema
 * @description This schema is used to store user data in the database
 */
const userSchema = new mongoose.Schema({
  auth0Id: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  name: { type: String },
  addressLine1: { type: String },
  city: { type: String },
  country: { type: String },
});

const User = mongoose.model("User", userSchema);
export default User;
