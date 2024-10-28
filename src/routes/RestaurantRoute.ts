import express from "express";
import RestaurantController from "../controllers/RestaurantController";

import { param } from "express-validator";

const router = express.Router();

/**
 * @route GET /api/restaurant/:id
 * @description Get restaurant by id
 */
router.get(
  "/:restaurantId",
  param("restaurantId")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Restaurant ID must be a valid string"),
  RestaurantController.getRestaurant
);

/**
 * @route GET /api/restaurant/search/:city
 * @description Search for restaurants by city
 */
router.get(
  "/search/:city",
  param("city")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("City parameter must be a valid string"),
  RestaurantController.searchRestaurant
);

export default router;
