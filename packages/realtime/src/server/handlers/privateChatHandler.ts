import { Server, Socket } from "socket.io";
import { OnlineUsersManager } from "../managers/OnlineUsersManager.js";

export function registerPrivateChatHandlers(
  io: Server,
  socket: Socket,
  onlineUsers: OnlineUsersManager
) {
  function chatId(a: string, b: string) {
    return a < b ? `${a}:${b}` : `${b}:${a}`;
  }

  socket.on("private_send", async ({ to, content }, ack) => {
    try {
      const from = socket.data.userId;
      if (!from || !to || !content) throw new Error("Invalid data");

      const message = {
        chatId: chatId(from, to),
        from,
        to,
        content,
        createdAt: new Date(),
      };

      const receivers = [
        ...onlineUsers.getSockets(to),
        ...onlineUsers.getSockets(from),
      ];
      receivers.forEach((id) => io.to(id).emit("private_message", message));

      ack?.({ ok: true, message });
    } catch (err: any) {
      ack?.({ ok: false, error: err.message });
    }
  });
}
