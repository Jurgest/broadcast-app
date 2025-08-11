import React from "react";
import {
  Users,
  Wifi,
  WifiOff,
  UserCheck,
  UserX,
  MessageCircle,
  Eye,
} from "lucide-react";
import type { User, TypingIndicator } from "../types";
import { formatTimestamp, getAvatarUrl } from "../utils/helpers";

interface UserListProps {
  users: User[];
  currentUserId: string;
  typingUsers: TypingIndicator[];
  isConnected: boolean;
}

export const UserList: React.FC<UserListProps> = ({
  users,
  currentUserId,
  typingUsers,
  isConnected,
}) => {
  const isUserTyping = (userId: string) => {
    return typingUsers.some((t) => t.userId === userId);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-lg flex items-center justify-center shadow-lg">
            <Users size={18} className="text-white" />
          </div>
          <div>
            <span className="text-white font-semibold">Active Users</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-blue-500/30 text-blue-200 text-xs px-2 py-1 rounded-full border border-blue-400/30">
                {users.length} online
              </span>
            </div>
          </div>
        </div>

        <div
          className={`p-2 rounded-lg transition-all duration-200 ${
            isConnected
              ? "bg-green-500/20 text-green-300"
              : "bg-red-500/20 text-red-300"
          }`}
        >
          {isConnected ? (
            <Wifi size={16} className="animate-pulse" />
          ) : (
            <WifiOff size={16} />
          )}
        </div>
      </div>

      {/* Connection Status Banner */}
      <div
        className={`mb-4 p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
          isConnected
            ? "bg-green-500/20 text-green-200 border border-green-400/30"
            : "bg-red-500/20 text-red-200 border border-red-400/30"
        }`}
      >
        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <UserCheck size={16} />
              <span>Real-time sync active</span>
            </>
          ) : (
            <>
              <UserX size={16} />
              <span>Connection lost - retrying...</span>
            </>
          )}
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-hide">
        {users.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-4">
            <Users size={32} className="mx-auto mb-2 opacity-50" />
            <p>No users in session</p>
          </div>
        ) : (
          users.map((user) => {
            const isCurrentUser = user.userId === currentUserId;
            const isTyping = isUserTyping(user.userId);

            return (
              <div
                key={user.userId}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isCurrentUser
                    ? "bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800"
                    : "bg-gray-50 dark:bg-gray-800"
                }`}
              >
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={getAvatarUrl(user.userId)}
                    alt={user.username}
                    className="w-10 h-10 rounded-full"
                  />
                  {/* Online indicator */}
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm truncate">
                      {user.username}
                      {isCurrentUser && (
                        <span className="text-xs text-primary-600 dark:text-primary-400 ml-1">
                          (You)
                        </span>
                      )}
                    </h4>
                    {isTyping && (
                      <div className="flex items-center gap-1">
                        <div className="flex space-x-1">
                          <div
                            className="w-1 h-1 bg-primary-600 rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          />
                          <div
                            className="w-1 h-1 bg-primary-600 rounded-full animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          />
                          <div
                            className="w-1 h-1 bg-primary-600 rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          />
                        </div>
                        <span className="text-xs text-primary-600 dark:text-primary-400">
                          typing...
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Last active: {formatTimestamp(user.lastActivity)}
                  </p>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      Date.now() - user.lastActivity < 60000
                        ? "bg-green-500"
                        : Date.now() - user.lastActivity < 300000
                        ? "bg-yellow-500"
                        : "bg-gray-400"
                    }`}
                    title={
                      Date.now() - user.lastActivity < 60000
                        ? "Active"
                        : Date.now() - user.lastActivity < 300000
                        ? "Away"
                        : "Idle"
                    }
                  ></div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Summary */}
      {users.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="flex items-center justify-between text-sm text-white/70">
            <div className="flex items-center gap-2">
              <Eye size={14} />
              <span>
                {
                  users.filter((u) => Date.now() - u.lastActivity < 60000)
                    .length
                }{" "}
                active now
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle size={14} />
              <span>{typingUsers.length} typing</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
