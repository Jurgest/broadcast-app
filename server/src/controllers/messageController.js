import { sessionMessages, io } from "../server.js";

export const messageController = {
  getMessages: async (req, res, next) => {
    try {
      const { sessionId } = req.params;
      const messages = sessionMessages.get(sessionId) || [];

      // Filter out expired messages
      const now = Date.now();
      const validMessages = messages.filter(
        (message) => !message.expiresAt || message.expiresAt > now
      );

      if (validMessages.length !== messages.length) {
        sessionMessages.set(sessionId, validMessages);
      }

      res.json({
        success: true,
        data: validMessages,
      });
    } catch (error) {
      next(error);
    }
  },

  sendMessage: async (req, res, next) => {
    try {
      const { sessionId } = req.params;
      const { content, userId, username, expiresAt } = req.body;

      const message = {
        id: Date.now().toString(),
        userId,
        username,
        content,
        timestamp: Date.now(),
        expiresAt: expiresAt || null,
      };

      if (!sessionMessages.has(sessionId)) {
        sessionMessages.set(sessionId, []);
      }

      sessionMessages.get(sessionId).push(message);

      // Emit to all clients in the session
      io.to(sessionId).emit("new-message", message);

      res.status(201).json({
        success: true,
        data: message,
      });
    } catch (error) {
      next(error);
    }
  },

  deleteMessage: async (req, res, next) => {
    try {
      const { sessionId, messageId } = req.params;
      const { userId } = req.body;

      const messages = sessionMessages.get(sessionId) || [];
      const messageIndex = messages.findIndex(
        (m) => m.id === messageId && m.userId === userId
      );

      if (messageIndex === -1) {
        return res.status(404).json({
          success: false,
          error: "Message not found or unauthorized",
        });
      }

      messages.splice(messageIndex, 1);

      // Emit to all clients in the session
      io.to(sessionId).emit("message-deleted", messageId);

      res.json({
        success: true,
        data: { messageId, deletedAt: Date.now() },
      });
    } catch (error) {
      next(error);
    }
  },
};
