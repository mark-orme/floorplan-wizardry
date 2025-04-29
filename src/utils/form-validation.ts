
import { z } from "@/utils/zod-mock";

export const validateField = <T>(
  schema: z.ZodType<T>,
  value: unknown
): { isValid: boolean; error?: string } => {
  try {
    schema.parse(value);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        error: error.errors[0]?.message || 'Invalid value'
      };
    }
    return { isValid: false, error: 'Invalid value' };
  }
};

// Additional helper functions for form validation
export const validateForm = <T extends Record<string, unknown>>(
  schema: Record<string, z.ZodType<any>>,
  values: T
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  let isValid = true;

  Object.entries(schema).forEach(([field, fieldSchema]) => {
    const result = validateField(fieldSchema, values[field]);
    if (!result.isValid) {
      errors[field] = result.error || `Invalid ${field}`;
      isValid = false;
    }
  });

  return { isValid, errors };
};
