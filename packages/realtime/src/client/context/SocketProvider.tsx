// @ts-ignore
import React, { createContext, useContext, useEffect, useState } from "react";
import { initSocket } from "../config/SocketClient.ts";

const SocketContext = createContext<any>(null);

export const SocketProvider = ({ token, children }: { token?: string; children: React.ReactNode }) => {
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    const sock = initSocket(token);
    setSocket(sock);
  }, [token]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocketContext = () => useContext(SocketContext);
