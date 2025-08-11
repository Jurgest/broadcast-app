import express from "express";
import { body } from "express-validator";
import { validateSession } from "../middleware/validateSession.js";
import { sessionController } from "../controllers/sessionController.js";

const router = express.Router();

// Create new session
router.post(
  "/",
  body("sessionId").isString().isLength({ min: 1, max: 100 }).trim(),
  validateSession,
  sessionController.createSession
);

// Get session info
router.get("/:sessionId", sessionController.getSession);

// Join session
router.post(
  "/:sessionId/join",
  body("userId").isString().isLength({ min: 1, max: 50 }).trim(),
  body("username").isString().isLength({ min: 1, max: 30 }).trim(),
  validateSession,
  sessionController.joinSession
);

// Leave session
router.post(
  "/:sessionId/leave",
  body("userId").isString().isLength({ min: 1, max: 50 }).trim(),
  validateSession,
  sessionController.leaveSession
);

export default router;
