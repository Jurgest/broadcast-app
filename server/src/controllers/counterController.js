import { sessionCounters, io } from "../server.js";

export const counterController = {
  getCounter: async (req, res, next) => {
    try {
      const { sessionId } = req.params;

      const counter = sessionCounters.get(sessionId) || {
        value: 0,
        lastUser: null,
        timestamp: Date.now(),
      };

      res.json({
        success: true,
        data: counter,
      });
    } catch (error) {
      next(error);
    }
  },

  updateCounter: async (req, res, next) => {
    try {
      const { sessionId } = req.params;
      const { value, userId, username } = req.body;

      const counter = {
        value,
        lastUser: username,
        timestamp: Date.now(),
      };

      sessionCounters.set(sessionId, counter);

      // Emit to all clients in the session
      io.to(sessionId).emit("counter-updated", counter);

      res.json({
        success: true,
        data: counter,
      });
    } catch (error) {
      next(error);
    }
  },
};
