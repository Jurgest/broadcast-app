import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { errorHandler } from './middleware/errorHandler.js';
import { validateSession } from './middleware/validateSession.js';
import sessionRoutes from './routes/sessionRoutes.js';
import userRoutes from './routes/userRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import counterRoutes from './routes/counterRoutes.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

const PORT = process.env.PORT || 3001;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
});

// Security and utility middleware
app.use(morgan('combined'));
app.use(helmet());
app.use(compression());
app.use(limiter);
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Set io instance for routes
app.set('io', io);

// API Routes
app.use('/api/sessions', validateSession, sessionRoutes);
app.use('/api/users', validateSession, userRoutes);
app.use('/api/messages', validateSession, messageRoutes);
app.use('/api/counter', validateSession, counterRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Cross-Tab Collaboration API is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
  });
});

// Error handling middleware
app.use(errorHandler);

// Socket.io connection handling
let sessions = new Map(); // sessionId -> { users: [], messages: [], counter: 0 }
let userSessions = new Map(); // socketId -> sessionId

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join session
  socket.on('join-session', (data) => {
    const { sessionId, user } = data;
    
    // Leave previous session if any
    if (userSessions.has(socket.id)) {
      const prevSessionId = userSessions.get(socket.id);
      socket.leave(prevSessionId);
      
      // Remove user from previous session
      if (sessions.has(prevSessionId)) {
        const prevSession = sessions.get(prevSessionId);
        prevSession.users = prevSession.users.filter(u => u.id !== user.id);
        socket.to(prevSessionId).emit('user-left', user);
      }
    }

    // Join new session
    socket.join(sessionId);
    userSessions.set(socket.id, sessionId);

    // Initialize session if it doesn't exist
    if (!sessions.has(sessionId)) {
      sessions.set(sessionId, {
        users: [],
        messages: [],
        counter: 0,
        lastCounterUpdate: null,
      });
    }

    const session = sessions.get(sessionId);
    
    // Add user to session (replace if exists)
    const existingUserIndex = session.users.findIndex(u => u.id === user.id);
    if (existingUserIndex >= 0) {
      session.users[existingUserIndex] = { ...user, lastActivity: Date.now(), socketId: socket.id };
    } else {
      session.users.push({ ...user, lastActivity: Date.now(), socketId: socket.id });
    }

    // Send current session state to the joining user
    socket.emit('session-state', {
      users: session.users,
      messages: session.messages,
      counter: session.counter,
      lastCounterUpdate: session.lastCounterUpdate,
    });

    // Notify others about the new user
    socket.to(sessionId).emit('user-joined', { ...user, lastActivity: Date.now() });
  });

  // Handle messages
  socket.on('send-message', (data) => {
    const sessionId = userSessions.get(socket.id);
    if (!sessionId || !sessions.has(sessionId)) return;

    const session = sessions.get(sessionId);
    const message = {
      ...data,
      timestamp: Date.now(),
    };

    session.messages.push(message);
    
    // Broadcast to all users in the session
    io.to(sessionId).emit('new-message', message);
  });

  // Handle message deletion
  socket.on('delete-message', (data) => {
    const sessionId = userSessions.get(socket.id);
    if (!sessionId || !sessions.has(sessionId)) return;

    const session = sessions.get(sessionId);
    const { messageId, userId } = data;
    
    // Find and remove the message if it belongs to the user
    const messageIndex = session.messages.findIndex(
      msg => msg.id === messageId && msg.user.id === userId
    );
    
    if (messageIndex >= 0) {
      session.messages.splice(messageIndex, 1);
      io.to(sessionId).emit('message-deleted', { messageId });
    }
  });

  // Handle counter updates
  socket.on('update-counter', (data) => {
    const sessionId = userSessions.get(socket.id);
    if (!sessionId || !sessions.has(sessionId)) return;

    const session = sessions.get(sessionId);
    const { action, user } = data;
    
    if (action === 'increment') {
      session.counter += 1;
    } else if (action === 'decrement') {
      session.counter -= 1;
    }
    
    session.lastCounterUpdate = {
      user,
      action,
      timestamp: Date.now(),
    };

    // Broadcast to all users in the session
    io.to(sessionId).emit('counter-updated', {
      counter: session.counter,
      lastUpdate: session.lastCounterUpdate,
    });
  });

  // Handle typing indicators
  socket.on('typing-start', (data) => {
    const sessionId = userSessions.get(socket.id);
    if (!sessionId) return;
    
    socket.to(sessionId).emit('user-typing', data);
  });

  socket.on('typing-stop', (data) => {
    const sessionId = userSessions.get(socket.id);
    if (!sessionId) return;
    
    socket.to(sessionId).emit('user-stopped-typing', data);
  });

  // Handle user activity updates
  socket.on('activity-update', (data) => {
    const sessionId = userSessions.get(socket.id);
    if (!sessionId || !sessions.has(sessionId)) return;

    const session = sessions.get(sessionId);
    const { userId } = data;
    
    // Update user's last activity
    const userIndex = session.users.findIndex(u => u.id === userId);
    if (userIndex >= 0) {
      session.users[userIndex].lastActivity = Date.now();
      socket.to(sessionId).emit('user-activity-updated', {
        userId,
        lastActivity: Date.now(),
      });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    
    const sessionId = userSessions.get(socket.id);
    if (sessionId && sessions.has(sessionId)) {
      const session = sessions.get(sessionId);
      
      // Find the user and remove them
      const user = session.users.find(u => u.socketId === socket.id);
      if (user) {
        session.users = session.users.filter(u => u.socketId !== socket.id);
        socket.to(sessionId).emit('user-left', user);
      }
      
      // Clean up empty sessions after a delay
      setTimeout(() => {
        if (sessions.has(sessionId) && sessions.get(sessionId).users.length === 0) {
          sessions.delete(sessionId);
          console.log(`Cleaned up empty session: ${sessionId}`);
        }
      }, 30000); // 30 seconds delay
    }
    
    userSessions.delete(socket.id);
  });
});

// Cleanup expired messages periodically
setInterval(() => {
  const now = Date.now();
  sessions.forEach((session, sessionId) => {
    const originalLength = session.messages.length;
    session.messages = session.messages.filter(msg => {
      if (!msg.expiresAt) return true;
      return msg.expiresAt > now;
    });
    
    // Notify clients if messages were removed
    if (session.messages.length < originalLength) {
      io.to(sessionId).emit('messages-expired', {
        messages: session.messages
      });
    }
  });
}, 60000); // Check every minute

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.io server ready for connections`);
});
