import { body, validationResult } from 'express-validator';

export const validateSession = (req, res, next) => {
  // For now, just check if session ID is provided when needed
  if (req.method === 'POST' && req.path.includes('/sessions')) {
    if (!req.body.sessionId) {
      return res.status(400).json({
        error: 'Session ID is required',
      });
    }
  }
  
  next();
};
