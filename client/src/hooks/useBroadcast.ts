import { useEffect, useCallback, useRef } from "react";
import type { BroadcastData } from "../types";

export const useBroadcast = (channelName: string) => {
  const channelRef = useRef<BroadcastChannel | null>(null);
  const listenersRef = useRef<Set<(data: BroadcastData) => void>>(new Set());

  useEffect(() => {
    // Create broadcast channel
    channelRef.current = new BroadcastChannel(channelName);
    const currentListeners = listenersRef.current;

    // Handle incoming messages
    const handleMessage = (event: MessageEvent<BroadcastData>) => {
      currentListeners.forEach((listener) => {
        try {
          listener(event.data);
        } catch (error) {
          console.error("Error in broadcast listener:", error);
        }
      });
    };

    channelRef.current.addEventListener("message", handleMessage);

    return () => {
      if (channelRef.current) {
        channelRef.current.removeEventListener("message", handleMessage);
        channelRef.current.close();
        channelRef.current = null;
      }
      currentListeners.clear();
    };
  }, [channelName]);

  const broadcast = useCallback((data: BroadcastData) => {
    if (channelRef.current) {
      try {
        channelRef.current.postMessage(data);
      } catch (error) {
        console.error("Error broadcasting message:", error);
      }
    }
  }, []);

  const subscribe = useCallback((listener: (data: BroadcastData) => void) => {
    listenersRef.current.add(listener);

    return () => {
      listenersRef.current.delete(listener);
    };
  }, []);

  return { broadcast, subscribe };
};
