import { useEffect, useState } from "react";
import { initSocket } from "../config/SocketClient.ts";

export function useSocket(token?: string) {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const sock = initSocket(token);
    sock.on("connect", () => setConnected(true));
    sock.on("disconnect", () => setConnected(false));
    return () => {
      sock.off("connect");
      sock.off("disconnect");
    };
  }, [token]);

  return { connected };
}
