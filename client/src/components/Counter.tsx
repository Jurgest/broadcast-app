import React from "react";
import { Plus, Minus, RotateCcw, TrendingUp, Users, Clock } from "lucide-react";
import type { Counter as CounterType } from "../types";
import { formatTimestamp } from "../utils/helpers";

interface CounterProps {
  counter: CounterType;
  onIncrement: () => void;
  onDecrement: () => void;
  onReset: () => void;
}

export const Counter: React.FC<CounterProps> = ({
  counter,
  onIncrement,
  onDecrement,
  onReset,
}) => {
  return (
    <div className="relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full -translate-y-16 translate-x-16 animate-float"></div>

      <div className="relative p-6 text-center">
        {/* Counter Display */}
        <div className="mb-6">
          <div className="counter-display mb-4 animate-bounce-in">
            {counter.value}
          </div>

          <div className="space-y-2">
            {counter.lastUser && (
              <div className="flex items-center justify-center gap-2 text-sm text-white/80">
                <Users size={14} />
                <span>
                  Last updated by{" "}
                  <span className="font-semibold text-white">
                    {counter.lastUser}
                  </span>
                </span>
              </div>
            )}
            <div className="flex items-center justify-center gap-2 text-xs text-white/70">
              <Clock size={12} />
              <span>{formatTimestamp(counter.timestamp)}</span>
            </div>
          </div>
        </div>

        {/* Counter Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={onDecrement}
            className="counter-button bg-red-500 hover:bg-red-600 text-white"
            title="Decrement counter"
          >
            <Minus size={24} />
          </button>

          <button
            onClick={onReset}
            className="counter-button bg-gray-500 hover:bg-gray-600 text-white"
            title="Reset counter"
          >
            <RotateCcw size={20} />
          </button>

          <button
            onClick={onIncrement}
            className="counter-button bg-green-500 hover:bg-green-600 text-white"
            title="Increment counter"
          >
            <Plus size={24} />
          </button>
        </div>

        {/* Stats Section */}
        <div className="mt-6 pt-4 border-t border-white/20">
          <div className="flex items-center justify-center gap-2 text-sm text-white/80">
            <TrendingUp size={16} />
            <span>Synchronized across all tabs</span>
          </div>
        </div>
      </div>
    </div>
  );
};
