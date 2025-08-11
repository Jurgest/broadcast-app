import React from 'react';
import { UserList } from './UserList';
import { Chat } from './Chat';
import { Counter } from './Counter';
import { ThemeToggle } from './ThemeToggle';
import { useCollaborativeSession } from '../hooks/useCollaborativeSession';
import { useBroadcast } from '../hooks/useBroadcast';
import type { User } from '../types';

interface DashboardProps {
  user: User;
  sessionId: string;
  onLeaveSession: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  sessionId,
  onLeaveSession,
}) => {
  // Use the collaborative session hook for state management
  const session = useCollaborativeSession({
    sessionId,
    user,
    enableBroadcastChannel: true,
  });

  // Use the broadcast hook for Socket.io communication
  const { isConnected } = useBroadcast(sessionId, user);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Collaboration Dashboard
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Session: <span className="font-mono">{sessionId}</span>
              </div>
              <ThemeToggle />
              <button
                onClick={onLeaveSession}
                className="px-4 py-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 border border-red-300 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                Leave Session
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-12rem)]">
          {/* Left Column - Users and Counter */}
          <div className="lg:col-span-1 space-y-6">
            <UserList
              users={session.users}
              currentUserId={user.id}
            />
            <Counter
              user={user}
              counter={session.counter}
              lastCounterUpdate={session.lastCounterUpdate}
              onIncrement={session.incrementCounter}
              onDecrement={session.decrementCounter}
              className="flex-shrink-0"
            />
          </div>

          {/* Right Column - Chat */}
          <div className="lg:col-span-2">
            <Chat
              user={user}
              messages={session.messages}
              typingUsers={session.typingUsers}
              onSendMessage={session.addMessage}
              onDeleteMessage={session.deleteMessage}
              onStartTyping={session.startTyping}
              onStopTyping={session.stopTyping}
              className="h-full"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <span>Real-time collaboration with WebSocket and BroadcastChannel</span>
              <div className="flex items-center gap-2">
                <span>Users online: {session.users.length}</span>
                <span>•</span>
                <span>Messages: {session.messages.length}</span>
                <span>•</span>
                <span>Counter: {session.counter}</span>
              </div>
            </div>
            <div className="text-xs">
              Cross-tab synchronization enabled
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
