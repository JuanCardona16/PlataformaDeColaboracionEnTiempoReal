import { Socket } from "socket.io";
import { JwtTokenService } from "@repo/security/jsonwebtoken";

export async function verifySocketAuth(
  socket: Socket,
  next: any,
  secret: string
) {
  const jwtTokenServices = new JwtTokenService(secret!);

  try {
    const token =
      socket.handshake.auth?.token || socket.handshake.headers["authorization"];

    if (!token) return next();

    const jwtToken =
      typeof token === "string" && token.startsWith("Bearer ")
        ? token.split(" ")[1]
        : token;

    const payload = jwtTokenServices.verifyToken(jwtToken) as any;

    socket.data.userId = payload.sub || payload.userId;
    next();
  } catch (error) {
    console.warn("⚠️ Socket authentication failed:", error);
    next();
  }
}
