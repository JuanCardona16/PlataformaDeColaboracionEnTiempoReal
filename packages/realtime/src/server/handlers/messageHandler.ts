import { Server, Socket } from "socket.io";

export function registerMessageHandlers(io: Server, socket: Socket) {
  socket.on("private_message", ({ targetUserId, message }, ack) => {
    // Aquí puedes añadir lógica para guardar el mensaje en una base de datos
    // o realizar alguna validación antes de enviarlo.

    // Emitir el mensaje privado solo al usuario objetivo
    io.to(targetUserId).emit("private_message", { from: socket.handshake.auth.userId, message });
    ack?.({ ok: true });
  });
}