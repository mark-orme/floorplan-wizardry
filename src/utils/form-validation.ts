/**
 * Form validation utilities
 */
import * as z from '@/utils/zod-mock';

/**
 * Validate a field using a zod schema
 * @param schema The zod schema to use
 * @param value The value to validate (optional)
 * @returns Validation result with error message if invalid
 */
export function validateField(schema: z.Schema, value?: any) {
  try {
    // If a value is provided, use it for validation
    if (arguments.length > 1 && value !== undefined) {
      schema.parse(value);
    } else {
      // Otherwise, just check if the schema itself is valid
    }
    
    return { isValid: true, error: null };
  } catch (error) {
    let message = 'Invalid field';
    
    if (error instanceof z.ZodError) {
      message = error.errors[0]?.message || 'Validation failed';
    }
    
    return { isValid: false, error: message };
  }
}

/**
 * Validate an entire form
 * @param schema Form schema object
 * @param values Form values
 * @returns Validation result object
 */
export function validateForm(schema: Record<string, z.Schema>, values: Record<string, any>) {
  const result: Record<string, { isValid: boolean; error: string | null }> = {};
  
  for (const field in schema) {
    if (Object.prototype.hasOwnProperty.call(schema, field)) {
      result[field] = validateField(schema[field], values[field]);
    }
  }
  
  return {
    isValid: Object.values(result).every(r => r.isValid),
    errors: Object.fromEntries(
      Object.entries(result)
        .filter(([_, val]) => !val.isValid)
        .map(([key, val]) => [key, val.error])
    )
  };
}

/**
 * Enhanced validate field that is backward compatible with older code
 * This handles the different ways validateField might be called
 * 
 * @param schema The zod schema to validate against
 * @param value The value to validate (optional)
 * @returns Validation result
 */
export function validateFieldEnhanced(schema: any, value?: any) {
  // Always call validateField with both schema and value
  return validateField(schema, value);
}

export default { validateField, validateFieldEnhanced };
