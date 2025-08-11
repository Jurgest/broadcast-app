import express from "express";
import { body } from "express-validator";
import { validateSession } from "../middleware/validateSession.js";
import { counterController } from "../controllers/counterController.js";

const router = express.Router();

// Get counter value for session
router.get("/:sessionId", counterController.getCounter);

// Update counter
router.post(
  "/:sessionId",
  body("value").isInt(),
  body("userId").isString().isLength({ min: 1, max: 50 }).trim(),
  body("username").isString().isLength({ min: 1, max: 30 }).trim(),
  validateSession,
  counterController.updateCounter
);

export default router;
