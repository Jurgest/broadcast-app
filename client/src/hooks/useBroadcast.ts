import { useEffect, useState, useCallback } from 'react';
import { connectSocket, disconnectSocket, getSocket } from '../utils/socket';
import { useCollaborativeSession } from './useCollaborativeSession';
import type { User, SessionState, Message, CounterUpdate, TypingUser } from '../types';

export const useBroadcast = (sessionId: string, currentUser: User) => {
  const [isConnected, setIsConnected] = useState(false);
  
  // Use collaborative session for cross-tab sync
  const session = useCollaborativeSession({
    sessionId,
    user: currentUser,
    enableBroadcastChannel: true,
  });

  // Connect to socket and join session
  useEffect(() => {
    const socket = connectSocket();
    
    const handleConnect = () => {
      console.log('Connected to server');
      setIsConnected(true);
      session.updateConnectionStatus(true);
      
      // Join the session
      socket.emit('join-session', {
        sessionId,
        user: currentUser,
      });
    };

    const handleDisconnect = () => {
      console.log('Disconnected from server');
      setIsConnected(false);
      session.updateConnectionStatus(false);
    };

    const handleSessionState = (state: SessionState) => {
      session.updateSessionState(state);
    };

    const handleUserJoined = (user: User) => {
      session.addUser(user);
    };

    const handleUserLeft = (user: User) => {
      session.removeUser(user.id);
    };

    const handleNewMessage = (message: Message) => {
      session.addMessage(message);
    };

    const handleMessageDeleted = ({ messageId }: { messageId: string }) => {
      session.deleteMessage(messageId);
    };

    const handleCounterUpdated = ({ counter: newCounter, lastUpdate }: { counter: number; lastUpdate: CounterUpdate }) => {
      // The session hook will handle the counter state updates based on the action
      if (lastUpdate.action === 'increment') {
        session.incrementCounter(lastUpdate);
      } else {
        session.decrementCounter(lastUpdate);
      }
    };

    const handleUserTyping = (data: TypingUser) => {
      session.startTyping(data);
    };

    const handleUserStoppedTyping = (data: TypingUser) => {
      session.stopTyping(data.userId);
    };

    const handleUserActivityUpdated = ({ userId, lastActivity }: { userId: string; lastActivity: number }) => {
      session.updateUserActivity(userId, lastActivity);
    };

    // Set up event listeners
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('session-state', handleSessionState);
    socket.on('user-joined', handleUserJoined);
    socket.on('user-left', handleUserLeft);
    socket.on('new-message', handleNewMessage);
    socket.on('message-deleted', handleMessageDeleted);
    socket.on('counter-updated', handleCounterUpdated);
    socket.on('user-typing', handleUserTyping);
    socket.on('user-stopped-typing', handleUserStoppedTyping);
    socket.on('user-activity-updated', handleUserActivityUpdated);

    // Connect if not already connected
    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('session-state', handleSessionState);
      socket.off('user-joined', handleUserJoined);
      socket.off('user-left', handleUserLeft);
      socket.off('new-message', handleNewMessage);
      socket.off('message-deleted', handleMessageDeleted);
      socket.off('counter-updated', handleCounterUpdated);
      socket.off('user-typing', handleUserTyping);
      socket.off('user-stopped-typing', handleUserStoppedTyping);
      socket.off('user-activity-updated', handleUserActivityUpdated);
      
      disconnectSocket();
    };
  }, [sessionId, currentUser, session]);

  // Send message
  const sendMessage = useCallback((content: string, expirationTime?: number) => {
    const socket = getSocket();
    if (!socket.connected) return;

    const message: Omit<Message, 'timestamp'> = {
      id: Date.now().toString(), // Simple ID for now
      user: currentUser,
      content,
      expiresAt: expirationTime ? Date.now() + (expirationTime * 60 * 1000) : undefined,
    };

    socket.emit('send-message', message);
  }, [currentUser]);

  // Delete message
  const deleteMessage = useCallback((messageId: string) => {
    const socket = getSocket();
    if (!socket.connected) return;

    socket.emit('delete-message', {
      messageId,
      userId: currentUser.id,
    });
  }, [currentUser.id]);

  // Update counter
  const updateCounter = useCallback((action: 'increment' | 'decrement') => {
    const socket = getSocket();
    if (!socket.connected) return;

    socket.emit('update-counter', {
      action,
      user: currentUser,
    });
  }, [currentUser]);

  // Typing indicators
  const startTyping = useCallback(() => {
    const socket = getSocket();
    if (!socket.connected) return;

    socket.emit('typing-start', {
      userId: currentUser.id,
      userName: currentUser.name,
    });
  }, [currentUser]);

  const stopTyping = useCallback(() => {
    const socket = getSocket();
    if (!socket.connected) return;

    socket.emit('typing-stop', {
      userId: currentUser.id,
      userName: currentUser.name,
    });
  }, [currentUser]);

  // Update activity
  const updateActivity = useCallback(() => {
    const socket = getSocket();
    if (!socket.connected) return;

    socket.emit('activity-update', {
      userId: currentUser.id,
    });
  }, [currentUser.id]);

  return {
    isConnected,
    users: session.users,
    messages: session.messages,
    counter: session.counter,
    lastCounterUpdate: session.lastCounterUpdate,
    typingUsers: session.typingUsers,
    sendMessage,
    deleteMessage,
    updateCounter,
    startTyping,
    stopTyping,
    updateActivity,
  };
};
