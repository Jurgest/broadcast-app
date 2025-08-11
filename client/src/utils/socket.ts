import { io, Socket } from "socket.io-client";

class SocketManager {
  private socket: Socket | null = null;
  private serverUrl: string;

  constructor() {
    this.serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:3001";
  }

  connect(): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(this.serverUrl, {
      transports: ["websocket", "polling"],
      timeout: 20000,
      forceNew: false,
    });

    this.socket.on("connect", () => {
      console.log("Connected to server:", this.socket?.id);
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Disconnected from server:", reason);
    });

    this.socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  emit(event: string, data?: unknown): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn("Socket not connected, cannot emit event:", event);
    }
  }

  on(event: string, callback: (...args: unknown[]) => void): void {
    this.socket?.on(event, callback);
  }

  off(event: string, callback?: (...args: unknown[]) => void): void {
    this.socket?.off(event, callback);
  }
}

// Singleton instance
export const socketManager = new SocketManager();
