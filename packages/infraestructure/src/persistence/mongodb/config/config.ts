import mongoose from "mongoose";

export interface MongoConfig {
  url: string;
  options?: mongoose.ConnectOptions;
  retryAttempts?: number;
  retryDelay?: number;
}

/**
 * Clase que maneja la configuración y conexión a MongoDB usando Mongoose
 *
 * Esta clase proporciona métodos para:
 * - Establecer una conexión a MongoDB
 * - Manejar eventos de conexión y desconexión
 * - Cerrar la conexión de forma segura
 */
export class MongoConnection {
  private static instance: MongoConnection;
  private isConnected: boolean = false;
  private config: MongoConfig;

  private constructor(config: MongoConfig) {
    this.config = config;
  }

  public static getInstance(config: MongoConfig): MongoConnection {
    if (!MongoConnection.instance) {
      if (!config.url) {
        throw new Error("MongoConfig is required for first initialization");
      }
      MongoConnection.instance = new MongoConnection(config);
    }
    return MongoConnection.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      console.log("MongoDB is already connected");
      return;
    }

    const maxRetries = this.config.retryAttempts || 5;
    const retryDelay = this.config.retryDelay || 1000;

    for (let attempt = 1; attempt < maxRetries; attempt++) {
      try {
        await mongoose.connect(this.config.url, {
          maxPoolSize: 10,
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
          bufferCommands: false,
          ...this.config.options,
        });
        this.isConnected = true;
        console.log(`MongoDB connected successfully on attempt ${attempt}`);
        this.setupEventListeners();
        return;
      } catch (error) {
        console.error(
          `MongoDB connection attempt ${attempt + 1} failed:`,
          error
        );
        if (attempt === maxRetries) {
          throw new Error(
            `Failed to connect to MongoDB after ${maxRetries} attempts`
          );
        }
        await this.delay(retryDelay);
      }
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      console.log("MongoDB is not connected");
      return;
    }
    try {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log("MongoDB disconnected successfully");
    } catch (error) {
      console.error("Error disconnecting from MongoDB:", error);
      throw error;
    }
  }

  public getConnectionStatus(): boolean {
    return this.isConnected && mongoose.connection.readyState === 1;
  }

  public getConnection(): typeof mongoose {
    if (!this.isConnected) {
      throw new Error("MongoDB is not connected");
    }
    return mongoose;
  }

  private setupEventListeners(): void {
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected");
    });

    mongoose.connection.on("error", (error: any) => {
      console.error("MongoDB connection error:", error);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
      this.isConnected = false;
    });

    mongoose.connection.on("reconnected", () => {
      console.log("MongoDB reconnected");
      this.isConnected = true;
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await this.disconnect();
      process.exit(0);
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Factory function for easier usage
export const createMongoConnection = (config: MongoConfig): MongoConnection => {
  return MongoConnection.getInstance(config);
};
