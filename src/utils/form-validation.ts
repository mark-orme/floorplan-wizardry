
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

export default { validateField };
