import React, { useCallback } from 'react';
import { Plus, Minus, User, Clock } from 'lucide-react';
import type { User as UserType, CounterUpdate } from '../types';

interface CounterProps {
  user: UserType;
  counter: number;
  lastCounterUpdate: CounterUpdate | null;
  onIncrement: (updateInfo: CounterUpdate) => void;
  onDecrement: (updateInfo: CounterUpdate) => void;
  className?: string;
}

export const Counter: React.FC<CounterProps> = ({
  user,
  counter,
  lastCounterUpdate,
  onIncrement,
  onDecrement,
  className = '',
}) => {
  const handleIncrement = useCallback(() => {
    const updateInfo: CounterUpdate = {
      user,
      action: 'increment',
      timestamp: Date.now(),
    };
    onIncrement(updateInfo);
  }, [user, onIncrement]);

  const handleDecrement = useCallback(() => {
    const updateInfo: CounterUpdate = {
      user,
      action: 'decrement',
      timestamp: Date.now(),
    };
    onDecrement(updateInfo);
  }, [user, onDecrement]);

  const formatTimestamp = useCallback((timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return date.toLocaleDateString();
  }, []);

  const getCounterColor = useCallback((value: number) => {
    if (value > 0) return 'text-green-600 dark:text-green-400';
    if (value < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  }, []);

  const getActionColor = useCallback((action: 'increment' | 'decrement') => {
    return action === 'increment' 
      ? 'text-green-600 dark:text-green-400' 
      : 'text-red-600 dark:text-red-400';
  }, []);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Shared Counter
        </h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Synchronized across all tabs
        </div>
      </div>

      {/* Counter Display */}
      <div className="text-center mb-8">
        <div className={`text-6xl font-bold mb-2 ${getCounterColor(counter)}`}>
          {counter >= 0 ? '+' : ''}{counter}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Current value
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <button
          onClick={handleDecrement}
          className="flex items-center justify-center w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          title="Decrement counter"
        >
          <Minus className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center gap-1 min-w-0">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Your action
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            will be visible to all
          </div>
        </div>

        <button
          onClick={handleIncrement}
          className="flex items-center justify-center w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          title="Increment counter"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Last Action Info */}
      {lastCounterUpdate && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <User className="w-4 h-4" />
              <span>Last action by:</span>
            </div>
            <div className="text-gray-900 dark:text-white font-medium">
              {lastCounterUpdate.user.id === user.id ? 'You' : lastCounterUpdate.user.name}
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm mt-2">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <div className="w-4 h-4 flex items-center justify-center">
                {lastCounterUpdate.action === 'increment' ? (
                  <Plus className="w-3 h-3" />
                ) : (
                  <Minus className="w-3 h-3" />
                )}
              </div>
              <span>Action:</span>
            </div>
            <div className={`font-medium capitalize ${getActionColor(lastCounterUpdate.action)}`}>
              {lastCounterUpdate.action}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm mt-2">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>When:</span>
            </div>
            <div className="text-gray-900 dark:text-white">
              {formatTimestamp(lastCounterUpdate.timestamp)}
            </div>
          </div>
        </div>
      )}

      {/* Usage Instructions */}
      <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="text-sm text-blue-800 dark:text-blue-200">
          <div className="font-medium mb-1">Real-time synchronization:</div>
          <ul className="text-xs space-y-1 text-blue-700 dark:text-blue-300">
            <li>• Changes are instantly shared with all connected users</li>
            <li>• Works across multiple browser tabs and windows</li>
            <li>• Last action information is preserved for all users</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
