
import { useState, useCallback } from 'react';
import z, { ZodError } from '@/utils/zod-mock';

type ValidationResult = {
  isValid: boolean;
  error?: string;
};

export const useInputValidation = <T>(schema: z.ZodType<T>) => {
  const [validationResult, setValidationResult] = useState<ValidationResult>({ isValid: true });

  const validate = useCallback(
    (value: unknown): ValidationResult => {
      try {
        schema.parse(value);
        return { isValid: true };
      } catch (error) {
        if (error instanceof ZodError) {
          const errorMessage = error.errors[0]?.message || 'Invalid input';
          return { isValid: false, error: errorMessage };
        }
        return { isValid: false, error: 'Unknown validation error' };
      }
    },
    [schema]
  );

  const validateInput = useCallback(
    (value: unknown) => {
      const result = validate(value);
      setValidationResult(result);
      return result.isValid;
    },
    [validate]
  );
  
  return {
    validationResult,
    validateInput,
    isValid: validationResult.isValid,
    errorMessage: validationResult.error,
  };
};
