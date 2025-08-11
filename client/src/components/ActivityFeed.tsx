import React, { useMemo } from 'react';
import { Clock, MessageSquare, PlusCircle, MinusCircle, Users } from 'lucide-react';
import type { User as UserType, Message, CounterUpdate } from '../types';

interface ActivityItem {
  id: string;
  type: 'user_joined' | 'user_left' | 'message_sent' | 'counter_updated';
  timestamp: number;
  user: UserType;
  data?: {
    message?: string;
    action?: 'increment' | 'decrement';
    value?: number;
  };
}

interface ActivityFeedProps {
  users: UserType[];
  messages: Message[];
  lastCounterUpdate: CounterUpdate | null;
  currentUserId: string;
  className?: string;
  maxItems?: number;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  users,
  messages,
  lastCounterUpdate,
  currentUserId,
  className = '',
  maxItems = 20,
}) => {
  const activities = useMemo(() => {
    const items: ActivityItem[] = [];

    // Add user join activities (based on join time)
    users.forEach(user => {
      items.push({
        id: `user_joined_${user.id}`,
        type: 'user_joined',
        timestamp: user.joinedAt,
        user,
      });
    });

    // Add message activities
    messages.forEach(message => {
      items.push({
        id: `message_${message.id}`,
        type: 'message_sent',
        timestamp: message.timestamp,
        user: message.user,
        data: {
          message: message.content,
        },
      });
    });

    // Add counter update activity
    if (lastCounterUpdate) {
      items.push({
        id: `counter_${lastCounterUpdate.timestamp}`,
        type: 'counter_updated',
        timestamp: lastCounterUpdate.timestamp,
        user: lastCounterUpdate.user,
        data: {
          action: lastCounterUpdate.action,
        },
      });
    }

    // Sort by timestamp (most recent first) and limit
    return items
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, maxItems);
  }, [users, messages, lastCounterUpdate, maxItems]);

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return date.toLocaleDateString();
  };

  const truncateMessage = (message: string, maxLength: number = 50) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'user_joined':
        return <Users className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'user_left':
        return <Users className="w-4 h-4 text-red-600 dark:text-red-400" />;
      case 'message_sent':
        return <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'counter_updated':
        return <PlusCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getActivityDescription = (activity: ActivityItem) => {
    const isCurrentUser = activity.user.id === currentUserId;
    const userName = isCurrentUser ? 'You' : activity.user.name;

    switch (activity.type) {
      case 'user_joined':
        return (
          <span>
            <span className="font-medium">{userName}</span> joined the session
          </span>
        );
      case 'user_left':
        return (
          <span>
            <span className="font-medium">{userName}</span> left the session
          </span>
        );
      case 'message_sent':
        return (
          <span>
            <span className="font-medium">{userName}</span> sent a message: "
            <span className="italic">{truncateMessage(activity.data?.message || '')}</span>"
          </span>
        );
      case 'counter_updated':
        return (
          <span>
            <span className="font-medium">{userName}</span>{' '}
            {activity.data?.action === 'increment' ? 'incremented' : 'decremented'} the counter
          </span>
        );
      default:
        return <span>Unknown activity</span>;
    }
  };

  const getActionIcon = (activity: ActivityItem) => {
    if (activity.type === 'counter_updated') {
      return activity.data?.action === 'increment' ? (
        <PlusCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
      ) : (
        <MinusCircle className="w-3 h-3 text-red-600 dark:text-red-400" />
      );
    }
    return null;
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Activity Feed
          </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {activities.length} {activities.length === 1 ? 'activity' : 'activities'}
          </div>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {activities.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No activity yet</p>
            <p className="text-xs mt-1">Activities will appear here as users interact</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm">
                  {getActivityIcon(activity.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {getActivityDescription(activity)}
                    {getActionIcon(activity) && (
                      <span className="ml-1 inline-flex items-center">
                        {getActionIcon(activity)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTimestamp(activity.timestamp)}
                    </span>
                    {activity.user.id === currentUserId && (
                      <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded">
                        you
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {activities.length >= maxItems && (
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Showing {maxItems} most recent activities
          </p>
        </div>
      )}
    </div>
  );
};
