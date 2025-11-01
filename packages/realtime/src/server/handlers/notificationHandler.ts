import { Server, Socket } from "socket.io";

export function registerNotificationHandlers(io: Server, socket: Socket) {
  socket.on("send_notification", ({ targetUserId, notification }, ack) => {
    // Aquí puedes añadir lógica para guardar la notificación en una base de datos
    // o realizar alguna validación antes de enviarla.

    // Emitir la notificación solo al usuario objetivo
    io.to(targetUserId).emit("new_notification", { from: socket.handshake.auth.userId, notification });
    ack?.({ ok: true });
  });
}