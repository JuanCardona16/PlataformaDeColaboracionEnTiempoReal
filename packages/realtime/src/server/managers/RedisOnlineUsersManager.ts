import type { RedisClientType } from "redis";

/**
 * Manager para gestionar usuarios en línea usando Redis
 * 
 * Estructura de datos en Redis:
 * - Key: "online:users" (Hash)
 * - Field: userId
 * - Value: socketId
 * 
 * Esto permite:
 * - O(1) para agregar/eliminar usuarios
 * - O(1) para verificar si un usuario está online
 * - O(1) para obtener el socketId de un usuario
 * - O(N) para obtener todos los usuarios (donde N es cantidad de usuarios online)
 */
export class RedisOnlineUsersManager {
  private redis: RedisClientType;
  private readonly ONLINE_USERS_KEY = "online:users";
  private readonly USER_SOCKETS_PREFIX = "user:sockets:"; // Para multiples conexiones

  constructor(redisClient: RedisClientType) {
    this.redis = redisClient;
  }

  /**
   * Agregar un usuario como online
   * Guarda la relación userId -> socketId
   */
  async addUser(userId: string, socketId: string) {
    try {
      // Guardar en el hash principal
      await this.redis.hSet(this.ONLINE_USERS_KEY, userId, socketId);

      // También guardar en un set para el usuario (soporta múltiples dispositivos)
      await this.redis.sAdd(`${this.USER_SOCKETS_PREFIX}${userId}`, socketId);

      // Opcional: TTL de seguridad (expira en 24 horas si no se actualiza)
      await this.redis.expire(`${this.USER_SOCKETS_PREFIX}${userId}`, 86400);

      console.log(
        `✅ Redis: Usuario ${userId} agregado con socket ${socketId}`
      );
    } catch (error) {
      console.error(`❌ Redis: Error al agregar usuario ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Remover un usuario (cuando se desconecta)
   */
  async removeUser(userId: string): Promise<void> {
    try {
      // Eliminar del hash principal
      await this.redis.hDel(this.ONLINE_USERS_KEY, userId);

      // Eliminar el set de sockets del usuario
      await this.redis.del(`${this.USER_SOCKETS_PREFIX}${userId}`);

      console.log(`❌ Redis: Usuario ${userId} removido`);
    } catch (error) {
      console.error(`❌ Redis: Error al remover usuario ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Remover un socket específico (útil para múltiples dispositivos)
   */
  async removeSocket(userId: string, socketId: string): Promise<void> {
    try {
      // Remover el socket específico del set
      await this.redis.sRem(`${this.USER_SOCKETS_PREFIX}${userId}`, socketId);

      // Verificar si el usuario aún tiene otros sockets conectados
      const remainingSockets = await this.redis.sCard(
        `${this.USER_SOCKETS_PREFIX}${userId}`
      );

      if (remainingSockets === 0) {
        // Si no tiene más sockets, remover del hash principal
        await this.redis.hDel(this.ONLINE_USERS_KEY, userId);
        await this.redis.del(`${this.USER_SOCKETS_PREFIX}${userId}`);
        console.log(`❌ Redis: Usuario ${userId} completamente desconectado`);
      } else {
        console.log(
          `⚠️ Redis: Usuario ${userId} aún tiene ${remainingSockets} conexión(es)`
        );
      }
    } catch (error) {
      console.error(
        `❌ Redis: Error al remover socket ${socketId} del usuario ${userId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Obtener el socketId de un usuario
   * Retorna el primer socket si tiene múltiples conexiones
   */
  async getSocketId(userId: string): Promise<string | null> {
    try {
      const socketId = await this.redis.hGet(this.ONLINE_USERS_KEY, userId);
      return socketId || null;
    } catch (error) {
      console.error(`❌ Redis: Error al obtener socketId de ${userId}:`, error);
      return null;
    }
  }

  /**
   * Obtener todos los socketIds de un usuario (múltiples dispositivos)
   */
  async getAllSocketIds(userId: string): Promise<string[]> {
    try {
      const sockets = await this.redis.sMembers(
        `${this.USER_SOCKETS_PREFIX}${userId}`
      );
      return sockets;
    } catch (error) {
      console.error(`❌ Redis: Error al obtener sockets de ${userId}:`, error);
      return [];
    }
  }

  /**
   * Verificar si un usuario está online
   */
  async isUserOnline(userId: string): Promise<boolean> {
    try {
      const exists = await this.redis.hExists(this.ONLINE_USERS_KEY, userId);
      return exists === 1 ? true : false;
    } catch (error) {
      console.error(
        `❌ Redis: Error al verificar si ${userId} está online:`,
        error
      );
      return false;
    }
  }

  /**
   * Obtener lista de todos los usuarios online
   */
  async getAllUsers(): Promise<string[]> {
    try {
      const users = await this.redis.hKeys(this.ONLINE_USERS_KEY);
      return users;
    } catch (error) {
      console.error("❌ Redis: Error al obtener usuarios online:", error);
      return [];
    }
  }

  /**
   * Obtener cantidad de usuarios online
   */
  async getUserCount(): Promise<number> {
    try {
      const count = await this.redis.hLen(this.ONLINE_USERS_KEY);
      return count;
    } catch (error) {
      console.error("❌ Redis: Error al contar usuarios:", error);
      return 0;
    }
  }

  /**
   * Obtener todos los usuarios con sus socketIds
   */
  async getAllUsersWithSockets(): Promise<Map<string, string>> {
    try {
      const data = await this.redis.hGetAll(this.ONLINE_USERS_KEY);
      const map = new Map<string, string>();

      Object.entries(data).forEach(([userId, socketId]) => {
        map.set(userId, socketId);
      });

      return map;
    } catch (error) {
      console.error("❌ Redis: Error al obtener usuarios con sockets:", error);
      return new Map();
    }
  }

  /**
   * Limpiar todos los usuarios (útil para desarrollo/testing)
   */
  async clearAll(): Promise<void> {
    try {
      // Obtener todos los usuarios para limpiar sus sets
      const users = await this.getAllUsers();

      // Eliminar el hash principal
      await this.redis.del(this.ONLINE_USERS_KEY);

      // Eliminar todos los sets de sockets de usuarios
      if (users.length > 0) {
        const deletePromises = users.map((userId) =>
          this.redis.del(`${this.USER_SOCKETS_PREFIX}${userId}`)
        );
        await Promise.all(deletePromises);
      }

      console.log("🧹 Redis: Todos los usuarios online limpiados");
    } catch (error) {
      console.error("❌ Redis: Error al limpiar usuarios:", error);
      throw error;
    }
  }

  /**
   * Actualizar el timestamp de última actividad de un usuario
   * Útil para detectar usuarios inactivos
   */
  async updateLastSeen(userId: string): Promise<void> {
    try {
      const timestamp = Date.now();
      await this.redis.hSet(`user:lastseen`, userId, timestamp.toString());
      await this.redis.expire(`user:lastseen`, 86400); // 24 horas
    } catch (error) {
      console.error(
        `❌ Redis: Error al actualizar last seen de ${userId}:`,
        error
      );
    }
  }

  /**
   * Obtener el timestamp de última actividad
   */
  async getLastSeen(userId: string): Promise<number | null> {
    try {
      const timestamp = await this.redis.hGet(`user:lastseen`, userId);
      return timestamp ? parseInt(timestamp) : null;
    } catch (error) {
      console.error(
        `❌ Redis: Error al obtener last seen de ${userId}:`,
        error
      );
      return null;
    }
  }

  /**
   * Limpiar usuarios inactivos (que no han actualizado en X tiempo)
   */
  async cleanupInactiveUsers(maxInactiveMs: number = 3600000): Promise<number> {
    try {
      const users = await this.getAllUsers();
      const now = Date.now();
      let cleaned = 0;

      for (const userId of users) {
        const lastSeen = await this.getLastSeen(userId);
        if (lastSeen && now - lastSeen > maxInactiveMs) {
          await this.removeUser(userId);
          cleaned++;
        }
      }

      if (cleaned > 0) {
        console.log(`🧹 Redis: ${cleaned} usuarios inactivos limpiados`);
      }

      return cleaned;
    } catch (error) {
      console.error("❌ Redis: Error al limpiar usuarios inactivos:", error);
      return 0;
    }
  }

  /**
   * Obtener estadísticas del sistema
   */
  async getStats(): Promise<{
    totalOnline: number;
    users: string[];
    timestamp: number;
  }> {
    try {
      const users = await this.getAllUsers();
      return {
        totalOnline: users.length,
        users: users,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error("❌ Redis: Error al obtener estadísticas:", error);
      return {
        totalOnline: 0,
        users: [],
        timestamp: Date.now(),
      };
    }
  }
}
