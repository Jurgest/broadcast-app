import React, { useState } from "react";
import { Users, User, Hash, LogIn, Sparkles, Shuffle, Zap } from "lucide-react";
import { generateRandomUsername, generateUserId } from "../utils/helpers";

interface SessionSetupProps {
  onJoinSession: (sessionId: string, userId: string, username: string) => void;
}

export const SessionSetup: React.FC<SessionSetupProps> = ({
  onJoinSession,
}) => {
  const [sessionId, setSessionId] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionId.trim() || !username.trim()) return;

    setIsLoading(true);
    try {
      const userId = generateUserId();
      await onJoinSession(sessionId.trim(), userId, username.trim());
    } catch (error) {
      console.error("Failed to join session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateRandomSession = () => {
    const adjectives = [
      "amazing",
      "awesome",
      "cool",
      "fantastic",
      "great",
      "wonderful",
      "epic",
      "stellar",
      "brilliant",
      "magical",
    ];
    const nouns = [
      "meeting",
      "session",
      "chat",
      "room",
      "space",
      "hub",
      "zone",
      "world",
      "realm",
      "dimension",
    ];
    const randomNum = Math.floor(Math.random() * 9999);

    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];

    setSessionId(`${adjective}-${noun}-${randomNum}`);
  };

  const generateRandomUser = () => {
    setUsername(generateRandomUsername());
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating animation elements only - no background */}
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

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        <div className="glass-card p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 animate-bounce-in">
              <Users size={32} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 text-shadow">
              Join Collaboration
            </h1>
            <p className="text-white/80 text-lg">
              Connect with others in real-time
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Session ID */}
            <div className="space-y-4">
              <label
                htmlFor="sessionId"
                className="block text-sm font-semibold text-white/90"
              >
                Session ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Hash size={18} className="text-white/50" />
                </div>
                <input
                  type="text"
                  id="sessionId"
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  placeholder="Enter session ID or generate one"
                  className="input-field pl-12 pr-20"
                  required
                />
                <button
                  type="button"
                  onClick={generateRandomSession}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-300 hover:text-blue-200 text-sm font-semibold transition-colors duration-200"
                >
                  <Sparkles size={16} className="mr-1" />
                  Generate
                </button>
              </div>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-white/90"
              >
                Username
              </label>
              <div className="relative flex flex-col gap-2">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={18} className="text-white/50" />
                </div>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your display name"
                  className="input-field pl-12 pr-20"
                  required
                  maxLength={30}
                />
                <button
                  type="button"
                  onClick={generateRandomUser}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-purple-300 hover:text-purple-200 text-sm font-semibold transition-colors duration-200"
                >
                  <Shuffle size={16} className="mr-1" />
                  Random
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!sessionId.trim() || !username.trim() || isLoading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 py-4 text-lg font-semibold shadow-glow"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Joining Session...</span>
                </>
              ) : (
                <>
                  <LogIn size={22} />
                  <span>Join Collaboration</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Actions */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <p className="text-sm text-white/70 mb-4 text-center font-medium">
              Quick start options:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  generateRandomSession();
                  generateRandomUser();
                }}
                className="btn-secondary flex items-center justify-center gap-2 py-3 text-sm font-medium"
              >
                <Zap size={16} />
                Quick Start
              </button>
              <button
                type="button"
                onClick={() => {
                  setSessionId("demo-room-2024");
                  if (!username) generateRandomUser();
                }}
                className="btn-secondary flex items-center justify-center gap-2 py-3 text-sm font-medium"
              >
                <Hash size={16} />
                Demo Room
              </button>
            </div>
          </div>

          {/* Features Preview */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4 text-center">
              What you can do:
            </h3>
            <div className="grid grid-cols-1 gap-3 text-sm text-white/80">
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="w-8 h-8 bg-blue-500/30 rounded-lg flex items-center justify-center">
                  <Users size={16} className="text-blue-300" />
                </div>
                <span>Real-time collaboration with multiple users</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="w-8 h-8 bg-green-500/30 rounded-lg flex items-center justify-center">
                  <Hash size={16} className="text-green-300" />
                </div>
                <span>Synchronized counter across all tabs</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="w-8 h-8 bg-purple-500/30 rounded-lg flex items-center justify-center">
                  <LogIn size={16} className="text-purple-300" />
                </div>
                <span>Live chat with message expiration</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
