import { Server, Socket } from "socket.io";
import { RedisOnlineUsersManager } from "../managers/RedisOnlineUsersManager.js";

export function registerPresenceHandlers(
  io: Server,
  socket: Socket,
  onlineUsers: RedisOnlineUsersManager
) {
  const userId = socket.data.userId;

  // Si no hay userId autenticado, no registrar eventos de presencia
  if (!userId) {
    console.warn(
      `⚠️ Socket ${socket.id} sin userId - No se registra presencia`
    );
    return;
  }

  console.log(
    `✅ [Presence] Usuario ${userId} conectado con socket ${socket.id}`
  );

  // 🟢 CONECTAR: Registrar usuario como online automáticamente
  (async () => {
    try {
      await onlineUsers.addUser(userId, socket.id);

      // Obtener lista actualizada de usuarios online
      const onlineUsersList = await onlineUsers.getAllUsers();
      console.log(
        `👥 Usuarios online (${onlineUsersList.length}):`,
        onlineUsersList
      );

      // Notificar a TODOS los clientes conectados sobre la lista actualizada
      io.emit("online_users", onlineUsersList);

      // Notificar específicamente que este usuario se conectó
      socket.broadcast.emit("user_connected", {
        userId,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error(`❌ Error al registrar presencia de ${userId}:`, error);
    }
  })();

  // 📋 SOLICITAR LISTA: Cliente pide lista de usuarios online
  socket.on("get_online_users", async (callback) => {
    try {
      const onlineUsersList = await onlineUsers.getAllUsers();
      console.log(`📋 [Presence] ${userId} solicitó lista de usuarios online`);

      // Si hay callback (acknowledgment), responder directamente
      if (typeof callback === "function") {
        callback({
          ok: true,
          users: onlineUsersList,
          count: onlineUsersList.length,
        });
      } else {
        // Si no hay callback, emitir evento al socket solicitante
        socket.emit("online_users", onlineUsersList);
      }
    } catch (error) {
      console.error(`❌ Error al obtener usuarios online:`, error);
      if (typeof callback === "function") {
        callback({
          ok: false,
          error: "Error al obtener usuarios online",
        });
      }
    }
  });

  // 📊 OBTENER ESTADÍSTICAS: Información detallada del sistema
  socket.on("get_presence_stats", async (callback) => {
    try {
      const stats = await onlineUsers.getStats();
      console.log(`📊 [Presence] ${userId} solicitó estadísticas`);

      if (typeof callback === "function") {
        callback({
          ok: true,
          stats,
        });
      }
    } catch (error) {
      console.error(`❌ Error al obtener estadísticas:`, error);
      if (typeof callback === "function") {
        callback({
          ok: false,
          error: "Error al obtener estadísticas",
        });
      }
    }
  });

  // 🔍 VERIFICAR USUARIO: Comprobar si un usuario específico está online
  socket.on("check_user_online", async ({ targetUserId }, callback) => {
    try {
      const isOnline = await onlineUsers.isUserOnline(targetUserId);
      console.log(
        `🔍 [Presence] ${userId} verificó si ${targetUserId} está online: ${isOnline}`
      );

      if (typeof callback === "function") {
        callback({
          ok: true,
          userId: targetUserId,
          isOnline,
        });
      }
    } catch (error) {
      console.error(`❌ Error al verificar usuario ${targetUserId}:`, error);
      if (typeof callback === "function") {
        callback({
          ok: false,
          error: "Error al verificar usuario",
        });
      }
    }
  });

  // 💓 HEARTBEAT: Actualizar última actividad del usuario
  socket.on("presence_heartbeat", async () => {
    try {
      await onlineUsers.updateLastSeen(userId);
      // console.log(`💓 [Presence] Heartbeat de ${userId}`);
    } catch (error) {
      console.error(`❌ Error en heartbeat de ${userId}:`, error);
    }
  });

  // 🔴 DESCONECTAR: Usuario se desconecta
  socket.on("disconnect", async (reason) => {
    try {
      console.log(
        `🔴 [Presence] Usuario ${userId} desconectado. Razón: ${reason}`
      );

      // Remover el socket específico (por si tiene múltiples dispositivos)
      await onlineUsers.removeSocket(userId, socket.id);

      // Verificar si el usuario aún está online en otro dispositivo
      const stillOnline = await onlineUsers.isUserOnline(userId);

      if (!stillOnline) {
        console.log(`❌ [Presence] Usuario ${userId} completamente offline`);

        // Notificar a todos que el usuario se desconectó
        socket.broadcast.emit("user_disconnected", {
          userId,
          timestamp: new Date().toISOString(),
        });
      }

      // Obtener y emitir lista actualizada
      const onlineUsersList = await onlineUsers.getAllUsers();
      io.emit("online_users", onlineUsersList);

      console.log(
        `👥 Usuarios online después de desconexión (${onlineUsersList.length}):`,
        onlineUsersList
      );
    } catch (error) {
      console.error(`❌ Error al desconectar usuario ${userId}:`, error);
    }
  });
}
