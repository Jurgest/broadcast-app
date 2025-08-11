// In-memory storage for counters (in production, use a database)
const counters = new Map(); // sessionId -> { value, lastUpdate }

export const getCounter = (req, res) => {
  try {
    const { sessionId } = req.params;
    
    if (!counters.has(sessionId)) {
      counters.set(sessionId, {
        value: 0,
        lastUpdate: null,
      });
    }
    
    const counter = counters.get(sessionId);
    
    res.json({
      success: true,
      counter: counter.value,
      lastUpdate: counter.lastUpdate,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get counter',
      details: error.message,
    });
  }
};

export const incrementCounter = (req, res) => {
  try {
    const { sessionId, user } = req.body;
    
    if (!sessionId || !user) {
      return res.status(400).json({
        error: 'Session ID and user are required',
      });
    }
    
    if (!counters.has(sessionId)) {
      counters.set(sessionId, {
        value: 0,
        lastUpdate: null,
      });
    }
    
    const counter = counters.get(sessionId);
    counter.value += 1;
    counter.lastUpdate = {
      user,
      action: 'increment',
      timestamp: Date.now(),
    };
    
    // Emit to socket clients
    const io = req.app.get('io');
    if (io) {
      io.to(sessionId).emit('counter-updated', {
        counter: counter.value,
        lastUpdate: counter.lastUpdate,
      });
    }
    
    res.json({
      success: true,
      counter: counter.value,
      lastUpdate: counter.lastUpdate,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to increment counter',
      details: error.message,
    });
  }
};

export const decrementCounter = (req, res) => {
  try {
    const { sessionId, user } = req.body;
    
    if (!sessionId || !user) {
      return res.status(400).json({
        error: 'Session ID and user are required',
      });
    }
    
    if (!counters.has(sessionId)) {
      counters.set(sessionId, {
        value: 0,
        lastUpdate: null,
      });
    }
    
    const counter = counters.get(sessionId);
    counter.value -= 1;
    counter.lastUpdate = {
      user,
      action: 'decrement',
      timestamp: Date.now(),
    };
    
    // Emit to socket clients
    const io = req.app.get('io');
    if (io) {
      io.to(sessionId).emit('counter-updated', {
        counter: counter.value,
        lastUpdate: counter.lastUpdate,
      });
    }
    
    res.json({
      success: true,
      counter: counter.value,
      lastUpdate: counter.lastUpdate,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to decrement counter',
      details: error.message,
    });
  }
};
