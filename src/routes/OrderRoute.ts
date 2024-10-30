import express from "express";
import { jwtCheck, jwtParse } from "../middleware/auth";
import OrderController from "../controllers/OrderController";

const router = express.Router();

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

// /checkout/webhook
// whsec_d2d3542962f5c222c005dc37717ef65d9bed253ef30b482003dfe9ac79c61cf7
router.post("/checkout/webhook", OrderController.stripeWebhookHandler);

export default router;
