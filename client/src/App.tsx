import { useState } from 'react';
import './App.css';
import { SessionSetup } from './components/SessionSetup';
import { Dashboard } from './components/Dashboard';
import { ErrorBoundary } from './components/ErrorBoundary';
import type { User } from './types';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [sessionId, setSessionId] = useState('');

  const handleJoinSession = (sessionId: string, user: User) => {
    setSessionId(sessionId);
    setCurrentUser(user);
  };

  const handleLeaveSession = () => {
    setCurrentUser(null);
    setSessionId('');
  };

  if (!currentUser || !sessionId) {
    return (
      <ErrorBoundary>
        <SessionSetup onJoinSession={handleJoinSession} />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <Dashboard 
        sessionId={sessionId} 
        user={currentUser} 
        onLeaveSession={handleLeaveSession}
      />
    </ErrorBoundary>
  );
}

export default App;
