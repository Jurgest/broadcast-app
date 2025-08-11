import {
  activeSessions,
  activeUsers,
  sessionMessages,
  sessionCounters,
} from "../server.js";

export const sessionController = {
  createSession: async (req, res, next) => {
    try {
      const { sessionId } = req.body;

      if (!activeSessions.has(sessionId)) {
        activeSessions.set(sessionId, new Set());
        sessionMessages.set(sessionId, []);
        sessionCounters.set(sessionId, {
          value: 0,
          lastUser: null,
          timestamp: Date.now(),
        });
      }

      res.status(201).json({
        success: true,
        data: {
          sessionId,
          createdAt: Date.now(),
          activeUsers: activeSessions.get(sessionId).size,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  getSession: async (req, res, next) => {
    try {
      const { sessionId } = req.params;

      const session = activeSessions.get(sessionId);
      if (!session) {
        return res.status(404).json({
          success: false,
          error: "Session not found",
        });
      }

      const users = Array.from(session)
        .map((socketId) => activeUsers.get(socketId))
        .filter(Boolean);

      res.json({
        success: true,
        data: {
          sessionId,
          activeUsers: users.length,
          users: users.map((user) => ({
            userId: user.userId,
            username: user.username,
            lastActivity: user.lastActivity,
          })),
          messages: sessionMessages.get(sessionId) || [],
          counter: sessionCounters.get(sessionId) || {
            value: 0,
            lastUser: null,
            timestamp: Date.now(),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  },

  joinSession: async (req, res, next) => {
    try {
      const { sessionId } = req.params;
      const { userId, username } = req.body;

      if (!activeSessions.has(sessionId)) {
        activeSessions.set(sessionId, new Set());
        sessionMessages.set(sessionId, []);
        sessionCounters.set(sessionId, {
          value: 0,
          lastUser: null,
          timestamp: Date.now(),
        });
      }

      res.json({
        success: true,
        data: {
          sessionId,
          userId,
          username,
          joinedAt: Date.now(),
        },
      });
    } catch (error) {
      next(error);
    }
  },

  leaveSession: async (req, res, next) => {
    try {
      const { sessionId } = req.params;
      const { userId } = req.body;

      res.json({
        success: true,
        data: {
          sessionId,
          userId,
          leftAt: Date.now(),
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
