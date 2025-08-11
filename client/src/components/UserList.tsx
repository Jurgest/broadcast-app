import React from 'react';
import type { User } from '../types';
import { formatRelativeTime } from '../utils/helpers';
import { Users } from 'lucide-react';

interface UserListProps {
  users: User[];
  currentUserId: string;
}

export const UserList: React.FC<UserListProps> = ({ users, currentUserId }) => {
  return (
    <div className="user-list">
      <div className="user-list-header">
        <Users size={16} />
        <span>Users Online ({users.length})</span>
      </div>
      
      {users.length === 0 ? (
        <div className="empty-state">
          <p>No users online</p>
        </div>
      ) : (
        <div className="user-items">
          {users.map((user) => (
            <div 
              key={user.id} 
              className={`user-item ${user.id === currentUserId ? 'current-user' : ''}`}
            >
              <div 
                className="user-avatar" 
                style={{ backgroundColor: user.color }}
              >
                {user.name[0]?.toUpperCase()}
              </div>
              <div className="user-info">
                <span className="user-name">
                  {user.name}
                  {user.id === currentUserId && ' (you)'}
                </span>
                <span className="user-activity">
                  Last active: {formatRelativeTime(user.lastActivity)}
                </span>
              </div>
              <div className="user-status online"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
