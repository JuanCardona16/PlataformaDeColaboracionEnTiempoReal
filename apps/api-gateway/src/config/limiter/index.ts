import { rateLimit } from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // Limitar cada IP a 10 solicitudes por ventana
  message: "Demasiadas solicitudes desde esta IP, por favor intente más tarde.",
  standardHeaders: true, // Devuelve información de límite de velocidad en los encabezados `RateLimit-*`
  legacyHeaders: false, // Desactiva los encabezados `X-RateLimit-*`
});
