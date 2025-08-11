export interface User {
  id: string;
  name: string;
  joinedAt: number;
  lastActivity: number;
  color?: string;
}

export interface Message {
  id: string;
  user: User;
  content: string;
  timestamp: number;
  expiresAt?: number;
}

export interface CounterUpdate {
  user: User;
  action: 'increment' | 'decrement';
  timestamp: number;
}

export interface SessionState {
  users: User[];
  messages: Message[];
  counter: number;
  lastCounterUpdate: CounterUpdate | null;
}

export interface TypingUser {
  userId: string;
  userName: string;
}

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  theme: Theme;
  systemTheme: 'light' | 'dark';
}

export interface BroadcastData {
  type: string;
  payload: unknown;
  timestamp: number;
}
