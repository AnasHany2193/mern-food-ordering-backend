import express from "express";
import { jwtCheck } from "../middleware/auth";
import MyUserController from "../controllers/MyUserController";

const router = express.Router();

// api/my/user

/**
 * /api/my/user
 * @description Create a new user
 */
router.post("/", jwtCheck, MyUserController.createCurrentUser);

export default router;
