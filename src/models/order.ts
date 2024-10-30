import mongoose from "mongoose";

/**
 * Schema for Order
 * @description This schema is used to create a new order in the database
 */
const orderSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  deliveryDetails: {
    name: { type: String, required: true },
    city: { type: String, required: true },
    email: { type: String, required: true },
    country: { type: String, required: true },
    addressLine1: { type: String, required: true },
  },
  cartItems: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      menuItemId: { type: String, required: true },
    },
  ],
  totalAmount: Number,
  status: {
    type: String,
    enum: ["placed", "paid", "inProgress", "outForDelivery", "delivered"],
  },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
