import express from "express";

import MyUserController from "../controllers/MyUserController";

import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyUserRequest } from "../middleware/validation";

const router = express.Router();

/**
 * @route GET /api/my/user
 * @description Get current user
 */
router.get("/", jwtCheck, jwtParse, MyUserController.getCurrentUser);

/**
 * @route POST /api/my/user
 * @description Create a new user
 */
router.post("/", jwtCheck, MyUserController.createCurrentUser);

/**
 * @route PUT /api/my/user
 * @description Update current user
 */
router.put(
  "/",
  jwtCheck,
  jwtParse,
  validateMyUserRequest,
  MyUserController.updateCurrentUser
);

export default router;
