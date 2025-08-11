import React from 'react';
import { Wifi, WifiOff, AlertCircle, CheckCircle } from 'lucide-react';

interface ConnectionStatusProps {
  isConnected: boolean;
  isConnecting?: boolean;
  error?: string | null;
  className?: string;
  showText?: boolean;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isConnected,
  isConnecting = false,
  error = null,
  className = '',
  showText = true,
}) => {
  const getStatus = () => {
    if (error) {
      return {
        icon: <AlertCircle className="w-4 h-4" />,
        text: 'Connection Error',
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-100 dark:bg-red-900/20',
        dotColor: 'bg-red-500',
      };
    }
    
    if (isConnecting) {
      return {
        icon: <Wifi className="w-4 h-4 animate-pulse" />,
        text: 'Connecting...',
        color: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
        dotColor: 'bg-yellow-500 animate-pulse',
      };
    }
    
    if (isConnected) {
      return {
        icon: <CheckCircle className="w-4 h-4" />,
        text: 'Connected',
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-100 dark:bg-green-900/20',
        dotColor: 'bg-green-500',
      };
    }
    
    return {
      icon: <WifiOff className="w-4 h-4" />,
      text: 'Disconnected',
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900/20',
      dotColor: 'bg-red-500',
    };
  };

  const status = getStatus();

  if (!showText) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className={`w-2 h-2 rounded-full ${status.dotColor}`} />
        <span className={`text-sm ${status.color}`}>
          {status.text}
        </span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${status.bgColor} ${className}`}>
      {status.icon}
      <span className={`text-sm font-medium ${status.color}`}>
        {status.text}
      </span>
      {error && (
        <div className="ml-2 group relative">
          <AlertCircle className="w-3 h-3 text-red-500 cursor-help" />
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {error}
          </div>
        </div>
      )}
    </div>
  );
};
