import initApp from "./app.js";

async function startServer() {
  const Application = await initApp;
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;

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
