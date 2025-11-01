import { Server, Socket } from "socket.io";
import { verifySocketAuth } from "./SocketAuth.js";
import {
  registerPresenceHandlers,
  registerRoomHandlers,
  registerMessageHandlers,
  registerNotificationHandlers,
} from "../handlers/index.js";
import { RedisOnlineUsersManager } from "../managers/RedisOnlineUsersManager.js";
import { createAdapter } from "@socket.io/redis-adapter";
import { RedisManager } from "../managers/RedisManager.js";

export class RealtimeServer {
  private io: Server;
  private onlineUsers!: RedisOnlineUsersManager;
  private readonly secret: string;
  private redis_url: string;

  constructor(
    server: any,
    corsOrigin: string = "*",
    secret: string = "",
    redis_url: string
  ) {
    this.secret = secret;
    this.io = new Server(server, {
      cors: { origin: corsOrigin, methods: ["GET", "POST"] },
    });
    this.redis_url = redis_url;

    this.io.use((socket, next) => verifySocketAuth(socket, next, this.secret));
  }

  public async initializeHandlers() {
    try {
      // Conectamos a Redis
      console.log("🔌 Conectando a Redis...");
      const { pubClient, subClient } = await RedisManager.createRedisClients({
        url: this.redis_url,
      });

      // Health check de Redis
      const redisHealthy = await RedisManager.healthCheck();
      if (!redisHealthy) {
        throw new Error("Redis no está disponible");
      }
      console.log("✅ Redis conectado y funcionando");

      // Adaptador Socket.io a Redis
      this.io.adapter(createAdapter(pubClient, subClient));
      console.log("✅ Adaptador Redis configurado para Socket.io");

      // Manejador conectado a Redis
      this.onlineUsers = new RedisOnlineUsersManager(pubClient as any);

      // 4️⃣ Limpieza de claves viejas (solo entorno desarrollo)
      if (process.env.NODE_ENV !== "production") {
        console.log("🧹 Limpiando datos de Redis (modo desarrollo)...");
        await this.onlineUsers.clearAll();
      }

      // Reistramos Handlers
      this.io.on("connection", (socket: Socket) => {
        const userId = socket.data.userId;
        console.log(`
            ╔═════════════════════════════════════════║
            ║ 🔌 NUEVA CONEXIÓN                       ║
            ║ Socket ID: ${socket.id}                 ║
            ║ User ID: ${userId || "Sin autenticar"}  ║ 
            ║ Transport: ${socket.conn.transport.name}║
            ╚═════════════════════════════════════════║
        `);
        registerPresenceHandlers(this.io, socket, this.onlineUsers);
        registerRoomHandlers(this.io, socket);
        registerMessageHandlers(this.io, socket);
        registerNotificationHandlers(this.io, socket);

        // Log de eventos (útil para debugging)
        if (process.env.NODE_ENV !== "production") {
          socket.onAny((eventName, ...args) => {
            console.log(`📨 Evento: ${eventName} de ${userId || socket.id}`);
          });
        }

        // Evento de error en el socket
        socket.on("error", (error) => {
          console.error(`❌ Error en socket ${socket.id}:`, error);
        });

        console.log(`
╔════════════════════════════════════════
║ ✅ REALTIME SERVER INICIALIZADO
║ 
║ ✓ Redis conectado
║ ✓ Socket.io configurado
║ ✓ Handlers registrados
║ ✓ Sistema de presencia activo
╚════════════════════════════════════════
      `);
      });
    } catch (error) {
      console.error("❌ Error al inicializar RealtimeServer:", error);
      throw error;
    }
  }

  /**
   * Registrar estadísticas del servidor
   */
  private async logStats() {
    try {
      const stats = await this.onlineUsers.getStats();
      const sockets = await this.io.fetchSockets();

      console.log(`
            📊 ════════════════════════════════════════
              ESTADÍSTICAS DEL SERVIDOR
              
              👥 Usuarios online: ${stats.totalOnline}
              🔌 Sockets conectados: ${sockets.length}
              📅 Timestamp: ${new Date(stats.timestamp).toLocaleString()}
              
              Usuarios: ${stats.users.join(", ") || "Ninguno"}
            ════════════════════════════════════════
      `);

      // 8. Log de estadísticas iniciales
      await this.logStats();
    } catch (error) {
      console.error("❌ Error al obtener estadísticas:", error);
    }
  }

  /**
   * Obtener instancia de Socket.io
   */
  public getIO(): Server {
    return this.io;
  }

  /**
   * Obtener manejador de usuarios online
   */
  public getOnlineUsers(): RedisOnlineUsersManager {
    return this.onlineUsers;
  }

  /**
   * Enviar mensaje broadcast a todos los usuarios
   */
  public broadcast(event: string, data: any) {
    this.io.emit(event, data);
    console.log(`📢 Broadcast enviado: ${event}`);
  }

  /**
   * Enviar mensaje a un usuario específico
   */
  public async sendToUser(userId: string, event: string, data: any) {
    try {
      const socketId = await this.onlineUsers.getSocketId(userId);

      if (socketId) {
        this.io.to(socketId).emit(event, data);
        console.log(`📨 Mensaje enviado a usuario ${userId}`);
        return true;
      } else {
        console.warn(`⚠️ Usuario ${userId} no está conectado`);
        return false;
      }
    } catch (error) {
      console.error(`❌ Error al enviar mensaje a usuario ${userId}:`, error);
      return false;
    }
  }

  /**
   * Obtener usuarios en línea (método público para API REST)
   */
  public async getOnlineUsersList() {
    return await this.onlineUsers.getAllUsers();
  }

  /**
   * Verificar si un usuario está online
   */
  public async isUserOnline(userId: string) {
    return await this.onlineUsers.isUserOnline(userId);
  }
}
