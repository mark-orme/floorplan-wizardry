
import * as z from '@/utils/zod-mock';

/**
 * Validate a field using zod schema
 * @param schema The zod schema to validate against
 * @param value The value to validate
 * @returns Validation result
 */
export function validateField(schema: any, value: any) {
  try {
    if (typeof schema.parse === 'function') {
      // Always pass the value to the schema
      schema.parse(value);
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
  // Always call validateField with both schema and value
  return validateField(schema, value);
}

export default { validateField, validateFieldEnhanced };
