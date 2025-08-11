import { useEffect, useState, useCallback } from 'react';
import { useBroadcastSync } from '../utils/css-variables';
import type { User, SessionState, Message, CounterUpdate, TypingUser, BroadcastData } from '../types';

interface CollaborativeSessionOptions {
  sessionId: string;
  user: User;
  enableBroadcastChannel?: boolean;
}

export const useCollaborativeSession = ({ 
  sessionId, 
  user, 
  enableBroadcastChannel = true 
}: CollaborativeSessionOptions) => {
  // Local state
  const [users, setUsers] = useState<User[]>([user]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [counter, setCounter] = useState(0);
  const [lastCounterUpdate, setLastCounterUpdate] = useState<CounterUpdate | null>(null);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Cross-tab sync configuration
  const { broadcast, subscribe } = useBroadcastSync<BroadcastData>({
    channel: `collaboration-${sessionId}`,
    enabled: enableBroadcastChannel,
  });

  // Broadcast data to other tabs
  const broadcastToTabs = useCallback((type: string, payload: unknown) => {
    if (enableBroadcastChannel) {
      const data: BroadcastData = {
        type,
        payload,
        timestamp: Date.now(),
      };
      broadcast(data);
    }
  }, [broadcast, enableBroadcastChannel]);

  // Handle incoming broadcast messages from other tabs
  useEffect(() => {
    if (!enableBroadcastChannel) return;

    const unsubscribe = subscribe((data: BroadcastData) => {
      switch (data.type) {
        case 'USER_JOINED':
          setUsers(prev => {
            const user = data.payload as User;
            if (prev.find(u => u.id === user.id)) return prev;
            return [...prev, user];
          });
          break;

        case 'USER_LEFT':
          setUsers(prev => {
            const user = data.payload as User;
            return prev.filter(u => u.id !== user.id);
          });
          break;

        case 'MESSAGE_ADDED':
          setMessages(prev => {
            const message = data.payload as Message;
            if (prev.find(m => m.id === message.id)) return prev;
            return [...prev, message];
          });
          break;

        case 'MESSAGE_DELETED':
          setMessages(prev => {
            const messageId = data.payload as string;
            return prev.filter(m => m.id !== messageId);
          });
          break;

        case 'COUNTER_UPDATED': {
          const counterData = data.payload as { counter: number; lastUpdate: CounterUpdate };
          setCounter(counterData.counter);
          setLastCounterUpdate(counterData.lastUpdate);
          break;
        }

        case 'TYPING_START':
          setTypingUsers(prev => {
            const typingUser = data.payload as TypingUser;
            if (prev.find(t => t.userId === typingUser.userId)) return prev;
            return [...prev, typingUser];
          });
          break;

        case 'TYPING_STOP':
          setTypingUsers(prev => {
            const typingUser = data.payload as TypingUser;
            return prev.filter(t => t.userId !== typingUser.userId);
          });
          break;

        case 'SESSION_STATE': {
          const sessionState = data.payload as SessionState;
          setUsers(sessionState.users);
          setMessages(sessionState.messages);
          setCounter(sessionState.counter);
          setLastCounterUpdate(sessionState.lastCounterUpdate);
          break;
        }

        case 'CONNECTION_STATUS':
          setIsConnected(data.payload as boolean);
          break;

        default:
          console.warn('Unknown broadcast message type:', data.type);
      }
    });

    return unsubscribe;
  }, [subscribe, enableBroadcastChannel]);

  // Session actions
  const actions = {
    // User management
    addUser: useCallback((newUser: User) => {
      setUsers(prev => {
        if (prev.find(u => u.id === newUser.id)) return prev;
        const updated = [...prev, newUser];
        broadcastToTabs('USER_JOINED', newUser);
        return updated;
      });
    }, [broadcastToTabs]),

    removeUser: useCallback((userId: string) => {
      setUsers(prev => {
        const user = prev.find(u => u.id === userId);
        if (!user) return prev;
        const updated = prev.filter(u => u.id !== userId);
        broadcastToTabs('USER_LEFT', user);
        return updated;
      });
    }, [broadcastToTabs]),

    updateUserActivity: useCallback((userId: string, lastActivity: number) => {
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, lastActivity }
          : user
      ));
    }, []),

    // Message management
    addMessage: useCallback((message: Message) => {
      setMessages(prev => {
        if (prev.find(m => m.id === message.id)) return prev;
        const updated = [...prev, message];
        broadcastToTabs('MESSAGE_ADDED', message);
        return updated;
      });
    }, [broadcastToTabs]),

    deleteMessage: useCallback((messageId: string) => {
      setMessages(prev => {
        const updated = prev.filter(m => m.id !== messageId);
        broadcastToTabs('MESSAGE_DELETED', messageId);
        return updated;
      });
    }, [broadcastToTabs]),

    // Counter management
    incrementCounter: useCallback((updateInfo: CounterUpdate) => {
      setCounter(prev => {
        const newValue = prev + 1;
        setLastCounterUpdate(updateInfo);
        broadcastToTabs('COUNTER_UPDATED', { 
          counter: newValue, 
          lastUpdate: updateInfo 
        });
        return newValue;
      });
    }, [broadcastToTabs]),

    decrementCounter: useCallback((updateInfo: CounterUpdate) => {
      setCounter(prev => {
        const newValue = prev - 1;
        setLastCounterUpdate(updateInfo);
        broadcastToTabs('COUNTER_UPDATED', { 
          counter: newValue, 
          lastUpdate: updateInfo 
        });
        return newValue;
      });
    }, [broadcastToTabs]),

    // Typing indicators
    startTyping: useCallback((typingUser: TypingUser) => {
      setTypingUsers(prev => {
        if (prev.find(t => t.userId === typingUser.userId)) return prev;
        const updated = [...prev, typingUser];
        broadcastToTabs('TYPING_START', typingUser);
        return updated;
      });
    }, [broadcastToTabs]),

    stopTyping: useCallback((userId: string) => {
      setTypingUsers(prev => {
        const typingUser = prev.find(t => t.userId === userId);
        if (!typingUser) return prev;
        const updated = prev.filter(t => t.userId !== userId);
        broadcastToTabs('TYPING_STOP', typingUser);
        return updated;
      });
    }, [broadcastToTabs]),

    // Session state management
    updateSessionState: useCallback((state: SessionState) => {
      setUsers(state.users);
      setMessages(state.messages);
      setCounter(state.counter);
      setLastCounterUpdate(state.lastCounterUpdate);
      broadcastToTabs('SESSION_STATE', state);
    }, [broadcastToTabs]),

    updateConnectionStatus: useCallback((connected: boolean) => {
      setIsConnected(connected);
      broadcastToTabs('CONNECTION_STATUS', connected);
    }, [broadcastToTabs]),
  };

  // Cleanup expired messages
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setMessages(prev => prev.filter(msg => {
        if (!msg.expiresAt) return true;
        return msg.expiresAt > now;
      }));
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return {
    // State
    sessionId,
    user,
    users,
    messages,
    counter,
    lastCounterUpdate,
    typingUsers,
    isConnected,
    
    // Actions
    ...actions,
  };
};
