// Tipos para el manejo de errores
export interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    statusCode: number;
    details?: any;
    stack?: string;
  };
  timestamp: string;
  path: string;
}

export interface AppErrorOptions {
  message: string;
  statusCode?: number;
  code?: string;
  details?: any;
  isOperational?: boolean;
}

export enum ErrorCodes {
  // Errores de autenticación
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  INVALID_TOKEN = "INVALID_TOKEN",

  // Errores de validación
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INVALID_INPUT = "INVALID_INPUT",
  MISSING_REQUIRED_FIELD = "MISSING_REQUIRED_FIELD",

  // Errores de recursos
  NOT_FOUND = "NOT_FOUND",
  ALREADY_EXISTS = "ALREADY_EXISTS",
  CONFLICT = "CONFLICT",

  // Errores de servidor
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  DATABASE_ERROR = "DATABASE_ERROR",
  EXTERNAL_SERVICE_ERROR = "EXTERNAL_SERVICE_ERROR",

  // Errores de rate limiting
  TOO_MANY_REQUESTS = "TOO_MANY_REQUESTS",

  // Errores de negocio
  BUSINESS_RULE_VIOLATION = "BUSINESS_RULE_VIOLATION",
  INSUFFICIENT_PERMISSIONS = "INSUFFICIENT_PERMISSIONS",
}
