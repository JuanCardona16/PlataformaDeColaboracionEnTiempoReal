import { useEffect } from "react";
import { getSocket, initSocket } from "../config/SocketClient.ts";

export function useRoomSocket(token?: string) {
  useEffect(() => {
    initSocket(token);
    const sock = getSocket();

    sock.on("new_message", (msg: any) => console.log("🟦 Room message:", msg));

    return () => {
      sock.off("new_message");
    };
  }, [token]);

  const joinByCode = (code: string) =>
    new Promise((resolve) =>
      getSocket().emit("join_room_by_code", { code }, (resp: any) =>
        resolve(resp)
      )
    );

  const sendRoomMessage = (roomId: string, message: any) =>
    new Promise((resolve) =>
      getSocket().emit("send_room_message", { roomId, message }, (resp: any) =>
        resolve(resp)
      )
    );

  return { joinByCode, sendRoomMessage };
}
