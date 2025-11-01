import { createClient } from 'redis'

/**
 * Configuración y creación de cliente Redis
 */
export class RedisManager {
  static pubClient: any;
  static subClient: any;
  /**
   * Crear y conectar clientes Redis (pub/sub pattern para Socket.io)
   */
  static async createRedisClients(
    config: { url?: string; password?: string; database?: number } = {}
  ) {
    try {
      const redisUrl = config.url || "redis://localhost:6379";

      const clientConfig = {
        url: redisUrl,
        password: config.password,
        database: config.database || 0,
        socket: {
          reconnectStrategy: (retries: number) => {
            if (retries > 10) {
              console.error("❌ Redis: Demasiados intentos de reconexión");
              return new Error("Demasiados intentos de reconexión");
            }
            // Backoff exponencial: 100ms, 200ms, 400ms, 800ms, etc.
            const delay = Math.min(retries * 100, 3000);
            console.log(
              `🔄 Redis: Reintentando conexión en ${delay}ms (intento ${retries})`
            );
            return delay;
          },
        },
      };

      // Cliente Publisher
      this.pubClient = createClient(clientConfig);

      // Cliente Subscriber (debe ser independiente)
      this.subClient = this.pubClient.duplicate();

      // Event listeners para el publisher
      this.pubClient.on("error", (err: any) => {
        console.error("❌ Redis Publisher Error:", err);
      });

      this.pubClient.on("connect", () => {
        console.log("🔌 Redis Publisher: Conectando...");
      });

      this.pubClient.on("ready", () => {
        console.log("✅ Redis Publisher: Listo");
      });

      this.pubClient.on("reconnecting", () => {
        console.log("🔄 Redis Publisher: Reconectando...");
      });

      // Event listeners para el subscriber
      this.subClient.on("error", (err: any) => {
        console.error("❌ Redis Subscriber Error:", err);
      });

      this.subClient.on("connect", () => {
        console.log("🔌 Redis Subscriber: Conectando...");
      });

      this.subClient.on("ready", () => {
        console.log("✅ Redis Subscriber: Listo");
      });

      this.subClient.on("reconnecting", () => {
        console.log("🔄 Redis Subscriber: Reconectando...");
      });

      // Conectar ambos clientes
      await Promise.all([this.pubClient.connect(), this.subClient.connect()]);

      console.log("✅ Redis: Ambos clientes conectados exitosamente");

      return {
        pubClient: this.pubClient,
        subClient: this.subClient,
      };
    } catch (error) {
      console.error("❌ Redis: Error al crear clientes:", error);
      throw error;
    }
  }

  /**
   * Obtener clientes existentes
   */
  static getClients() {
    if (!this.pubClient || !this.subClient) {
      return null;
    }
    return {
      pubClient: this.pubClient,
      subClient: this.subClient,
    };
  }

  /**
   * Cerrar conexiones
   */
  static async disconnect() {
    try {
      const promises = [];

      if (this.pubClient) {
        promises.push(this.pubClient.quit());
      }

      if (this.subClient) {
        promises.push(this.subClient.quit());
      }

      await Promise.all(promises);

      this.pubClient = null;
      this.subClient = null;

      console.log("✅ Redis: Clientes desconectados");
    } catch (error) {
      console.error("❌ Redis: Error al desconectar:", error);
      throw error;
    }
  }

  /**
   * Verificar salud de la conexión
   */
  static async healthCheck() {
    try {
      if (!this.pubClient) {
        return false;
      }

      await this.pubClient.ping();
      return true;
    } catch (error) {
      console.error("❌ Redis: Health check falló:", error);
      return false;
    }
  }

  /**
   * Obtener información del servidor Redis
   */
  static async getInfo() {
    try {
      if (!this.pubClient) {
        return null;
      }

      const info = await this.pubClient.info();
      return info;
    } catch (error) {
      console.error("❌ Redis: Error al obtener info:", error);
      return null;
    }
  }
}

/**
 * Utilidad para operaciones comunes de Redis
 */
// export class RedisUtils {
//   /**
//    * Set con TTL automático
//    */
//   static async setWithTTL(client, key, value, ttlSeconds) {
//     await client.setEx(key, ttlSeconds, value);
//   }

//   /**
//    * Guardar objeto como JSON
//    */
//   static async setJSON(client, key, data, ttlSeconds) {
//     const jsonString = JSON.stringify(data);
    
//     if (ttlSeconds) {
//       await client.setEx(key, ttlSeconds, jsonString);
//     } else {
//       await client.set(key, jsonString);
//     }
//   }

//   /**
//    * Obtener objeto desde JSON
//    */
//   static async getJSON(client, key) {
//     const jsonString = await client.get(key);
    
//     if (!jsonString) {
//       return null;
//     }
    
//     try {
//       return JSON.parse(jsonString);
//     } catch (error) {
//       console.error(`❌ Redis: Error al parsear JSON de key ${key}:`, error);
//       return null;
//     }
//   }

//   /**
//    * Incrementar contador
//    */
//   static async increment(client, key, amount = 1) {
//     return await client.incrBy(key, amount);
//   }

//   /**
//    * Obtener múltiples keys con patrón
//    */
//   static async getKeysByPattern(client, pattern) {
//     const keys = [];
    
//     for await (const key of client.scanIterator({ MATCH: pattern, COUNT: 100 })) {
//       keys.push(key);
//     }
    
//     return keys;
//   }

//   /**
//    * Eliminar múltiples keys con patrón
//    */
//   static async deleteByPattern(client, pattern) {
//     const keys = await this.getKeysByPattern(client, pattern);
    
//     if (keys.length === 0) {
//       return 0;
//     }
    
//     await client.del(keys);
//     return keys.length;
//   }
// }
