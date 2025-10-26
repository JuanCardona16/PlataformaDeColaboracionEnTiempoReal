import { useEffect, useState } from "react";
import { getSocket, initSocket } from "../config/SocketClient.ts";

export function usePresence(token?: string) {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    const sock = initSocket(token);

    const handleUserConnected = ({ userId }: { userId: string }) =>
      setOnlineUsers((prev) =>
        prev.includes(userId) ? prev : [...prev, userId]
      );

    const handleUserDisconnected = ({ userId }: { userId: string }) =>
      setOnlineUsers((prev) => prev.filter((u) => u !== userId));

    sock.on("user_connected", handleUserConnected);
    sock.on("user_disconnected", handleUserDisconnected);

    sock.emit("get_online_users", (list: string[]) => setOnlineUsers(list));

    return () => {
      sock.off("user_connected", handleUserConnected);
      sock.off("user_disconnected", handleUserDisconnected);
    };
  }, [token]);

  return { onlineUsers };
}
