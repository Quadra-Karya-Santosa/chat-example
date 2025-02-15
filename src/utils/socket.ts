import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

export function setupSocket(token: string) {
  if (!socket) {
    socket = io("wss://open-api.quadrakaryasantosa.com", {
      auth: {
        Authorization: `Bearer ${token}`,
      },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.info("Socket.IO connection established");
    });

    socket.on("error", (error) => {
      console.error("Socket.IO error:", error);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error);
    });

    socket.on("disconnect", (reason) => {
      console.info("Socket.IO disconnected:", reason);
    });
  }

  return socket;
}

export function getSocket() {
  return socket;
}

export function closeSocket() {
  if (socket?.connected) {
    socket.close();
    socket = null;
  }
}

