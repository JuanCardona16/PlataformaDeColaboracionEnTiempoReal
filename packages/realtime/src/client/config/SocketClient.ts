import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function initSocket(token?: string, serverUrl?: string): Socket {
  if (socket?.connected) return socket;
  socket = io(serverUrl || import.meta.env.VITE_SOCKET_URL || "/", {
    auth: { token },
    transports: ["websocket"],
  });

  socket.on("connect", () => console.log("🔌 Connected:", socket?.id));
  socket.on("disconnect", () => console.log("❌ Disconnected"));

  return socket;
}

export function getSocket(): Socket {
  if (!socket) throw new Error("Socket not initialized");
  return socket;
}
