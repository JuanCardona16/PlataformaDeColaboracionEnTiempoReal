import { Server, Socket } from "socket.io";
import { OnlineUsersManager } from "../managers/OnlineUsersManager.js";

export function registerPresenceHandlers(
  io: Server,
  socket: Socket,
  onlineUsers: OnlineUsersManager
) {
  const userId = socket.data.userId;
  if (userId) {
    onlineUsers.add(userId, socket.id);
    io.emit("user_connected", { userId });
  }

  socket.on("get_online_users", (ack) => {
    ack?.(onlineUsers.listOnlineUsers());
  });

  socket.on("disconnect", () => {
    if (userId) {
      onlineUsers.remove(userId, socket.id);
      io.emit("user_disconnected", { userId });
    }
  });
}
