import { Server, Socket } from "socket.io";

export function registerRoomHandlers(io: Server, socket: Socket) {
  socket.on("join_room_by_code", ({ code }, ack) => {
    if (!code) return ack?.({ ok: false, error: "Invalid code" });
    socket.join(code);
    io.to(code).emit("participants_updated", { participants: [] });
    ack?.({ ok: true, roomId: code });
  });

  socket.on("send_room_message", ({ roomId, message }, ack) => {
    io.to(roomId).emit("new_message", { message });
    ack?.({ ok: true });
  });
}
