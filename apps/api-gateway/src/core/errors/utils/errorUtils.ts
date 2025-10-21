import {
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  DatabaseError,
  ExternalServiceError,
  BusinessRuleError,
} from "../AppError.js";

/**
 * Utilidades para lanzar errores de manera consistente
 */
export const throwError = {
  /**
   * Lanza un error de validación
   */
  validation: (message: string, details?: any): never => {
    throw new ValidationError(message, details);
  },

  /**
   * Lanza un error de recurso no encontrado
   */
  notFound: (resource?: string): never => {
    throw new NotFoundError(resource);
  },

  /**
   * Lanza un error de no autorizado
   */
  unauthorized: (message?: string): never => {
    throw new UnauthorizedError(message);
  },

  /**
   * Lanza un error de acceso prohibido
   */
  forbidden: (message?: string): never => {
    throw new ForbiddenError(message);
  },

  /**
   * Lanza un error de conflicto
   */
  conflict: (message: string, details?: any): never => {
    throw new ConflictError(message, details);
  },

  /**
   * Lanza un error de base de datos
   */
  database: (message?: string, details?: any): never => {
    throw new DatabaseError(message, details);
  },

  /**
   * Lanza un error de servicio externo
   */
  externalService: (
    service: string,
    message?: string,
    details?: any
  ): never => {
    throw new ExternalServiceError(service, message, details);
  },

  /**
   * Lanza un error de regla de negocio
   */
  businessRule: (message: string, details?: any): never => {
    throw new BusinessRuleError(message, details);
  },

  /**
   * Lanza un error personalizado
   */
  custom: (
    message: string,
    statusCode: number,
    code: string,
    details?: any
  ): never => {
    throw new AppError({
      message,
      statusCode,
      code,
      details,
      isOperational: true,
    });
  },
};

/**
 * Valida que un valor no sea null o undefined
 */
export const assertExists = <T>(
  value: T | null | undefined,
  errorMessage: string = "Required value is missing"
): T => {
  if (value === null || value === undefined) {
    throwError.validation(errorMessage);
  }
  return value as T;
};

/**
 * Valida que un recurso exista
 */
export const assertResourceExists = <T>(
  resource: T | null | undefined,
  resourceName: string = "Resource"
): T => {
  if (resource === null || resource === undefined) {
    throwError.notFound(resourceName);
  }
  return resource as T;
};

/**
 * Valida permisos de usuario
 */
export const assertPermission = (
  hasPermission: boolean,
  message: string = "Insufficient permissions"
): void => {
  if (!hasPermission) {
    throwError.forbidden(message);
  }
};

/**
 * Valida autenticación de usuario
 */
export const assertAuthenticated = (
  isAuthenticated: boolean,
  message: string = "Authentication required"
): void => {
  if (!isAuthenticated) {
    throwError.unauthorized(message);
  }
};
