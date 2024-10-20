import express from "express";
import MyUserController from "../controllers/MyUserController";

const router = express.Router();

// api/my/user

/**
 * /api/my/user
 * @description Create a new user
 */
router.post("/", MyUserController.createCurrentUser);

export default router;
