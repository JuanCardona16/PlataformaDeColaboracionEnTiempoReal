import { io, Socket } from "socket.io-client";
import { registerNotificationHandlers } from "../handlers/notificationHandler.js";
import { registerMessageHandlers } from "../handlers/messageHandler.js";

export class RealtimeClient {
  private socket: Socket;
  private readonly token: string;
  private readonly url: string;
  private connected: boolean = false;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  public messages: ReturnType<typeof registerMessageHandlers>;
  public notifications: ReturnType<typeof registerNotificationHandlers>;

  // Callbacks opcionales para manejar eventos
  private onlineUsersCallback?: (users: string[]) => void;
  private userConnectedCallback?: (data: {
    userId: string;
    timestamp: string;
  }) => void;
  private userDisconnectedCallback?: (data: {
    userId: string;
    timestamp: string;
  }) => void;

  constructor(token: string, url: string) {
    this.token = token;
    this.url = url;
    this.socket = io(this.url, {
      auth: { token: this.token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });
    
    this.registerBaseEvents();
    this.registerPresenceEvents();

    this.messages = registerMessageHandlers(this.socket);
    this.notifications = registerNotificationHandlers(this.socket);
  }

  /**
   * Eventos base del cliente
   */
  private registerBaseEvents() {
    this.socket.on("connect", () => {
      this.connected = true;
      console.log(`✅ Socket conectado (${this.socket.id})`);

      // Iniciar heartbeat cuando se conecta
      this.startHeartbeat();

      // Solicitar lista de usuarios online inmediatamente
      this.getOnlineUsers();
    });

    this.socket.on("disconnect", (reason) => {
      this.connected = false;
      console.warn("⚠️ Desconectado:", reason);

      // Detener heartbeat cuando se desconecta
      this.stopHeartbeat();
    });

    this.socket.on("connect_error", (err) => {
      console.error("❌ Error de conexión:", err.message);
    });

    this.socket.on("reconnect", (attemptNumber) => {
      console.log(`🔄 Reconectado después de ${attemptNumber} intentos`);
      this.getOnlineUsers();
    });
  }

  /**
   * Eventos de presencia (usuarios online/offline)
   */
  private registerPresenceEvents() {
    // Lista completa de usuarios online
    this.socket.on("online_users", (users: string[]) => {
      console.log(`👥 Usuarios online actualizados (${users.length}):`, users);
      this.onlineUsersCallback?.(users);
    });

    // Un usuario se conectó
    this.socket.on(
      "user_connected",
      (data: { userId: string; timestamp: string }) => {
        console.log(`✅ Usuario conectado: ${data.userId}`);
        this.userConnectedCallback?.(data);
      }
    );

    // Un usuario se desconectó
    this.socket.on(
      "user_disconnected",
      (data: { userId: string; timestamp: string }) => {
        console.log(`❌ Usuario desconectado: ${data.userId}`);
        this.userDisconnectedCallback?.(data);
      }
    );
  }

  /**
   * Configurar callbacks para eventos de presencia
   */
  public setPresenceCallbacks(callbacks: {
    onOnlineUsers?: (users: string[]) => void;
    onUserConnected?: (data: { userId: string; timestamp: string }) => void;
    onUserDisconnected?: (data: { userId: string; timestamp: string }) => void;
  }) {
    this.onlineUsersCallback = callbacks.onOnlineUsers;
    this.userConnectedCallback = callbacks.onUserConnected;
    this.userDisconnectedCallback = callbacks.onUserDisconnected;
  }

  /**
   * Solicitar lista de usuarios online
   */
  public getOnlineUsers(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      if (!this.connected) {
        reject(new Error("Socket no conectado"));
        return;
      }

      this.socket.emit("get_online_users", (response: any) => {
        if (response?.ok) {
          console.log(`📋 Usuarios online obtenidos: ${response.count}`);
          resolve(response.users);
        } else {
          console.error(
            "❌ Error al obtener usuarios online:",
            response?.error
          );
          reject(new Error(response?.error || "Error desconocido"));
        }
      });
    });
  }

  /**
   * Verificar si un usuario específico está online
   */
  public checkUserOnline(userId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.connected) {
        reject(new Error("Socket no conectado"));
        return;
      }

      this.socket.emit(
        "check_user_online",
        { targetUserId: userId },
        (response: any) => {
          if (response?.ok) {
            resolve(response.isOnline);
          } else {
            reject(new Error(response?.error || "Error desconocido"));
          }
        }
      );
    });
  }

  /**
   * Obtener estadísticas de presencia
   */
  public getPresenceStats(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.connected) {
        reject(new Error("Socket no conectado"));
        return;
      }

      this.socket.emit("get_presence_stats", (response: any) => {
        if (response?.ok) {
          resolve(response.stats);
        } else {
          reject(new Error(response?.error || "Error desconocido"));
        }
      });
    });
  }

  /**
   * Iniciar heartbeat para mantener presencia activa
   */
  private startHeartbeat() {
    // Enviar heartbeat cada 30 segundos
    this.heartbeatInterval = setInterval(() => {
      if (this.connected) {
        this.socket.emit("presence_heartbeat");
      }
    }, 30000);
  }

  /**
   * Detener heartbeat
   */
  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Desconectar el socket
   */
  public disconnect() {
    if (this.connected) {
      this.socket.disconnect();
      this.connected = false;
      this.stopHeartbeat();
      console.log("🔌 Socket desconectado por el cliente.");
    }
  }
}
