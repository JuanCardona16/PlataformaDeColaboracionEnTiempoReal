import { AppErrorOptions, ErrorCodes } from "./types/errors.js";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(options: AppErrorOptions) {
    super(options.message);

    this.statusCode = options.statusCode || 500;
    this.code = options.code || ErrorCodes.INTERNAL_SERVER_ERROR;
    this.isOperational = options.isOperational ?? true;
    this.details = options.details;

    // Mantiene el stack trace correcto
    Error.captureStackTrace(this, this.constructor);
  }
}

// Clases específicas para diferentes tipos de errores
export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super({
      message,
      statusCode: 400,
      code: ErrorCodes.VALIDATION_ERROR,
      details,
      isOperational: true,
    });
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = "Resource") {
    super({
      message: `${resource} not found`,
      statusCode: 404,
      code: ErrorCodes.NOT_FOUND,
      isOperational: true,
    });
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized access") {
    super({
      message,
      statusCode: 401,
      code: ErrorCodes.UNAUTHORIZED,
      isOperational: true,
    });
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden access") {
    super({
      message,
      statusCode: 403,
      code: ErrorCodes.FORBIDDEN,
      isOperational: true,
    });
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details?: any) {
    super({
      message,
      statusCode: 409,
      code: ErrorCodes.CONFLICT,
      details,
      isOperational: true,
    });
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = "Database operation failed", details?: any) {
    super({
      message,
      statusCode: 500,
      code: ErrorCodes.DATABASE_ERROR,
      details,
      isOperational: true,
    });
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, message?: string, details?: any) {
    super({
      message: message || `External service ${service} is unavailable`,
      statusCode: 503,
      code: ErrorCodes.EXTERNAL_SERVICE_ERROR,
      details,
      isOperational: true,
    });
  }
}

export class BusinessRuleError extends AppError {
  constructor(message: string, details?: any) {
    super({
      message,
      statusCode: 422,
      code: ErrorCodes.BUSINESS_RULE_VIOLATION,
      details,
      isOperational: true,
    });
  }
}
