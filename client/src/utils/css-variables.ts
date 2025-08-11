import { useCallback, useEffect, useRef } from 'react';

interface BroadcastSyncOptions {
  channel: string;
  enabled?: boolean;
}

type BroadcastCallback<T = unknown> = (data: T) => void;

export const useBroadcastSync = <T = unknown>({ channel, enabled = true }: BroadcastSyncOptions) => {
  const channelRef = useRef<BroadcastChannel | null>(null);
  const callbacksRef = useRef<Set<BroadcastCallback<T>>>(new Set());

  useEffect(() => {
    if (!enabled || typeof BroadcastChannel === 'undefined') {
      return;
    }

    channelRef.current = new BroadcastChannel(channel);

    const handleMessage = (event: MessageEvent<T>) => {
      callbacksRef.current.forEach(callback => {
        try {
          callback(event.data);
        } catch (error) {
          console.error('Error in broadcast callback:', error);
        }
      });
    };

    channelRef.current.addEventListener('message', handleMessage);

    return () => {
      if (channelRef.current) {
        channelRef.current.removeEventListener('message', handleMessage);
        channelRef.current.close();
        channelRef.current = null;
      }
    };
  }, [channel, enabled]);

  const broadcast = useCallback((data: T) => {
    if (channelRef.current && enabled) {
      try {
        channelRef.current.postMessage(data);
      } catch (error) {
        console.error('Error broadcasting message:', error);
      }
    }
  }, [enabled]);

  const subscribe = useCallback((callback: BroadcastCallback<T>) => {
    callbacksRef.current.add(callback);

    return () => {
      callbacksRef.current.delete(callback);
    };
  }, []);

  return {
    broadcast,
    subscribe,
  };
};
