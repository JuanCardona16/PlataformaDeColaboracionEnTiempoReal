import { useEffect, useState } from "react";
import { getSocket, initSocket } from "../config/SocketClient.ts";

export function usePrivateChat(token?: string) {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    initSocket(token);
    const sock = getSocket();

    sock.on("private_message", (msg: any) =>
      setMessages((prev) => [...prev, msg])
    );
    return () => {
      sock.off("private_message");
    };
  }, [token]);

  const send = (to: string, content: string) =>
    new Promise((resolve) =>
      getSocket().emit("private_send", { to, content }, (resp: any) => resolve(resp))
    );

  return { messages, send };
}
