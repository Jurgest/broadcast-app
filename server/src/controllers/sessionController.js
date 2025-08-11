import { v4 as uuidv4 } from 'uuid';

// In-memory storage for sessions (in production, use a database)
const sessions = new Map();

export const createSession = (req, res) => {
  try {
    const { sessionId } = req.body;
    const id = sessionId || uuidv4();
    
    if (!sessions.has(id)) {
      sessions.set(id, {
        id,
        users: [],
        messages: [],
        counter: 0,
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
      });
    }
    
    const session = sessions.get(id);
    res.json({
      success: true,
      session: {
        id: session.id,
        userCount: session.users.length,
        messageCount: session.messages.length,
        counter: session.counter,
        createdAt: session.createdAt,
        lastActivity: session.lastActivity,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create session',
      details: error.message,
    });
  }
};

export const getSession = (req, res) => {
  try {
    const { id } = req.params;
    
    if (!sessions.has(id)) {
      return res.status(404).json({
        error: 'Session not found',
      });
    }
    
    const session = sessions.get(id);
    res.json({
      success: true,
      session: {
        id: session.id,
        userCount: session.users.length,
        messageCount: session.messages.length,
        counter: session.counter,
        createdAt: session.createdAt,
        lastActivity: session.lastActivity,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get session',
      details: error.message,
    });
  }
};
