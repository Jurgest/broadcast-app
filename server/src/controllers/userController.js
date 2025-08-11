import { activeSessions, activeUsers } from "../server.js";

export const userController = {
  getActiveUsers: async (req, res, next) => {
    try {
      const { sessionId } = req.params;

      const session = activeSessions.get(sessionId);
      if (!session) {
        return res.json({
          success: true,
          data: [],
        });
      }

      const users = Array.from(session)
        .map((socketId) => activeUsers.get(socketId))
        .filter(Boolean);

      res.json({
        success: true,
        data: users.map((user) => ({
          userId: user.userId,
          username: user.username,
          lastActivity: user.lastActivity,
        })),
      });
    } catch (error) {
      next(error);
    }
  },

  updateActivity: async (req, res, next) => {
    try {
      const { sessionId } = req.params;
      const { userId } = req.body;

      // Find user by userId and update activity
      for (const [socketId, user] of activeUsers.entries()) {
        if (user.userId === userId && user.sessionId === sessionId) {
          user.lastActivity = Date.now();
          break;
        }
      }

      res.json({
        success: true,
        data: { updatedAt: Date.now() },
      });
    } catch (error) {
      next(error);
    }
  },
};
