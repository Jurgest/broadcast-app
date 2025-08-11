import React, { useState } from "react";
import {
  AlertCircle,
  Copy,
  ExternalLink,
  Users,
  MessageSquare,
  Hash,
  Activity,
  X,
  Menu,
  ChevronLeft,
} from "lucide-react";
import { Chat } from "./Chat";
import { Counter } from "./Counter";
import { UserList } from "./UserList";
import { ActivityFeed } from "./ActivityFeed";
import { useCollaborativeSession } from "../hooks/useCollaborativeSession";
import { copyToClipboard } from "../utils/helpers";

interface DashboardProps {
  sessionId: string;
  userId: string;
  username: string;
}

export const Dashboard: React.FC<DashboardProps> = ({
  sessionId,
  userId,
  username,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const {
    users,
    messages,
    counter,
    typingUsers,
    activityLog,
    isConnected,
    error,
    loading,
    sendMessage,
    deleteMessage,
    updateCounter,
    incrementCounter,
    decrementCounter,
    markTyping,
    stopTyping,
    clearError,
    reconnect,
  } = useCollaborativeSession({
    sessionId,
    userId,
    username,
  });

  const handleCopySessionId = async () => {
    const success = await copyToClipboard(sessionId);
    if (success) {
      // Could add a toast notification here
      console.log("Session ID copied to clipboard");
    }
  };

  const handleOpenNewTab = () => {
    window.open(window.location.href, "_blank");
  };

  const handleResetCounter = () => {
    updateCounter(0);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
          <div
            className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-float"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>

        <div className="relative z-10 text-center space-y-6 animate-bounce-in">
          <div className="w-20 h-20 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto shadow-glow"></div>
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-white text-shadow">
              Connecting to Session
            </h2>
            <p className="text-lg text-white/80 max-w-md mx-auto">
              Preparing your collaborative workspace and establishing real-time
              connections...
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-white/60">
            <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
            <div
              className="w-2 h-2 bg-white/60 rounded-full animate-pulse"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-2 h-2 bg-white/60 rounded-full animate-pulse"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Floating animation elements only - no background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
        <div
          className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Content overlay */}
      <div className="relative z-10 flex-1 flex flex-col min-h-0">
        {/* Error Banner */}
        {error && (
          <div className="glass-effect bg-red-500/20 backdrop-blur-lg border-b border-red-400/30 animate-slide-in">
            <div className="content-container py-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-red-100 flex-1">
                  <div className="w-10 h-10 bg-red-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertCircle size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-red-100">
                      Connection Error
                    </h3>
                    <p className="text-sm text-red-200/80 truncate">{error}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <button
                    onClick={reconnect}
                    className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white rounded-lg transition-all duration-200 font-medium border border-white/20 text-sm"
                  >
                    Reconnect
                  </button>
                  <button
                    onClick={clearError}
                    className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                    title="Dismiss error"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 flex min-h-0">
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Sticky Header */}
            <div className="sticky top-0 z-30 bg-black/20 backdrop-blur-lg border-b border-white/20 p-4 lg:p-8">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl lg:text-3xl font-bold text-white">
                  Collaborative Session
                </h1>
                <button
                  onClick={toggleSidebar}
                  className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                  title="Toggle sidebar"
                >
                  <Menu size={24} />
                </button>
              </div>
            </div>

            {/* Chat Container */}
            <div className="flex-1 p-4 lg:p-8 pt-0 lg:pt-0 min-h-0">
              <div
                className="card-glass h-full flex flex-col animate-fade-in"
                style={{ animationDelay: "0.1s" }}
              >
                <div className="card-header flex-shrink-0">
                  <h2 className="heading-3 text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-green-300" />
                    Real-time Chat
                    <span className="ml-auto flex items-center gap-2">
                      {typingUsers.length > 0 && (
                        <span className="text-xs text-yellow-300 bg-yellow-500/20 px-2 py-1 rounded-full">
                          {typingUsers.length} typing...
                        </span>
                      )}
                      <span className="text-sm bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                        {messages.length} messages
                      </span>
                    </span>
                  </h2>
                </div>
                <div className="flex-1 min-h-0 overflow-hidden">
                  <Chat
                    messages={messages}
                    currentUserId={userId}
                    onSendMessage={sendMessage}
                    onDeleteMessage={deleteMessage}
                    onTyping={markTyping}
                    onStopTyping={stopTyping}
                    typingUsers={typingUsers}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Collapsible Right Sidebar */}
          <div
            className={`
            fixed lg:relative inset-y-0 right-0 z-50 w-80 lg:w-96 
            transform ${
              isSidebarOpen
                ? "translate-x-0"
                : "translate-x-full lg:translate-x-0"
            }
            transition-transform duration-300 ease-in-out
            bg-black/50 lg:bg-transparent backdrop-blur-lg lg:backdrop-blur-none
          `}
          >
            {/* Sidebar Header - Mobile only */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/20">
              <h2 className="text-lg font-semibold text-white">Dashboard</h2>
              <button
                onClick={toggleSidebar}
                className="p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                <ChevronLeft size={20} />
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="p-4 lg:p-8 space-y-6 h-full overflow-y-auto">
              {/* Users Section */}
              <div
                className="card-glass animate-fade-in"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="card-header">
                  <h3 className="heading-3 text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-300" />
                    Active Users
                    <span className="ml-auto text-sm bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                      {users.length}
                    </span>
                  </h3>
                </div>
                <div className="card-body">
                  <UserList
                    users={users}
                    currentUserId={userId}
                    typingUsers={typingUsers}
                    isConnected={isConnected}
                  />
                </div>
              </div>

              {/* Counter Section */}
              <div
                className="card-glass animate-fade-in"
                style={{ animationDelay: "0.3s" }}
              >
                <div className="card-header">
                  <h3 className="heading-3 text-white flex items-center gap-2">
                    <Hash className="w-5 h-5 text-purple-300" />
                    Shared Counter
                  </h3>
                </div>
                <div className="card-body">
                  <Counter
                    counter={counter}
                    onIncrement={incrementCounter}
                    onDecrement={decrementCounter}
                    onReset={handleResetCounter}
                  />
                </div>
              </div>

              {/* Activity Feed Section */}
              <div
                className="card-glass animate-fade-in"
                style={{ animationDelay: "0.4s" }}
              >
                <div className="card-header">
                  <h3 className="heading-3 text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-orange-300" />
                    Activity Feed
                    <span className="ml-auto text-sm bg-orange-500/20 text-orange-300 px-2 py-1 rounded-full">
                      Live
                    </span>
                  </h3>
                </div>
                <div className="card-body">
                  <ActivityFeed activities={activityLog} />
                </div>
              </div>

              {/* Session Info Section */}
              <div
                className="card-glass animate-fade-in"
                style={{ animationDelay: "0.5s" }}
              >
                <div className="card-header">
                  <h3 className="heading-3 text-white flex items-center gap-2">
                    <Hash className="w-5 h-5 text-cyan-300" />
                    Session Info
                  </h3>
                </div>
                <div className="card-body space-y-4">
                  <div className="space-y-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-white/70">Session ID</span>
                      <code className="text-xs font-mono text-cyan-300 bg-cyan-500/20 px-2 py-1 rounded break-all">
                        {sessionId}
                      </code>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-white/70">
                        Your Username
                      </span>
                      <span className="text-sm text-white font-medium break-all">
                        {username}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/70">Connection</span>
                      <div
                        className={`status-indicator ${
                          isConnected
                            ? "status-connected"
                            : "status-disconnected"
                        }`}
                      >
                        <div className="w-2 h-2 rounded-full animate-pulse bg-current"></div>
                        {isConnected ? "Connected" : "Disconnected"}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <button
                      onClick={handleOpenNewTab}
                      className="w-full btn-secondary flex items-center justify-center gap-2 text-sm"
                    >
                      <ExternalLink size={16} />
                      Test in New Tab
                    </button>
                    <button
                      onClick={handleCopySessionId}
                      className="w-full btn-secondary flex items-center justify-center gap-2 text-sm"
                    >
                      <Copy size={16} />
                      Copy Session ID
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Stats - Mobile friendly */}
              <div className="grid grid-cols-1 gap-3 lg:hidden">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-sm text-white/70">Users</span>
                  <span className="font-medium text-white">{users.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-sm text-white/70">Messages</span>
                  <span className="font-medium text-white">
                    {messages.length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-sm text-white/70">Counter</span>
                  <span className="font-medium text-white">
                    {counter.value}
                  </span>
                </div>
              </div>

              {/* Collaboration Info */}
              <div
                className="card-glass animate-fade-in"
                style={{ animationDelay: "0.6s" }}
              >
                <div className="card-header">
                  <h3 className="heading-3 text-white flex items-center gap-2">
                    <ExternalLink className="w-5 h-5 text-emerald-300" />
                    Collaboration
                  </h3>
                </div>
                <div className="card-body space-y-4">
                  <p className="text-white/80 text-sm">
                    Open multiple tabs to see real-time synchronization in
                    action.
                  </p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col items-center gap-1 p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-white/70">User</span>
                      <span className="font-medium text-white text-xs truncate max-w-full">
                        {username}
                      </span>
                    </div>

                    <div className="flex flex-col items-center gap-1 p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-white/70">Session</span>
                      <code className="font-mono text-white text-xs truncate max-w-full">
                        {sessionId.slice(-6)}
                      </code>
                    </div>

                    <div className="flex flex-col items-center gap-1 p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-white/70">Users</span>
                      <span className="font-medium text-white text-xs">
                        {users.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Overlay for mobile */}
          {isSidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={toggleSidebar}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="flex-shrink-0 glass-effect bg-white/10 backdrop-blur-lg border-t border-white/20">
          <div className="px-4 lg:px-8 py-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-center sm:text-left">
                <h3 className="text-sm font-medium text-white">
                  Cross-Tab Collaboration Dashboard
                </h3>
                <p className="text-xs text-white/60">
                  Real-time synchronization across browser tabs
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenNewTab}
                  className="btn-secondary flex items-center gap-2 text-xs px-3 py-2"
                >
                  <ExternalLink size={14} />
                  New Tab
                </button>
                <button
                  onClick={toggleSidebar}
                  className="lg:hidden btn-secondary flex items-center gap-2 text-xs px-3 py-2"
                >
                  <Menu size={14} />
                  Dashboard
                </button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
