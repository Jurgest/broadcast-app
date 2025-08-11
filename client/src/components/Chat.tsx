import React, { useState, useRef, useEffect } from "react";
import { Send, Clock, X, Trash2, Edit3 } from "lucide-react";
import type { Message } from "../types";
import { formatTime } from "../utils/helpers";

interface ChatProps {
  messages: Message[];
  currentUserId: string;
  onSendMessage: (content: string, expiresInMinutes?: number) => void;
  onDeleteMessage: (messageId: string) => void;
  onTyping: () => void;
  onStopTyping: () => void;
  typingUsers: Array<{ userId: string; username: string }>;
}

export const Chat: React.FC<ChatProps> = ({
  messages,
  currentUserId,
  onSendMessage,
  onDeleteMessage,
  onTyping,
  onStopTyping,
  typingUsers,
}) => {
  const [messageText, setMessageText] = useState("");
  const [expirationMinutes, setExpirationMinutes] = useState<
    number | undefined
  >();
  const [showExpirationOptions, setShowExpirationOptions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [messageText]);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      onSendMessage(messageText.trim(), expirationMinutes);
      setMessageText("");
      setExpirationMinutes(undefined);
      setShowExpirationOptions(false);
      onStopTyping();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageText(e.target.value);
    onTyping();
  };

  const formatMessageTime = (timestamp: number) => {
    return formatTime(timestamp);
  };

  const isMessageExpired = (message: Message) => {
    return message.expiresAt && Date.now() > message.expiresAt;
  };

  const getTimeUntilExpiration = (expiresAt: number) => {
    const timeLeft = expiresAt - Date.now();
    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="chat-container flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-white font-medium">
            {messages.length} message{messages.length !== 1 ? "s" : ""}
          </span>
        </div>
        <button
          onClick={() => setShowExpirationOptions(!showExpirationOptions)}
          className={`btn-icon transition-all duration-200 ${
            showExpirationOptions
              ? "bg-blue-500/30 text-blue-200 shadow-glow"
              : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
          }`}
          title="Set message expiration"
        >
          <Clock size={18} />
        </button>
      </div>

      {/* Expiration Options */}
      {showExpirationOptions && (
        <div className="p-4 bg-white/5 backdrop-blur-lg border-b border-white/10 animate-slide-in">
          <label className="block text-sm font-semibold text-white mb-3">
            Message expires in:
          </label>
          <div className="flex gap-2 flex-wrap">
            {[1, 5, 15, 30, 60].map((minutes) => (
              <button
                key={minutes}
                onClick={() => setExpirationMinutes(minutes)}
                className={`px-4 py-2 text-sm rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
                  expirationMinutes === minutes
                    ? "bg-blue-500 text-white shadow-glow"
                    : "bg-white/10 text-white/80 hover:bg-white/20 border border-white/20"
                }`}
              >
                {minutes}m
              </button>
            ))}
            <button
              onClick={() => setExpirationMinutes(undefined)}
              className={`px-4 py-2 text-sm rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
                expirationMinutes === undefined
                  ? "bg-blue-500 text-white shadow-glow"
                  : "bg-white/10 text-white/80 hover:bg-white/20 border border-white/20"
              }`}
            >
              Never
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="chat-messages flex-1 overflow-y-auto space-y-3 scrollbar-hide p-4">
        {messages
          .filter((msg) => !isMessageExpired(msg))
          .map((message, index) => {
            const isOwn = message.userId === currentUserId;
            return (
              <div
                key={message.id}
                className={`flex ${
                  isOwn ? "justify-end" : "justify-start"
                } animate-fade-in`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className={`relative group max-w-xs lg:max-w-md`}>
                  {!isOwn && (
                    <div className="flex items-center gap-2 mb-1 ml-1">
                      <div className="avatar-sm bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-xs">
                        {message.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs font-medium text-white/80">
                        {message.username}
                      </span>
                    </div>
                  )}

                  <div
                    className={`message-bubble relative ${
                      isOwn ? "message-own" : "message-other"
                    } transition-all duration-200 hover:shadow-lg`}
                  >
                    <div className="whitespace-pre-wrap break-words">
                      {message.content}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-black/10">
                      <span className="text-xs opacity-70 font-medium">
                        {formatMessageTime(message.timestamp)}
                      </span>
                      {message.expiresAt && (
                        <div className="flex items-center gap-1 text-xs opacity-70">
                          <Clock size={10} />
                          <span>
                            {getTimeUntilExpiration(message.expiresAt)}
                          </span>
                        </div>
                      )}
                    </div>

                    {isOwn && (
                      <button
                        onClick={() => onDeleteMessage(message.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 transform hover:scale-110 shadow-lg"
                        title="Delete message"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>

                  {isOwn && (
                    <div className="flex justify-end mt-1 mr-1">
                      <div className="text-xs text-white/60">You</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

        {/* Typing indicators */}
        {typingUsers.length > 0 && (
          <div className="flex justify-start animate-fade-in">
            <div className="flex items-center gap-2 mb-1 ml-1">
              <div className="avatar-sm bg-gradient-to-r from-green-400 to-blue-400 flex items-center justify-center">
                <Edit3 size={12} className="text-white" />
              </div>
            </div>
            <div className="message-bubble bg-white/20 backdrop-blur-lg border border-white/30 text-white">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">
                  {typingUsers.map((user) => user.username).join(", ")}
                  {typingUsers.length === 1 ? " is" : " are"} typing
                </span>
                <div className="loading-dots">
                  <div
                    className="loading-dot bg-white"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="loading-dot bg-white"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="loading-dot bg-white"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="chat-input border-t border-white/10 bg-white/5 backdrop-blur-lg">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={messageText}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              onBlur={onStopTyping}
              placeholder="Type your message..."
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 resize-none max-h-24 min-h-[48px] focus:outline-none focus:ring-4 focus:ring-blue-200/30 focus:border-blue-400/50 transition-all duration-200 backdrop-blur-lg"
              rows={1}
            />
            {expirationMinutes && (
              <div className="absolute top-2 right-3 flex items-center gap-1 text-xs text-white/70 bg-black/20 rounded-full px-2 py-1">
                <Clock size={10} />
                <span>{expirationMinutes}m</span>
              </div>
            )}
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
            className="btn-primary bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none px-4 py-3 shadow-glow"
            title="Send message"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
