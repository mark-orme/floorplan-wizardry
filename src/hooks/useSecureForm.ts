
import { useState, useCallback } from 'react';
import z, { ZodError, ZodType } from '@/utils/zod-mock';

export interface ValidationError {
  path: string;
  message: string;
}

export interface UseSecureFormResult<T> {
  data: T | null;
  errors: ValidationError[];
  validateForm: (formData: unknown) => boolean;
  isValid: boolean;
  resetForm: () => void;
  sanitizedData: T | null;
}

export function useSecureForm<T>(schema: ZodType<T>, initialData: T | null = null): UseSecureFormResult<T> {
  const [data, setData] = useState<T | null>(initialData);
  const [sanitizedData, setSanitizedData] = useState<T | null>(initialData);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isValid, setIsValid] = useState(false);

  const sanitizeData = useCallback((data: T): T => {
    // Implement sanitization logic
    // For example, strip HTML tags from string fields
    return data;
  }, []);

  const validateForm = useCallback(
    (formData: unknown): boolean => {
      try {
        const validData = schema.parse(formData);
        const cleanData = sanitizeData(validData);
        
        setData(validData);
        setSanitizedData(cleanData);
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
    [schema, sanitizeData]
  );

  const resetForm = useCallback(() => {
    setData(initialData);
    setSanitizedData(initialData);
    setErrors([]);
    setIsValid(false);
  }, [initialData]);

  return {
    data,
    sanitizedData,
    errors,
    validateForm,
    isValid,
    resetForm,
  };
}
