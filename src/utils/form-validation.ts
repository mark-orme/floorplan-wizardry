
import { z } from "zod";

export const validateField = <T>(
  schema: z.ZodType<T>,
  value: unknown
): { isValid: boolean; error?: string } => {
  const result = schema.safeParse(value);
  if (result.success) {
    return { isValid: true };
  }
  return {
    isValid: false,
    error: result.error.errors[0]?.message || 'Invalid value'
  };
};
