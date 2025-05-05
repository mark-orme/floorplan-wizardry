
import * as z from '@/utils/zod-mock';

/**
 * Validate a field using zod schema
 * @param schema The zod schema to validate against
 * @param value The value to validate (optional)
 * @returns Validation result
 */
export function validateField(schema: any, value?: any) {
  try {
    if (typeof schema.parse === 'function') {
      // If value is provided, validate it
      if (arguments.length > 1) {
        schema.parse(value);
      } else {
        // Just check if the schema is valid when no value is provided
        schema.parse();
      }
      return { isValid: true, error: null };
    }
    return { isValid: true, error: null };
  } catch (error) {
    const zodError = error as z.ZodError;
    const errorMessage = zodError.errors?.[0]?.message || 'Invalid input';
    return { isValid: false, error: errorMessage };
  }
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
  // Support for all argument patterns
  // If called with a schema and a value, validate the value against the schema
  if (arguments.length >= 2) {
    return validateField(schema, value);
  }
  
  // If called with just a schema, validate the schema itself
  return validateField(schema);
}

export default { validateField, validateFieldEnhanced };
