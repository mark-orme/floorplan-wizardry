
import { useState, useCallback } from 'react';
import { z } from '@/utils/zod-mock';

export const useInputValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateInput = useCallback(<T>(
    schema: z.ZodType<T>,
    input: unknown
  ): { isValid: boolean; data: T | null } => {
    try {
      const result = schema.parse(input);
      setErrors({});
      return { isValid: true, data: result };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMap: Record<string, string> = {};
        error.errors.forEach(err => {
          const path = err.path.join('.');
          errorMap[path || 'general'] = err.message;
        });
        setErrors(errorMap);
      } else {
        setErrors({ general: 'An unknown error occurred' });
      }
      return { isValid: false, data: null };
    }
  }, []);

  return {
    errors,
    validateInput,
    hasErrors: Object.keys(errors).length > 0,
    getError: (field: string) => errors[field] || null
  };
};
