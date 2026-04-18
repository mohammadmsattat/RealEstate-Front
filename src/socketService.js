import { io } from "socket.io-client";
import { baseURL } from "./Api/globalData";

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(baseURL);

      this.socket.on("connect", () => {
        console.log("🟢 Connected to server:", this.socket.id);
      });
    }
  }

  onInit(callback) {
    this.socket?.on("init", callback);
  }

  onStateUpdated(callback) {
    this.socket?.on("state-updated", callback);
  }

  emitUpdateState(data) {
    this.socket?.emit("update-state", data);
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export const socketService = new SocketService();
