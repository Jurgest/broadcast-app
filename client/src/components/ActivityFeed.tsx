import React from "react";
import {
  Activity,
  UserPlus,
  UserMinus,
  MessageSquare,
  Calculator,
  Keyboard,
  Clock,
  Zap,
  TrendingUp,
} from "lucide-react";
import type { ActivityLog } from "../types";
import { formatTimestamp } from "../utils/helpers";

interface ActivityFeedProps {
  activities: ActivityLog[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  const getActivityIcon = (type: ActivityLog["type"]) => {
    switch (type) {
      case "join":
        return <UserPlus size={14} className="text-green-400" />;
      case "leave":
        return <UserMinus size={14} className="text-red-400" />;
      case "message":
        return <MessageSquare size={14} className="text-blue-400" />;
      case "counter":
        return <Calculator size={14} className="text-purple-400" />;
      case "typing":
        return <Keyboard size={14} className="text-yellow-400" />;
      default:
        return <Activity size={14} className="text-gray-400" />;
    }
  };

  const getActivityColor = (type: ActivityLog["type"]) => {
    switch (type) {
      case "join":
        return "bg-green-500/20 border-green-400/30";
      case "leave":
        return "bg-red-500/20 border-red-400/30";
      case "message":
        return "bg-blue-500/20 border-blue-400/30";
      case "counter":
        return "bg-purple-500/20 border-purple-400/30";
      case "typing":
        return "bg-yellow-500/20 border-yellow-400/30";
      default:
        return "bg-gray-500/20 border-gray-400/30";
    }
  };

  const recentActivities = activities.slice(0, 10); // Show only last 10 activities

  return (
    <div className="relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-pink-400 rounded-lg flex items-center justify-center shadow-lg">
            <TrendingUp size={18} className="text-white" />
          </div>
          <div>
            <span className="text-white font-semibold">Activity Feed</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-orange-500/30 text-orange-200 text-xs px-2 py-1 rounded-full border border-orange-400/30">
                {activities.length} events
              </span>
            </div>
          </div>
        </div>

        <div className="p-2 bg-white/10 rounded-lg border border-white/20">
          <Zap size={16} className="text-white animate-pulse" />
        </div>
      </div>

      {/* Activity List */}
      <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-hide">
        {activities.length === 0 ? (
          <div className="text-center text-white/60 py-8 animate-fade-in">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity size={32} className="opacity-50" />
            </div>
            <p className="font-medium">No activity yet</p>
            <p className="text-sm text-white/40 mt-1">
              Actions will appear here in real-time
            </p>
          </div>
        ) : (
          recentActivities.map((activity, index) => (
            <div
              key={activity.id}
              className={`activity-item rounded-xl border transition-all duration-200 hover:shadow-lg animate-fade-in ${getActivityColor(
                activity.type
              )}`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div
                className={`activity-icon ${getActivityColor(
                  activity.type
                )} rounded-full flex items-center justify-center`}
              >
                {getActivityIcon(activity.type)}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium leading-relaxed">
                  {activity.description}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock size={10} className="text-white/50" />
                  <p className="text-xs text-white/70">
                    {formatTimestamp(activity.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {activities.length > 10 && (
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="text-center">
            <p className="text-xs text-white/60">
              Showing latest {Math.min(activities.length, 10)} of{" "}
              {activities.length} activities
            </p>
            <div className="w-full bg-white/10 rounded-full h-1 mt-2">
              <div
                className="bg-orange-400 h-1 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min((10 / activities.length) * 100, 100)}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
