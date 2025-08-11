export interface User {
  userId: string;
  username: string;
  lastActivity: number;
  isTyping?: boolean;
}

export interface Message {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: number;
  expiresAt?: number | null;
}

export interface Counter {
  value: number;
  lastUser: string | null;
  timestamp: number;
}

export interface SessionState {
  users: User[];
  messages: Message[];
  counter: Counter;
}

export interface BroadcastData {
  type:
    | "USER_JOIN"
    | "USER_LEAVE"
    | "MESSAGE_SEND"
    | "MESSAGE_DELETE"
    | "COUNTER_UPDATE"
    | "TYPING"
    | "THEME_CHANGE"
    | "SESSION_STATE"
    | "ACTIVITY_LOG";
  payload:
    | User
    | Message
    | Counter
    | TypingIndicator
    | ThemeState
    | SessionState
    | ActivityLog
    | { messageId: string }
    | { value: number };
  timestamp: number;
  userId: string;
}

export interface CollaborativeSessionConfig {
  sessionId: string;
  userId: string;
  username: string;
  channelName?: string;
}

export interface TypingIndicator {
  userId: string;
  username: string;
  isTyping: boolean;
  timestamp: number;
}

export interface ThemeState {
  isDark: boolean;
  timestamp: number;
  userId: string;
}

export interface ActivityLog {
  id: string;
  type: "join" | "leave" | "message" | "counter" | "typing";
  userId: string;
  username: string;
  description: string;
  timestamp: number;
}
