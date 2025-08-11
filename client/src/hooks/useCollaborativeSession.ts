import { useState, useEffect, useCallback, useRef } from "react";
import type {
  User,
  Message,
  Counter,
  SessionState,
  BroadcastData,
  CollaborativeSessionConfig,
  TypingIndicator,
  ActivityLog,
} from "../types";
import { socketManager } from "../utils/socket";
import { debounce, isMessageExpired } from "../utils/helpers";
import { useBroadcast } from "./useBroadcast";

export const useCollaborativeSession = (config: CollaborativeSessionConfig) => {
  const {
    sessionId,
    userId,
    username,
    channelName = `session-${sessionId}`,
  } = config;

  // Local state
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [counter, setCounter] = useState<Counter>({
    value: 0,
    lastUser: null,
    timestamp: Date.now(),
  });
  const [typingUsers, setTypingUsers] = useState<TypingIndicator[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Refs for cleanup
  const typingTimeoutRef = useRef<Map<string, number>>(new Map());
  const messageExpirationTimeoutRef = useRef<Map<string, number>>(new Map());

  // Broadcast channel setup
  const { broadcast, subscribe } = useBroadcast(channelName);

  // Activity log function (defined early to avoid hoisting issues)
  const addActivityLog = useCallback(
    (
      type: "join" | "leave" | "message" | "counter" | "typing",
      userId: string,
      username: string,
      description: string
    ) => {
      const log: ActivityLog = {
        id: Date.now().toString(),
        type,
        userId,
        username,
        description,
        timestamp: Date.now(),
      };

      setActivityLog((prev) => [...prev, log].slice(-50)); // Keep last 50 logs

      // Broadcast activity to other tabs
      broadcast({
        type: "ACTIVITY_LOG",
        payload: log,
        userId,
        timestamp: Date.now(),
      });
    },
    [broadcast]
  );

  // Socket connection and event handlers
  useEffect(() => {
    const socket = socketManager.connect();

    const handleConnect = () => {
      setIsConnected(true);
      setError(null);
      socket.emit("join-session", sessionId, userId, username);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleConnectError = (error: Error) => {
      setError(`Connection failed: ${error.message}`);
      setIsConnected(false);
    };

    const handleSessionState = (state: SessionState) => {
      setUsers(state.users);
      setMessages(state.messages.filter((msg) => !isMessageExpired(msg)));
      setCounter(state.counter);
      setLoading(false);
    };

    const handleUserJoined = (user: User) => {
      setUsers((prev) => {
        const exists = prev.some((u) => u.userId === user.userId);
        if (!exists) {
          addActivityLog(
            "join",
            user.userId,
            user.username,
            `${user.username} joined the session`
          );
          return [...prev, user];
        }
        return prev;
      });

      // Broadcast to other tabs
      broadcast({
        type: "USER_JOIN",
        payload: user,
        timestamp: Date.now(),
        userId,
      });
    };

    const handleUserLeft = (user: User) => {
      setUsers((prev) => prev.filter((u) => u.userId !== user.userId));
      setTypingUsers((prev) => prev.filter((t) => t.userId !== user.userId));
      addActivityLog(
        "leave",
        user.userId,
        user.username,
        `${user.username} left the session`
      );

      // Broadcast to other tabs
      broadcast({
        type: "USER_LEAVE",
        payload: user,
        timestamp: Date.now(),
        userId,
      });
    };

    const handleNewMessage = (message: Message) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === message.id);
        if (!exists) {
          addActivityLog(
            "message",
            message.userId,
            message.username,
            `${message.username} sent a message`
          );

          // Set expiration timeout if message has expiration
          if (message.expiresAt) {
            const timeUntilExpiration = message.expiresAt - Date.now();
            if (timeUntilExpiration > 0) {
              const timeoutId = window.setTimeout(() => {
                setMessages((prev) => prev.filter((m) => m.id !== message.id));
                messageExpirationTimeoutRef.current.delete(message.id);
              }, timeUntilExpiration);
              messageExpirationTimeoutRef.current.set(message.id, timeoutId);
            }
          }

          return [...prev, message];
        }
        return prev;
      });

      // Broadcast to other tabs
      broadcast({
        type: "MESSAGE_SEND",
        payload: message,
        timestamp: Date.now(),
        userId,
      });
    };

    const handleMessageDeleted = (messageId: string) => {
      setMessages((prev) => prev.filter((m) => m.id !== messageId));

      // Clear expiration timeout
      const timeoutId = messageExpirationTimeoutRef.current.get(messageId);
      if (timeoutId) {
        clearTimeout(timeoutId);
        messageExpirationTimeoutRef.current.delete(messageId);
      }

      // Broadcast to other tabs
      broadcast({
        type: "MESSAGE_DELETE",
        payload: { messageId },
        timestamp: Date.now(),
        userId,
      });
    };

    const handleCounterUpdated = (newCounter: Counter) => {
      setCounter(newCounter);
      addActivityLog(
        "counter",
        newCounter.lastUser || "Unknown",
        newCounter.lastUser || "Unknown",
        `Counter updated to ${newCounter.value}`
      );

      // Broadcast to other tabs
      broadcast({
        type: "COUNTER_UPDATE",
        payload: newCounter,
        timestamp: Date.now(),
        userId,
      });
    };

    const handleUserTyping = (typingData: TypingIndicator) => {
      if (typingData.isTyping) {
        setTypingUsers((prev) => {
          const filtered = prev.filter((t) => t.userId !== typingData.userId);
          return [...filtered, typingData];
        });

        // Clear existing timeout
        const existingTimeout = typingTimeoutRef.current.get(typingData.userId);
        if (existingTimeout) {
          clearTimeout(existingTimeout);
        }

        // Set new timeout
        const timeoutId = window.setTimeout(() => {
          setTypingUsers((prev) =>
            prev.filter((t) => t.userId !== typingData.userId)
          );
          typingTimeoutRef.current.delete(typingData.userId);
        }, 3000);

        typingTimeoutRef.current.set(typingData.userId, timeoutId);
      } else {
        setTypingUsers((prev) =>
          prev.filter((t) => t.userId !== typingData.userId)
        );
        const timeoutId = typingTimeoutRef.current.get(typingData.userId);
        if (timeoutId) {
          clearTimeout(timeoutId);
          typingTimeoutRef.current.delete(typingData.userId);
        }
      }
    };

    const handleMessagesExpired = (validMessages: Message[]) => {
      setMessages(validMessages);
    };

    // Attach event listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("session-state", handleSessionState);
    socket.on("user-joined", handleUserJoined);
    socket.on("user-left", handleUserLeft);
    socket.on("new-message", handleNewMessage);
    socket.on("message-deleted", handleMessageDeleted);
    socket.on("counter-updated", handleCounterUpdated);
    socket.on("user-typing", handleUserTyping);
    socket.on("messages-expired", handleMessagesExpired);

    // If already connected, join session immediately
    if (socket.connected) {
      handleConnect();
    }

    return () => {
      // Cleanup event listeners
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("session-state", handleSessionState);
      socket.off("user-joined", handleUserJoined);
      socket.off("user-left", handleUserLeft);
      socket.off("new-message", handleNewMessage);
      socket.off("message-deleted", handleMessageDeleted);
      socket.off("counter-updated", handleCounterUpdated);
      socket.off("user-typing", handleUserTyping);
      socket.off("messages-expired", handleMessagesExpired);
    };
  }, [sessionId, userId, username, broadcast, addActivityLog]);

  // Subscribe to broadcast messages from other tabs
  useEffect(() => {
    const unsubscribe = subscribe((data: BroadcastData) => {
      // Only process messages from other tabs (different userId)
      if (data.userId === userId) return;

      switch (data.type) {
        case "USER_JOIN":
          setUsers((prev) => {
            const user = data.payload as User;
            const exists = prev.some((u) => u.userId === user.userId);
            return exists ? prev : [...prev, user];
          });
          break;

        case "USER_LEAVE":
          setUsers((prev) => {
            const user = data.payload as User;
            return prev.filter((u) => u.userId !== user.userId);
          });
          break;

        case "MESSAGE_SEND":
          setMessages((prev) => {
            const message = data.payload as Message;
            const exists = prev.some((m) => m.id === message.id);
            return exists ? prev : [...prev, message];
          });
          break;

        case "MESSAGE_DELETE": {
          const { messageId } = data.payload as { messageId: string };
          setMessages((prev) => prev.filter((m) => m.id !== messageId));
          break;
        }

        case "COUNTER_UPDATE":
          setCounter(data.payload as Counter);
          break;
      }
    });

    return unsubscribe;
  }, [subscribe, userId]);

  // Clean up expired messages periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setMessages((prev) => prev.filter((msg) => !isMessageExpired(msg)));
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // Actions
  const sendMessage = useCallback(
    (content: string, expiresInMinutes?: number) => {
      if (!content.trim()) return;

      const socket = socketManager.getSocket();
      if (!socket?.connected) {
        setError("Not connected to server");
        return;
      }

      const expiresAt = expiresInMinutes
        ? Date.now() + expiresInMinutes * 60 * 1000
        : null;

      socket.emit("send-message", {
        content: content.trim(),
        expiresAt,
      });
    },
    []
  );

  const deleteMessage = useCallback((messageId: string) => {
    const socket = socketManager.getSocket();
    if (!socket?.connected) {
      setError("Not connected to server");
      return;
    }

    socket.emit("delete-message", messageId);
  }, []);

  const updateCounter = useCallback((newValue: number) => {
    const socket = socketManager.getSocket();
    if (!socket?.connected) {
      setError("Not connected to server");
      return;
    }

    socket.emit("update-counter", newValue);
  }, []);

  const incrementCounter = useCallback(() => {
    updateCounter(counter.value + 1);
  }, [counter.value, updateCounter]);

  const decrementCounter = useCallback(() => {
    updateCounter(counter.value - 1);
  }, [counter.value, updateCounter]);

  // Debounced typing indicator
  const debouncedStopTyping = useCallback(() => {
    const stopTypingDebounced = debounce(() => {
      const socket = socketManager.getSocket();
      if (socket?.connected) {
        socket.emit("typing", false);
      }
    }, 1000);
    return stopTypingDebounced;
  }, []);

  const markTyping = useCallback(() => {
    const socket = socketManager.getSocket();
    if (socket?.connected) {
      socket.emit("typing", true);
      debouncedStopTyping()();
    }
  }, [debouncedStopTyping]);

  const stopTyping = useCallback(() => {
    const socket = socketManager.getSocket();
    if (socket?.connected) {
      socket.emit("typing", false);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    const typingTimeouts = typingTimeoutRef.current;
    const messageTimeouts = messageExpirationTimeoutRef.current;

    return () => {
      // Clear all timeouts using captured values
      typingTimeouts.forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
      messageTimeouts.forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });

      typingTimeouts.clear();
      messageTimeouts.clear();
    };
  }, []);

  return {
    // State
    users,
    messages,
    counter,
    typingUsers,
    activityLog,
    isConnected,
    error,
    loading,

    // Actions
    sendMessage,
    deleteMessage,
    updateCounter,
    incrementCounter,
    decrementCounter,
    markTyping,
    stopTyping,

    // Utils
    clearError: () => setError(null),
    reconnect: () => socketManager.connect(),
  };
};
