import express from "express";
import { body } from "express-validator";
import { validateSession } from "../middleware/validateSession.js";
import { messageController } from "../controllers/messageController.js";

const router = express.Router();

// Get messages for a session
router.get("/:sessionId", messageController.getMessages);

// Send message
router.post(
  "/:sessionId",
  body("content").isString().isLength({ min: 1, max: 1000 }).trim(),
  body("userId").isString().isLength({ min: 1, max: 50 }).trim(),
  body("username").isString().isLength({ min: 1, max: 30 }).trim(),
  body("expiresAt").optional().isInt(),
  validateSession,
  messageController.sendMessage
);

// Delete message
router.delete(
  "/:sessionId/:messageId",
  body("userId").isString().isLength({ min: 1, max: 50 }).trim(),
  validateSession,
  messageController.deleteMessage
);

export default router;
