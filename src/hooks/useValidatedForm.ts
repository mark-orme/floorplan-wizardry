
import { useState, useCallback } from 'react';
import z, { ZodError, ZodType } from '@/utils/zod-mock';

export interface ValidationError {
  path: string;
  message: string;
}

export interface UseValidatedFormResult<T> {
  data: T | null;
  errors: ValidationError[];
  validateForm: (formData: unknown) => boolean;
  isValid: boolean;
  resetForm: () => void;
}

export function useValidatedForm<T>(schema: ZodType<T>, initialData: T | null = null): UseValidatedFormResult<T> {
  const [data, setData] = useState<T | null>(initialData);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isValid, setIsValid] = useState(false);

  const validateForm = useCallback(
    (formData: unknown): boolean => {
      try {
        const validData = schema.parse(formData);
        setData(validData);
        setErrors([]);
        setIsValid(true);
        return true;
      } catch (error) {
        if (error instanceof ZodError) {
          const formattedErrors = error.errors.map((err) => ({
            path: err.path.join('.'),
            message: err.message,
          }));
          setErrors(formattedErrors);
          setIsValid(false);
          return false;
        }
        setErrors([{ path: '', message: 'An unknown validation error occurred' }]);
        setIsValid(false);
        return false;
      }
    },
    [schema]
  );

  const resetForm = useCallback(() => {
    setData(initialData);
    setErrors([]);
    setIsValid(false);
  }, [initialData]);

  return {
    data,
    errors,
    validateForm,
    isValid,
    resetForm,
  };
}
