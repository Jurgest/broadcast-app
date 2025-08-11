import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import { createServer } from "http";
import { Server } from "socket.io";
import rateLimit from "express-rate-limit";

import { errorHandler } from "./middleware/errorHandler.js";
import { validateSession } from "./middleware/validateSession.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import counterRoutes from "./routes/counterRoutes.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

const PORT = process.env.PORT || 3001;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan("combined"));
app.use(limiter);
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Store active sessions and users in memory (in production, use Redis)
export const activeSessions = new Map();
export const activeUsers = new Map();
export const sessionMessages = new Map();
export const sessionCounters = new Map();

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-session", (sessionId, userId, username) => {
    socket.join(sessionId);

    // Add user to session
    if (!activeSessions.has(sessionId)) {
      activeSessions.set(sessionId, new Set());
      sessionMessages.set(sessionId, []);
      sessionCounters.set(sessionId, {
        value: 0,
        lastUser: null,
        timestamp: Date.now(),
      });
    }

    activeSessions.get(sessionId).add(socket.id);
    activeUsers.set(socket.id, {
      userId,
      username,
      sessionId,
      lastActivity: Date.now(),
    });

    // Broadcast user joined
    socket
      .to(sessionId)
      .emit("user-joined", { userId, username, timestamp: Date.now() });

    // Send current state to new user
    socket.emit("session-state", {
      messages: sessionMessages.get(sessionId) || [],
      counter: sessionCounters.get(sessionId) || {
        value: 0,
        lastUser: null,
        timestamp: Date.now(),
      },
      users: Array.from(activeSessions.get(sessionId))
        .map((id) => activeUsers.get(id))
        .filter(Boolean),
    });
  });

  socket.on("send-message", (data) => {
    const user = activeUsers.get(socket.id);
    if (!user) return;

    const message = {
      id: Date.now().toString(),
      userId: user.userId,
      username: user.username,
      content: data.content,
      timestamp: Date.now(),
      expiresAt: data.expiresAt || null,
    };

    sessionMessages.get(user.sessionId).push(message);
    io.to(user.sessionId).emit("new-message", message);
  });

  socket.on("delete-message", (messageId) => {
    const user = activeUsers.get(socket.id);
    if (!user) return;

    const messages = sessionMessages.get(user.sessionId);
    const messageIndex = messages.findIndex(
      (m) => m.id === messageId && m.userId === user.userId
    );

    if (messageIndex !== -1) {
      messages.splice(messageIndex, 1);
      io.to(user.sessionId).emit("message-deleted", messageId);
    }
  });

  socket.on("update-counter", (value) => {
    const user = activeUsers.get(socket.id);
    if (!user) return;

    const counter = {
      value,
      lastUser: user.username,
      timestamp: Date.now(),
    };

    sessionCounters.set(user.sessionId, counter);
    io.to(user.sessionId).emit("counter-updated", counter);
  });

  socket.on("typing", (isTyping) => {
    const user = activeUsers.get(socket.id);
    if (!user) return;

    socket.to(user.sessionId).emit("user-typing", {
      userId: user.userId,
      username: user.username,
      isTyping,
    });
  });

  socket.on("disconnect", () => {
    const user = activeUsers.get(socket.id);
    if (user) {
      const sessionUsers = activeSessions.get(user.sessionId);
      if (sessionUsers) {
        sessionUsers.delete(socket.id);
        if (sessionUsers.size === 0) {
          // Clean up empty session after 5 minutes
          setTimeout(() => {
            if (activeSessions.get(user.sessionId)?.size === 0) {
              activeSessions.delete(user.sessionId);
              sessionMessages.delete(user.sessionId);
              sessionCounters.delete(user.sessionId);
            }
          }, 5 * 60 * 1000);
        }
      }

      activeUsers.delete(socket.id);
      socket.to(user.sessionId).emit("user-left", {
        userId: user.userId,
        username: user.username,
        timestamp: Date.now(),
      });
    }

    console.log("User disconnected:", socket.id);
  });
});

// Clean up expired messages every minute
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, messages] of sessionMessages.entries()) {
    const validMessages = messages.filter(
      (message) => !message.expiresAt || message.expiresAt > now
    );

    if (validMessages.length !== messages.length) {
      sessionMessages.set(sessionId, validMessages);
      // Notify clients about expired messages
      io.to(sessionId).emit("messages-expired", validMessages);
    }
  }
}, 60000);

// API Routes
app.use("/api/sessions", sessionRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/counter", counterRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

export { io };

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
