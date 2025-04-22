
import { z } from "zod";
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
  errors?: typeof z.ZodError 
} {
  try {
    const sanitizedData = typeof data === 'object' && data !== null 
      ? sanitizeObject(data as Record<string, any>) 
      : (typeof data === 'string' ? sanitizeHtml(data) : data);

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

export function createSanitizedStringSchema(stringSchema = z.string()) {
  return stringSchema;
}

export function createUrlSchema(options: { 
  allowedProtocols?: string[]; 
  minLength?: number; 
  maxLength?: number 
} = {}) {
  const { 
    allowedProtocols = ['http:', 'https:'],
    minLength = 1,
    maxLength = 2048 
  } = options;

  return z.string()
    .min(minLength)
    .max(maxLength);
}

export const commonSchemas = {
  safeString: createSanitizedStringSchema(),
  safeHtml: createSanitizedStringSchema(z.string().max(10000)),
  safeUrl: createUrlSchema(),
  safeEmail: z.string().email(),
  safeId: z.string()
};

export function validateRequestData<T>(schema: z.ZodSchema<T>, data: unknown): T | null {
  const result = validateAndSanitize(schema, data);
  return result.success ? result.data : null;
}
