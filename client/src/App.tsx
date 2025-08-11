import { useState } from 'react';
import React from 'react';
import './App.css';
import { ThemeToggle } from './components/ThemeToggle';
import { SessionSetup } from './components/SessionSetup';
import { UserList } from './components/UserList';
import { useBroadcast } from './hooks/useBroadcast';
import type { User } from './types';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [sessionId, setSessionId] = useState('');

  const handleJoinSession = (sessionId: string, user: User) => {
    setSessionId(sessionId);
    setCurrentUser(user);
  };

  if (!currentUser || !sessionId) {
    return <SessionSetup onJoinSession={handleJoinSession} />;
  }

  return <Dashboard sessionId={sessionId} currentUser={currentUser} />;
}

interface DashboardProps {
  sessionId: string;
  currentUser: User;
}

const Dashboard: React.FC<DashboardProps> = ({ sessionId, currentUser }) => {
  const { 
    isConnected, 
    users, 
    counter, 
    updateCounter 
  } = useBroadcast(sessionId, currentUser);

  return (
    <div className="app">
      <header className="header">
        <h1>Collaboration Dashboard</h1>
        <div className="header-controls">
          <div className="session-info">
            <span>Session: {sessionId}</span>
            <span>User: {currentUser.name}</span>
            <span className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
              {isConnected ? '● Connected' : '○ Disconnected'}
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>
      
      <main className="main-content">
        <div className="left-panel">
          <div className="panel">
            <UserList users={users} currentUserId={currentUser.id} />
          </div>
          
          <div className="panel">
            <h3>Shared Counter</h3>
            <div className="counter-container">
              <button 
                className="button" 
                onClick={() => updateCounter('decrement')}
                disabled={!isConnected}
              >
                -
              </button>
              <span className="counter-value">{counter}</span>
              <button 
                className="button" 
                onClick={() => updateCounter('increment')}
                disabled={!isConnected}
              >
                +
              </button>
            </div>
          </div>
        </div>
        
        <div className="right-panel">
          <div className="panel chat-panel">
            <h3>Chat</h3>
            <div className="chat-messages">
              <p className="empty-state">No messages yet. Start the conversation!</p>
            </div>
            <div className="chat-input">
              <input
                type="text"
                placeholder="Type a message..."
                className="input"
              />
              <button className="button button-primary">Send</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
