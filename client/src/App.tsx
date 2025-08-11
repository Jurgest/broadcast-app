import { useState } from "react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { SessionSetup } from "./components/SessionSetup";
import { Dashboard } from "./components/Dashboard";
import { ThemeProvider } from "./contexts/ThemeProvider";
import { ThemeDemo } from "./components/ThemeDemo";
import { ThemeToggle } from "./components/ThemeToggle";

interface SessionData {
  sessionId: string;
  userId: string;
  username: string;
}

function App() {
  const [session, setSession] = useState<SessionData | null>(null);
  const [showDemo, setShowDemo] = useState(false);

  const handleJoinSession = async (
    sessionId: string,
    userId: string,
    username: string
  ) => {
    setSession({ sessionId, userId, username });
  };

  const handleLeaveSession = () => {
    setSession(null);
  };

  return (
    <ThemeProvider
      defaultVariant="default"
      defaultMode="auto"
      enableAutoTheme={true}
      enableAccessibility={true}
    >
      <ErrorBoundary>
        {/* Header with Theme Controls */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-md border-b border-white/10">
          <div className="flex justify-between items-center max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-white">Broadcast App</h1>
              {session && (
                <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg border border-white/20">
                  <span className="text-sm text-white/70">Session:</span>
                  <code className="text-sm text-white font-mono">
                    {session.sessionId}
                  </code>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              {session && (
                <button
                  onClick={handleLeaveSession}
                  className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 rounded-lg border border-red-400/30 transition-all duration-200 text-sm"
                >
                  Leave Session
                </button>
              )}
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="pt-16 min-h-screen">
          {session ? (
            <Dashboard
              sessionId={session.sessionId}
              userId={session.userId}
              username={session.username}
            />
          ) : (
            <div>
              <SessionSetup onJoinSession={handleJoinSession} />

              {/* Control Buttons */}
              <div className="fixed bottom-4 left-4 z-50">
                <button
                  onClick={() => setShowDemo(!showDemo)}
                  className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                >
                  {showDemo ? "Hide" : "Show"} Theme Demo
                </button>
              </div>

              {/* Theme Demo */}
              {showDemo && (
                <div className="fixed inset-4 z-40 overflow-auto">
                  <div className="max-w-6xl mx-auto">
                    <ThemeDemo />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
