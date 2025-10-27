import { RealtimeServer } from "@repo/realtime/server";
import initApp from "./app.js";
import { CLIENT_URL, TOKEN_SECRET } from "@/constants/env/index.js";

async function startServer() {
  const Application = await initApp;
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;

  const realtime = new RealtimeServer(Application, CLIENT_URL!, TOKEN_SECRET!);
  realtime.initializeHandlers();

  console.log("Usuarios en linea: ", realtime.getOnlineUsers());

  try {
    Application.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
      console.log(`📡 Socket.IO server ready for connections`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

startServer();
