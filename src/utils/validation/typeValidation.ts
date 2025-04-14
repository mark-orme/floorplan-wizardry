
/**
 * Type Validation Utilities
 * Provides utilities for validating data types and structures
 * @module utils/validation/typeValidation
 */

import { z } from 'zod';
import { sanitizeHtml, sanitizeObject } from '../security/inputSanitization';

/**
 * Validate and sanitize incoming data using Zod schema
 * @param schema Zod schema to validate against
 * @param data Data to validate and sanitize
 * @returns Sanitized, validated data or null if invalid
 */
export function validateAndSanitize<T>(schema: z.ZodSchema<T>, data: unknown): { 
  success: boolean; 
  data: T | null; 
  errors?: z.ZodError 
} {
  try {
    // Sanitize string values in the input data
    const sanitizedData = typeof data === 'object' && data !== null 
      ? sanitizeObject(data as Record<string, any>) 
      : (typeof data === 'string' ? sanitizeHtml(data) : data);

    // Validate sanitized data against schema
    const result = schema.safeParse(sanitizedData);
    
    if (result.success) {
      return { success: true, data: result.data };
    } else {
      console.error('Validation error:', result.error);
      return { success: false, data: null, errors: result.error };
    }
  } catch (error) {
    console.error('Validation error:', error);
    return { success: false, data: null };
  }
}

/**
 * Create a Zod schema with sanitization for HTML strings
 * @param stringSchema Base string schema
 * @returns Enhanced schema with sanitization
 */
export function createSanitizedStringSchema(stringSchema: z.ZodString = z.string()): z.ZodEffects<z.ZodString, string, string> {
  // Return a single transform to avoid nested ZodEffects types
  return stringSchema.transform(sanitizeHtml);
}

/**
 * Create a safe URL schema
 * @param options Schema options
 * @returns URL schema with validation and sanitization
 */
export function createUrlSchema(options: { 
  allowedProtocols?: string[]; 
  minLength?: number; 
  maxLength?: number 
} = {}): z.ZodEffects<z.ZodString, string, string> {
  const { 
    allowedProtocols = ['http:', 'https:'],
    minLength = 1,
    maxLength = 2048 
  } = options;
  
  // Create base schema with validations
  const baseSchema = z.string()
    .min(minLength)
    .max(maxLength)
    .url()
    .refine((url) => {
      try {
        const parsedUrl = new URL(url);
        return allowedProtocols.includes(parsedUrl.protocol);
      } catch {
        return false;
      }
    }, { message: `URL must use one of the following protocols: ${allowedProtocols.join(', ')}` });
  
  // Apply a single transform for sanitization
  return baseSchema.transform(sanitizeHtml);
}

/**
 * Common validation schemas for the application
 */
export const commonSchemas = {
  safeString: createSanitizedStringSchema(),
  safeHtml: createSanitizedStringSchema(z.string().max(10000)),
  safeUrl: createUrlSchema(),
  safeEmail: z.string().email().transform(sanitizeHtml),
  safeId: z.string().uuid().or(z.string().regex(/^[a-zA-Z0-9_-]+$/))
};

/**
 * Middleware function to validate request body/params/query with Zod
 * @param schema Schema to validate with
 * @param source Source of data to validate ('body', 'params', 'query')
 */
export function validateRequestData<T>(schema: z.ZodSchema<T>, data: unknown): T | null {
  const result = validateAndSanitize(schema, data);
  return result.success ? result.data : null;
}
