import { v4 as uuidv4 } from 'uuid';

// In-memory storage for messages (in production, use a database)
const messages = new Map(); // sessionId -> array of messages

export const getSessionMessages = (req, res) => {
  try {
    const { sessionId } = req.params;
    
    if (!messages.has(sessionId)) {
      return res.json({
        success: true,
        messages: [],
      });
    }
    
    // Filter out expired messages
    const now = Date.now();
    const sessionMessages = messages.get(sessionId).filter(msg => {
      if (!msg.expiresAt) return true;
      return msg.expiresAt > now;
    });
    
    // Update stored messages if any expired
    if (sessionMessages.length !== messages.get(sessionId).length) {
      messages.set(sessionId, sessionMessages);
    }
    
    res.json({
      success: true,
      messages: sessionMessages,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get messages',
      details: error.message,
    });
  }
};

export const sendMessage = (req, res) => {
  try {
    const { sessionId, user, content, expirationTime } = req.body;
    
    if (!sessionId || !user || !content) {
      return res.status(400).json({
        error: 'Session ID, user, and content are required',
      });
    }
    
    const message = {
      id: uuidv4(),
      user,
      content,
      timestamp: Date.now(),
      expiresAt: expirationTime ? Date.now() + (expirationTime * 60 * 1000) : null,
    };
    
    if (!messages.has(sessionId)) {
      messages.set(sessionId, []);
    }
    
    messages.get(sessionId).push(message);
    
    // Emit to socket clients
    const io = req.app.get('io');
    if (io) {
      io.to(sessionId).emit('new-message', message);
    }
    
    res.json({
      success: true,
      message,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to send message',
      details: error.message,
    });
  }
};

export const deleteMessage = (req, res) => {
  try {
    const { id } = req.params;
    const { sessionId, userId } = req.body;
    
    if (!messages.has(sessionId)) {
      return res.status(404).json({
        error: 'Session not found',
      });
    }
    
    const sessionMessages = messages.get(sessionId);
    const messageIndex = sessionMessages.findIndex(
      msg => msg.id === id && msg.user.id === userId
    );
    
    if (messageIndex === -1) {
      return res.status(404).json({
        error: 'Message not found or unauthorized',
      });
    }
    
    sessionMessages.splice(messageIndex, 1);
    
    // Emit to socket clients
    const io = req.app.get('io');
    if (io) {
      io.to(sessionId).emit('message-deleted', { messageId: id });
    }
    
    res.json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to delete message',
      details: error.message,
    });
  }
};
