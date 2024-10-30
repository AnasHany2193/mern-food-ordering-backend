import express from "express";
import multer from "multer";

import MyRestaurantController from "../controllers/MyRestaurantController";

import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyRestaurantRequest } from "../middleware/validation";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

/**
 * @route GET /api/my/restaurant
 * @description Get all restaurant data
 */
router.get("/", jwtCheck, jwtParse, MyRestaurantController.getMyRestaurant);

/**
 * @route GET /api/my/restaurant/orders
 * @description Get all orders of a restaurant
 */
router.get(
  "/order",
  jwtCheck,
  jwtParse,
  MyRestaurantController.getMyRestaurantOrders
);

/**
 * @route PATCH /api/my/restaurant/order/:orderId/status
 * @description Update order status
 */
router.patch(
  "/order/:orderId/status",
  jwtCheck,
  jwtParse,
  MyRestaurantController.updateOrderStatus
);

/**
 * @route POST /api/my/restaurant
 * @description Create a new restaurant
 */
router.post(
  "/",
  upload.single("imageFile"),
  validateMyRestaurantRequest,
  jwtCheck,
  jwtParse,
  MyRestaurantController.createMyRestaurant
);

/**
 * @route PUT /api/my/restaurant
 * @description Update a restaurant
 */
router.put(
  "/",
  upload.single("imageFile"),
  validateMyRestaurantRequest,
  jwtCheck,
  jwtParse,
  MyRestaurantController.updateMyRestaurant
);

export default router;
