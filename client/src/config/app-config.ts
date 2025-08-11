// Application Configuration and Feature Documentation

export const APP_CONFIG = {
  name: 'Broadcast Collaboration Dashboard',
  version: '1.0.0',
  description: 'Real-time collaborative dashboard with cross-tab synchronization',
  
  features: {
    realTime: {
      enabled: true,
      socketUrl: import.meta.env.PROD
        ? 'wss://your-server.com' 
        : 'ws://localhost:3000',
      reconnectAttempts: 5,
      reconnectDelay: 1000,
    },
    
    crossTab: {
      enabled: true,
      channelPrefix: 'collaboration-',
      maxHistory: 100,
    },
    
    chat: {
      maxMessageLength: 500,
      expirationOptions: [1, 5, 15, 60, 1440], // minutes
      typingTimeout: 1000, // ms
      maxMessages: 1000,
    },
    
    counter: {
      minValue: Number.MIN_SAFE_INTEGER,
      maxValue: Number.MAX_SAFE_INTEGER,
      trackLastAction: true,
    },
    
    users: {
      maxUsers: 50,
      activityTimeout: 5 * 60 * 1000, // 5 minutes
      colorPool: [
        '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
        '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16',
        '#F97316', '#6366F1', '#14B8A6', '#F59E0B',
      ],
    },
    
    theme: {
      defaultTheme: 'system' as const,
      supportedThemes: ['light', 'dark', 'system'] as const,
      storageKey: 'broadcast-app-theme',
    },
    
    activity: {
      maxItems: 20,
      retentionTime: 24 * 60 * 60 * 1000, // 24 hours
      trackTypes: [
        'user_joined',
        'user_left', 
        'message_sent',
        'counter_updated',
      ] as const,
    },
  },
  
  performance: {
    debounceTyping: 300, // ms
    throttleActivity: 1000, // ms
    batchUpdates: true,
    maxConcurrentConnections: 100,
  },
  
  security: {
    sanitizeMessages: true,
    maxSessionNameLength: 50,
    maxUsernameLength: 50,
    rateLimiting: {
      messages: 10, // per minute
      counterUpdates: 30, // per minute
      typingIndicators: 60, // per minute
    },
  },
  
  accessibility: {
    keyboardNavigation: true,
    screenReaderSupport: true,
    highContrast: true,
    reducedMotion: true,
  },
} as const;

export const SOCKET_EVENTS = {
  // Connection events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  
  // Session events
  JOIN_SESSION: 'join-session',
  LEAVE_SESSION: 'leave-session',
  SESSION_STATE: 'session-state',
  
  // User events
  USER_JOINED: 'user-joined',
  USER_LEFT: 'user-left',
  USER_ACTIVITY: 'user-activity-updated',
  
  // Message events
  SEND_MESSAGE: 'send-message',
  NEW_MESSAGE: 'new-message',
  DELETE_MESSAGE: 'delete-message',
  MESSAGE_DELETED: 'message-deleted',
  
  // Counter events
  UPDATE_COUNTER: 'update-counter',
  COUNTER_UPDATED: 'counter-updated',
  
  // Typing events
  TYPING_START: 'typing-start',
  TYPING_STOP: 'typing-stop',
  USER_TYPING: 'user-typing',
  USER_STOPPED_TYPING: 'user-stopped-typing',
} as const;

export const BROADCAST_CHANNEL_EVENTS = {
  USER_JOINED: 'USER_JOINED',
  USER_LEFT: 'USER_LEFT',
  MESSAGE_ADDED: 'MESSAGE_ADDED',
  MESSAGE_DELETED: 'MESSAGE_DELETED',
  COUNTER_UPDATED: 'COUNTER_UPDATED',
  TYPING_START: 'TYPING_START',
  TYPING_STOP: 'TYPING_STOP',
  SESSION_STATE: 'SESSION_STATE',
  CONNECTION_STATUS: 'CONNECTION_STATUS',
} as const;

// Error types and messages
export const ERROR_MESSAGES = {
  CONNECTION_FAILED: 'Failed to connect to server',
  SESSION_JOIN_FAILED: 'Failed to join session',
  MESSAGE_SEND_FAILED: 'Failed to send message',
  COUNTER_UPDATE_FAILED: 'Failed to update counter',
  INVALID_SESSION_ID: 'Invalid session ID',
  INVALID_USERNAME: 'Invalid username',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded, please slow down',
  BROWSER_NOT_SUPPORTED: 'Your browser does not support required features',
} as const;

// Development and debugging
export const DEBUG_CONFIG = {
  enableLogging: import.meta.env.DEV,
  logLevels: ['error', 'warn', 'info', 'debug'] as const,
  enableDevTools: import.meta.env.DEV,
  mockData: import.meta.env.DEV,
};
