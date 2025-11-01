import { Suspense, useEffect } from "react";
import { ApplicationRouter } from "./router/router";
import { QueryClientProvider } from "@tanstack/react-query";
import { QueryClientConfig } from "./config/react_query";
import { RealtimeClient } from "@repo/realtime/client";
import { useGlobalStore } from "./zustand/global_state";

function App() {
  const { auth, setClient, setIsOnline, setOnlineUsers } = useGlobalStore();

  useEffect(() => {
    if (auth.token) {
      // se conecta una sola vez cuando el token está disponible
      const client = new RealtimeClient(auth.token, "http://localhost:3001");
      
      setClient(client);

      client.setPresenceCallbacks({
        onOnlineUsers: (users) => {
          console.log("Usuarios en línea:", users);
          setOnlineUsers(users);
        },
        onUserConnected: (userId) => {
          console.log(`Usuario conectado: ${userId}`);
          setIsOnline(true);
        },
        onUserDisconnected: (userId) => {
          console.log(`Usuario desconectado: ${userId}`);
          setIsOnline(false);
        },
      });
    }
  }, [auth.token]);

  return (
    <Suspense
      fallback={<>Cargando contenido. Por favor espere un momento...</>}>
      <QueryClientProvider client={QueryClientConfig}>
        <ApplicationRouter />
      </QueryClientProvider>
    </Suspense>
  );
}

export default App;
