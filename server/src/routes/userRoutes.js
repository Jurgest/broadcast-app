import express from 'express';
import { addUser, getSessionUsers, removeUser } from '../controllers/userController.js';

const router = express.Router();

// POST /api/users - Add user to session
router.post('/', addUser);

// GET /api/users/:sessionId - Get all users in session
router.get('/:sessionId', getSessionUsers);

// DELETE /api/users/:id - Remove user from session
router.delete('/:id', removeUser);

export default router;
