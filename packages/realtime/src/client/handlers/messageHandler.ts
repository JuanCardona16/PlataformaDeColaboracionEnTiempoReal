import { Socket } from "socket.io-client";

export function registerMessageHandlers(socket: Socket) {
  const sendPrivateMessage = (
    targetUserId: string,
    message: string
  ): Promise<{ ok: boolean; error?: string }> => {
    return new Promise((resolve, reject) => {
      socket.emit(
        "private_message",
        { targetUserId, message },
        (response: { ok: boolean; error?: string }) => {
          if (response.ok) {
            resolve(response);
          } else {
            reject(new Error(response.error || "Error al enviar mensaje privado"));
          }
        }
      );
    });
  };

  return { sendPrivateMessage };
}