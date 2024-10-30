import express from "express";
import { jwtCheck, jwtParse } from "../middleware/auth";
import OrderController from "../controllers/OrderController";

const router = express.Router();

/**
 * GET /api/order/customer/orders
 * @description Get the orders for the customer
 */
router.get("/", jwtCheck, jwtParse, OrderController.getMyOrders);

/**
 * POST /api/order/checkout/create-checkout-session
 * @description Create a checkout session for the user and return the session url.
 */
router.post(
  "/checkout/create-checkout-session",
  jwtCheck,
  jwtParse,
  OrderController.createCheckoutSession
);

/**
 * POST /api/order/checkout/webhook
 * @description Handle the webhook from Stripe
 */
router.post("/checkout/webhook", OrderController.stripeWebhookHandler);

export default router;
