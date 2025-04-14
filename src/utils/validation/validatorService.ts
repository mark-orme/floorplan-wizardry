
/**
 * Validator Service
 * Centralized validation service for the application
 */
import { z } from 'zod';
import { sanitizeHtml } from '@/utils/security/htmlSanitization';
import logger from '@/utils/logger';
import { captureError } from '@/utils/sentry';
import { validateStraightLineDrawing } from '@/utils/diagnostics/drawingToolValidator';

/**
 * Result of validation operation
 */
export interface ValidationResult<T = any> {
  valid: boolean;
  data: T | null;
  errors: Record<string, string[]>;
  message?: string;
}

/**
 * Validate and sanitize input with a Zod schema
 * 
 * @param schema Zod schema to validate against
 * @param data Data to validate
 * @param options Options for validation
 * @returns Validation result
 */
export function validateWithSchema<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  options: {
    sanitize?: boolean;
    errorPrefix?: string;
    logErrors?: boolean;
  } = {}
): ValidationResult<T> {
  const { sanitize = true, errorPrefix = '', logErrors = true } = options;
  
  try {
    // Apply sanitization if enabled
    const sanitizedData = sanitize && typeof data === 'object' && data !== null
      ? sanitizeObject(data as Record<string, any>)
      : data;
    
    // Validate with schema
    const result = schema.safeParse(sanitizedData);
    
    if (result.success) {
      return {
        valid: true,
        data: result.data,
        errors: {}
      };
    } else {
      // Format errors
      const formattedErrors: Record<string, string[]> = {};
      
      result.error.errors.forEach(err => {
        const field = String(err.path[0] || '_general');
        if (!formattedErrors[field]) {
          formattedErrors[field] = [];
        }
        
        const prefixedMessage = errorPrefix 
          ? `${errorPrefix}: ${err.message}`
          : err.message;
        
        formattedErrors[field].push(prefixedMessage);
      });
      
      // Log errors if enabled
      if (logErrors) {
        logger.warn('Validation failed', {
          schema: schema.description || 'unnamed schema',
          errors: formattedErrors
        });
      }
      
      return {
        valid: false,
        data: null,
        errors: formattedErrors,
        message: 'Validation failed'
      };
    }
  } catch (error) {
    // Handle unexpected errors
    captureError(error, 'validator-service-error', {
      context: {
        operation: 'validateWithSchema',
        schema: schema.description || 'unnamed schema'
      }
    });
    
    logger.error('Validation error', { error });
    
    return {
      valid: false,
      data: null,
      errors: { _general: ['An unexpected error occurred during validation'] },
      message: 'Validation error'
    };
  }
}

/**
 * Sanitize string values in object recursively
 * 
 * @param obj Object to sanitize
 * @returns Sanitized object
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const result: Record<string, any> = {};
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      
      if (typeof value === 'string') {
        result[key] = sanitizeHtml(value);
      } else if (typeof value === 'object' && value !== null) {
        result[key] = Array.isArray(value)
          ? value.map(item => typeof item === 'object' && item !== null ? sanitizeObject(item) : item)
          : sanitizeObject(value);
      } else {
        result[key] = value;
      }
    }
  }
  
  return result as T;
}

/**
 * Common validation schemas
 */
export const validationSchemas = {
  // User information
  user: {
    email: z.string().email('Invalid email address').max(255),
    password: z.string().min(8, 'Password must be at least 8 characters').max(100),
    username: z.string().min(3, 'Username must be at least 3 characters').max(50)
      .regex(/^[a-zA-Z0-9_.-]+$/, 'Username must only contain letters, numbers, and the characters _.-'),
    name: z.string().min(2, 'Name must be at least 2 characters').max(100)
  },
  
  // Common inputs
  common: {
    id: z.string().uuid('Invalid ID format').or(z.string().regex(/^[A-Za-z0-9_-]+$/, 'Invalid ID format')),
    url: z.string().url('Invalid URL').max(2048),
    date: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date format'),
    safeString: z.string().max(1000),
    safeHtml: z.string().max(10000)
  },
  
  // Drawing-related
  drawing: {
    validateLine: validateStraightLineDrawing
  }
};

/**
 * Validate a specific value against a common schema
 * 
 * @param value Value to validate
 * @param schemaType Schema type to use
 * @param schemaPath Path to schema in validationSchemas
 * @returns Validation result
 */
export function validateValue<T>(
  value: unknown,
  schemaType: string,
  schemaPath: string
): ValidationResult<T> {
  // Find schema by path
  const pathParts = schemaPath.split('.');
  let schema: any = validationSchemas;
  
  for (const part of pathParts) {
    if (!schema[part]) {
      return {
        valid: false,
        data: null,
        errors: { _general: [`Schema ${schemaPath} not found`] },
        message: `Schema ${schemaPath} not found`
      };
    }
    schema = schema[part];
  }
  
  // Ensure schema is a Zod schema
  if (!schema || typeof schema !== 'object' || !('parse' in schema)) {
    return {
      valid: false,
      data: null,
      errors: { _general: [`Invalid schema at ${schemaPath}`] },
      message: `Invalid schema at ${schemaPath}`
    };
  }
  
  return validateWithSchema(schema, value);
}

/**
 * Centralized validator service
 */
export const ValidatorService = {
  validateWithSchema,
  sanitizeObject,
  validateValue,
  schemas: validationSchemas
};

export default ValidatorService;
