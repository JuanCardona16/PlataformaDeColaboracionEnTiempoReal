import { Socket } from "socket.io-client";

export function registerNotificationHandlers(socket: Socket) {
  const sendNotification = (
    targetUserId: string,
    notification: any
  ): Promise<{ ok: boolean; error?: string }> => {
    return new Promise((resolve, reject) => {
      socket.emit(
        "send_notification",
        { targetUserId, notification },
        (response: { ok: boolean; error?: string }) => {
          if (response.ok) {
            resolve(response);
          } else {
            reject(new Error(response.error || "Error al enviar notificación"));
          }
        }
      );
    });
  };

  return { sendNotification };
}