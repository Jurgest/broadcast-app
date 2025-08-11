import express from "express";
import { userController } from "../controllers/userController.js";

const router = express.Router();

// Get active users in session
router.get("/:sessionId", userController.getActiveUsers);

// Update user activity
router.post("/:sessionId/activity", userController.updateActivity);

export default router;
