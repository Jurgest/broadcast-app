import { useState } from 'react';
import './App.css';
import { ThemeToggle } from './components/ThemeToggle';

function App() {
  const [sessionId, setSessionId] = useState('');
  const [username, setUsername] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const handleJoinSession = () => {
    if (sessionId.trim() && username.trim()) {
      setIsConnected(true);
    }
  };

  if (!isConnected) {
    return (
      <div className="app">
        <div className="login-container">
          <h1>Cross-Tab Collaboration Dashboard</h1>
          <div className="login-form">
            <input
              type="text"
              placeholder="Enter session ID"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              className="input"
            />
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input"
            />
            <button 
              onClick={handleJoinSession}
              className="button button-primary"
              disabled={!sessionId.trim() || !username.trim()}
            >
              Join Session
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Collaboration Dashboard</h1>
        <div className="header-controls">
          <div className="session-info">
            <span>Session: {sessionId}</span>
            <span>User: {username}</span>
          </div>
          <ThemeToggle />
        </div>
      </header>
      
      <main className="main-content">
        <div className="left-panel">
          <div className="panel">
            <h3>Users Online</h3>
            <div className="user-list">
              <div className="user-item">
                <div className="user-avatar">{username[0]?.toUpperCase()}</div>
                <span>{username} (you)</span>
              </div>
            </div>
          </div>
          
          <div className="panel">
            <h3>Shared Counter</h3>
            <div className="counter-container">
              <button className="button">-</button>
              <span className="counter-value">0</span>
              <button className="button">+</button>
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
