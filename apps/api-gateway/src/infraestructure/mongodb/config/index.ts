import { DATABASE_URL } from '@/constants/env/index.js';
import { createMongoConnection, MongoConfig } from '@repo/infraestructure/mongodb'

const mongoConfig: MongoConfig = {
  url: DATABASE_URL,
  retryAttempts: 5,
  retryDelay: 1000,
};

const dbInstance = createMongoConnection(mongoConfig);

dbInstance.getConnectionStatus();

export default dbInstance;
