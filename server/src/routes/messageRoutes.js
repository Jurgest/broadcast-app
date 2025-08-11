import express from 'express';
import { getSessionMessages, sendMessage, deleteMessage } from '../controllers/messageController.js';

const router = express.Router();

// GET /api/messages/:sessionId - Get session messages
router.get('/:sessionId', getSessionMessages);

// POST /api/messages - Send a message
router.post('/', sendMessage);

// DELETE /api/messages/:id - Delete a message
router.delete('/:id', deleteMessage);

export default router;
