import dotenv from "dotenv";

dotenv.config();

// Enviroments
export const DATABASE_URL = process.env.DATABASE_URL!;
export const PORT = process.env.PORT! || 3000;
export const NODE_ENV = process.env.NODE_ENV! || "development";
export const TOKEN_SECRET = process.env.TOKEN_SECRET! || "secret";
export const REFESCH_TOKEN_SECRET = process.env.REFESCH_TOKEN_SECRET! || "secret";
