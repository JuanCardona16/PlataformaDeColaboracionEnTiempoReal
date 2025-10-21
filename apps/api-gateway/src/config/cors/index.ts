import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const clientUrl = process.env.CLIENT_URL || ""

export const originWhitelist = [
  clientUrl,
  "http://localhost:3000",
  "Insomnia"
];

export const CorsConfig = () => {
  return cors({
    origin: (origin, callback) => {
      console.log("Solicitud desde el origen: ", origin || ""); // Solo para desarrollo
      if (originWhitelist.includes(origin || "") || !origin) {
        callback(null, true);
      } else {
        console.log("Origen no permitido por CORS: ", origin || ""); // Solo para desarrollo
        callback(new Error("Not allowed by CORS"));
      }
    }
  })
}