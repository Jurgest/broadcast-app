import express from 'express';
import { getCounter, incrementCounter, decrementCounter } from '../controllers/counterController.js';

const router = express.Router();

// GET /api/counter/:sessionId - Get counter value
router.get('/:sessionId', getCounter);

// POST /api/counter/increment - Increment counter
router.post('/increment', incrementCounter);

// POST /api/counter/decrement - Decrement counter
router.post('/decrement', decrementCounter);

export default router;
