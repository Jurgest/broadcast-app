// In-memory storage for users (in production, use a database)
const users = new Map();
const sessionUsers = new Map(); // sessionId -> Set of userIds

export const addUser = (req, res) => {
  try {
    const { sessionId, user } = req.body;
    
    if (!sessionId || !user) {
      return res.status(400).json({
        error: 'Session ID and user data are required',
      });
    }
    
    // Add user to global users map
    users.set(user.id, {
      ...user,
      sessionId,
      joinedAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
    });
    
    // Add user to session
    if (!sessionUsers.has(sessionId)) {
      sessionUsers.set(sessionId, new Set());
    }
    sessionUsers.get(sessionId).add(user.id);
    
    res.json({
      success: true,
      user: users.get(user.id),
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to add user',
      details: error.message,
    });
  }
};

export const getSessionUsers = (req, res) => {
  try {
    const { sessionId } = req.params;
    
    if (!sessionUsers.has(sessionId)) {
      return res.json({
        success: true,
        users: [],
      });
    }
    
    const userIds = Array.from(sessionUsers.get(sessionId));
    const sessionUserList = userIds
      .map(id => users.get(id))
      .filter(user => user && user.sessionId === sessionId);
    
    res.json({
      success: true,
      users: sessionUserList,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get session users',
      details: error.message,
    });
  }
};

export const removeUser = (req, res) => {
  try {
    const { id } = req.params;
    
    if (!users.has(id)) {
      return res.status(404).json({
        error: 'User not found',
      });
    }
    
    const user = users.get(id);
    const { sessionId } = user;
    
    // Remove from session
    if (sessionUsers.has(sessionId)) {
      sessionUsers.get(sessionId).delete(id);
    }
    
    // Remove from global users
    users.delete(id);
    
    res.json({
      success: true,
      message: 'User removed successfully',
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to remove user',
      details: error.message,
    });
  }
};
