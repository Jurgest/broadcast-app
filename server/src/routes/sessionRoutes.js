import express from 'express';
import { createSession, getSession } from '../controllers/sessionController.js';

const router = express.Router();

// POST /api/sessions - Create or join a session
router.post('/', createSession);

// GET /api/sessions/:id - Get session details
router.get('/:id', getSession);

export default router;
