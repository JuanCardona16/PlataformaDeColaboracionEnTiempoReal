import { Request, Response, NextFunction } from "express";
import { AppError } from "../AppError.js";
import { ErrorResponse, ErrorCodes } from "../types/errors.js";

// Type guard para AppError
function isAppError(error: Error): error is AppError {
  return error instanceof AppError;
}

// Logger simple (puedes reemplazarlo con winston o tu logger preferido)
const logger = {
  error: (message: string, meta?: any) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, meta);
  },
  warn: (message: string, meta?: any) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, meta);
  },
};

/**
 * Determina si un error es operacional (esperado) o un error del sistema
 */
const isOperationalError = (error: Error): boolean => {
  if (isAppError(error)) {
    return error.isOperational;
  }
  return false;
};

/**
 * Formatea el error en una respuesta consistente
 */
const formatErrorResponse = (
  error: AppError | Error,
  req: Request
): ErrorResponse => {
  const isDevelopment = process.env.NODE_ENV === "development";

  if (error instanceof AppError) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
        details: error.details,
        ...(isDevelopment && { stack: error.stack }),
      },
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
    };
  }

  // Error no controlado
  return {
    success: false,
    error: {
      message: isDevelopment ? error.message : "Internal server error",
      code: ErrorCodes.INTERNAL_SERVER_ERROR,
      statusCode: 500,
      ...(isDevelopment && { stack: error.stack }),
    },
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  };
};

/**
 * Maneja errores específicos de Express y los convierte en AppError
 */
const handleSpecificErrors = (error: any): AppError => {
  // Error de validación de Mongoose
  if (error.name === "ValidationError") {
    const details = Object.values(error.errors).map((err: any) => ({
      field: err.path,
      message: err.message,
    }));

    return new AppError({
      message: "Validation failed",
      statusCode: 400,
      code: ErrorCodes.VALIDATION_ERROR,
      details,
    });
  }

  // Error de duplicado de Mongoose
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return new AppError({
      message: `${field} already exists`,
      statusCode: 409,
      code: ErrorCodes.ALREADY_EXISTS,
      details: { field, value: error.keyValue[field as keyof typeof error.keyValue] },
    });
  }

  // Error de cast de Mongoose (ID inválido)
  if (error.name === "CastError") {
    return new AppError({
      message: `Invalid ${error.path}: ${error.value}`,
      statusCode: 400,
      code: ErrorCodes.INVALID_INPUT,
      details: { field: error.path, value: error.value },
    });
  }

  // Error de JWT
  if (error.name === "JsonWebTokenError") {
    return new AppError({
      message: "Invalid token",
      statusCode: 401,
      code: ErrorCodes.INVALID_TOKEN,
    });
  }

  if (error.name === "TokenExpiredError") {
    return new AppError({
      message: "Token expired",
      statusCode: 401,
      code: ErrorCodes.TOKEN_EXPIRED,
    });
  }

  // Error de sintaxis JSON
  if (error instanceof SyntaxError && "body" in error) {
    return new AppError({
      message: "Invalid JSON format",
      statusCode: 400,
      code: ErrorCodes.INVALID_INPUT,
    });
  }

  // Si no es un error conocido, devolver el error original
  return error;
};

/**
 * Middleware principal de manejo de errores
 * IMPORTANTE: Este middleware debe ser el último en la cadena de middlewares
 */
export const globalErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Procesar errores específicos
  let processedError = handleSpecificErrors(error);

  // Si no es un AppError, crear uno genérico
  if (!(processedError instanceof AppError)) {
    processedError = new AppError({
      message: (processedError as Error).message || "Something went wrong",
      statusCode: 500,
      code: ErrorCodes.INTERNAL_SERVER_ERROR,
      isOperational: false,
    });
  }

  // Log del error
  if (isOperationalError(processedError)) {
    logger.warn(`Operational error: ${processedError.message}`, {
      code: processedError.code,
      statusCode: processedError.statusCode,
      path: req.originalUrl,
      method: req.method,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
    });
  } else {
    logger.error(`System error: ${processedError.message}`, {
      stack: processedError.stack,
      path: req.originalUrl,
      method: req.method,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      body: req.body,
      params: req.params,
      query: req.query,
    });
  }

  // Formatear y enviar respuesta
  const errorResponse = formatErrorResponse(processedError, req);

  res.status(processedError.statusCode).json(errorResponse);
};

/**
 * Middleware para capturar errores asíncronos
 * Envuelve funciones async para capturar errores automáticamente
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Middleware para manejar rutas no encontradas
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new AppError({
    message: `Route ${req.originalUrl} not found`,
    statusCode: 404,
    code: ErrorCodes.NOT_FOUND,
  });

  next(error);
};
