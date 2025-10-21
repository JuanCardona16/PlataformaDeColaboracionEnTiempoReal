import jwt from "jsonwebtoken";

export interface ItokenService {
  generateToken(payload: object, expiresTime?: string | number): string;
  verifyToken(token: string): object | string | null;
}

export class JwtTokenService implements ItokenService {
  private readonly SECRET_KEY: string;

  constructor(secretKey: string) {
    if (!secretKey) {
      throw new Error("Secret key is required");
    }
    this.SECRET_KEY = secretKey;
  }

  generateToken(payload: object, expiresTime: string | number = "1d"): string {
    return jwt.sign(payload!, this.SECRET_KEY, {
      expiresIn: expiresTime,
    } as jwt.SignOptions);
  }

  verifyToken(token: string): object | string | null {
    try {
      const response = jwt.verify(token, this.SECRET_KEY!) as object;
      return response;
    } catch (error: any) {
      throw new Error(error.message || "Invalid or expired token");
    }
  }
}
