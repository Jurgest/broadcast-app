import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { generateRandomColor } from '../utils/helpers';
import type { User } from '../types';

interface SessionSetupProps {
  onJoinSession: (sessionId: string, user: User) => void;
}

export const SessionSetup: React.FC<SessionSetupProps> = ({ onJoinSession }) => {
  const [sessionId, setSessionId] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateSessionId = () => {
    setSessionId(uuidv4().slice(0, 8));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionId.trim() || !username.trim()) return;

    setIsLoading(true);
    
    const user: User = {
      id: uuidv4(),
      name: username.trim(),
      joinedAt: Date.now(),
      lastActivity: Date.now(),
      color: generateRandomColor(),
    };

    // Simulate a small delay for better UX
    setTimeout(() => {
      onJoinSession(sessionId.trim(), user);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="session-setup">
      <div className="setup-container">
        <h1>Cross-Tab Collaboration Dashboard</h1>
        <p>Join or create a session to start collaborating in real-time</p>
        
        <form onSubmit={handleSubmit} className="setup-form">
          <div className="form-group">
            <label htmlFor="sessionId">Session ID</label>
            <div className="session-id-input">
              <input
                id="sessionId"
                type="text"
                placeholder="Enter session ID or generate one"
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
                className="input"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={generateSessionId}
                className="button"
                disabled={isLoading}
              >
                Generate
              </button>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="username">Your Name</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input"
              disabled={isLoading}
              maxLength={50}
            />
          </div>
          
          <button 
            type="submit"
            className="button button-primary setup-submit"
            disabled={!sessionId.trim() || !username.trim() || isLoading}
          >
            {isLoading ? 'Joining...' : 'Join Session'}
          </button>
        </form>
        
        <div className="setup-features">
          <h3>Features</h3>
          <ul>
            <li>Real-time user presence tracking</li>
            <li>Shared counter with live updates</li>
            <li>Group chat with message expiration</li>
            <li>Cross-tab synchronization</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
