
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
