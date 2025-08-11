import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Clock, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import type { Message, User, TypingUser } from '../types';

interface ChatProps {
  user: User;
  messages: Message[];
  typingUsers: TypingUser[];
  onSendMessage: (message: Message) => void;
  onDeleteMessage: (messageId: string) => void;
  onStartTyping: (user: TypingUser) => void;
  onStopTyping: (userId: string) => void;
  className?: string;
}

export const Chat: React.FC<ChatProps> = ({
  user,
  messages,
  typingUsers,
  onSendMessage,
  onDeleteMessage,
  onStartTyping,
  onStopTyping,
  className = '',
}) => {
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showExpiration, setShowExpiration] = useState(false);
  const [expirationMinutes, setExpirationMinutes] = useState(5);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<number>();
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle typing indicators
  const handleInputChange = useCallback((value: string) => {
    setMessageInput(value);

    if (value.trim() && !isTyping) {
      setIsTyping(true);
      onStartTyping({ userId: user.id, userName: user.name });
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      window.clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = window.setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        onStopTyping(user.id);
      }
    }, 1000);
  }, [user.id, user.name, isTyping, onStartTyping, onStopTyping]);

  // Stop typing when component unmounts
  useEffect(() => {
    return () => {
      if (isTyping) {
        onStopTyping(user.id);
      }
      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [user.id, isTyping, onStopTyping]);

  const handleSendMessage = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    const content = messageInput.trim();
    if (!content) return;

    const now = Date.now();
    const message: Message = {
      id: uuidv4(),
      user,
      content,
      timestamp: now,
      expiresAt: showExpiration ? now + (expirationMinutes * 60 * 1000) : undefined,
    };

    onSendMessage(message);
    setMessageInput('');
    
    // Stop typing indicator
    if (isTyping) {
      setIsTyping(false);
      onStopTyping(user.id);
    }

    // Focus back to input
    inputRef.current?.focus();
  }, [messageInput, user, showExpiration, expirationMinutes, onSendMessage, isTyping, onStopTyping]);

  const handleDeleteMessage = useCallback((messageId: string, messageUserId: string) => {
    // Only allow users to delete their own messages
    if (messageUserId === user.id) {
      onDeleteMessage(messageId);
    }
  }, [user.id, onDeleteMessage]);

  const formatTimestamp = useCallback((timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  }, []);

  const formatExpirationTime = useCallback((expiresAt: number) => {
    const now = Date.now();
    const remaining = expiresAt - now;
    
    if (remaining <= 0) return 'expired';
    
    const minutes = Math.floor(remaining / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d left`;
    if (hours > 0) return `${hours}h left`;
    return `${minutes}m left`;
  }, []);

  const getTypingIndicator = useCallback(() => {
    const otherTypingUsers = typingUsers.filter(t => t.userId !== user.id);
    
    if (otherTypingUsers.length === 0) return null;
    
    if (otherTypingUsers.length === 1) {
      return `${otherTypingUsers[0].userName} is typing...`;
    }
    
    if (otherTypingUsers.length === 2) {
      return `${otherTypingUsers[0].userName} and ${otherTypingUsers[1].userName} are typing...`;
    }
    
    return `${otherTypingUsers.length} people are typing...`;
  }, [typingUsers, user.id]);

  const sortedMessages = messages
    .filter(msg => !msg.expiresAt || msg.expiresAt > Date.now())
    .sort((a, b) => a.timestamp - b.timestamp);

  return (
    <div className={`flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Chat ({sortedMessages.length})
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Clock className="w-4 h-4" />
          <span>Live chat</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {sortedMessages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          sortedMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.user.id === user.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg relative group ${
                  message.user.id === user.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                {/* User name (for other users) */}
                {message.user.id !== user.id && (
                  <div className="text-xs opacity-75 mb-1 font-medium">
                    {message.user.name}
                  </div>
                )}

                {/* Message content */}
                <div className="break-words">{message.content}</div>

                {/* Timestamp and expiration */}
                <div className="flex items-center justify-between mt-1 text-xs opacity-75">
                  <span>{formatTimestamp(message.timestamp)}</span>
                  {message.expiresAt && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatExpirationTime(message.expiresAt)}
                    </span>
                  )}
                </div>

                {/* Delete button (own messages only) */}
                {message.user.id === user.id && (
                  <button
                    onClick={() => handleDeleteMessage(message.id, message.user.id)}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    title="Delete message"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}

        {/* Typing indicator */}
        {getTypingIndicator() && (
          <div className="text-sm text-gray-500 dark:text-gray-400 italic animate-pulse">
            {getTypingIndicator()}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        {/* Expiration settings */}
        <div className="mb-3">
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              checked={showExpiration}
              onChange={(e) => setShowExpiration(e.target.checked)}
              className="rounded border-gray-300 dark:border-gray-600"
            />
            Auto-expire messages
          </label>
          {showExpiration && (
            <div className="mt-2 flex items-center gap-2">
              <select
                value={expirationMinutes}
                onChange={(e) => setExpirationMinutes(Number(e.target.value))}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value={1}>1 minute</option>
                <option value={5}>5 minutes</option>
                <option value={15}>15 minutes</option>
                <option value={60}>1 hour</option>
                <option value={1440}>24 hours</option>
              </select>
              <span className="text-sm text-gray-500 dark:text-gray-400">expiration</span>
            </div>
          )}
        </div>

        {/* Message form */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={messageInput}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!messageInput.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </form>

        {/* Character count */}
        {messageInput.length > 400 && (
          <div className="mt-1 text-xs text-right text-gray-500 dark:text-gray-400">
            {messageInput.length}/500
          </div>
        )}
      </div>
    </div>
  );
};
