import express from "express";
import dotenv from "dotenv";
import { registerUser, loginUser } from "./authController.js";

dotenv.config();
const router = express.Router();

// Register
router.post("/register", registerUser);

// Login (uses controller)
router.post("/login", loginUser);

export default router;
