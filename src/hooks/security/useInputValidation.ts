
import { useCallback } from 'react';
import DOMPurify from 'dompurify';
import { ZodType } from 'zod';
import { ZodError } from '@/utils/zod-mock';

/**
 * Hook for input validation and sanitization
 */
export const useInputValidation = () => {
  /**
   * Sanitize a string input
   */
  const sanitizeInput = useCallback((input: string): string => {
    return DOMPurify.sanitize(input);
  }, []);

  /**
   * Validate a string against a schema
   */
  const validateInput = useCallback(<T>(input: string, schema: ZodType<T>): { 
    isValid: boolean; 
    value: T | null; 
    error: string | null 
  } => {
    try {
      const sanitized = sanitizeInput(input);
      const result = schema.parse(sanitized);
      return {
        isValid: true,
        value: result,
        error: null
      };
    } catch (err) {
      const error = err instanceof ZodError 
        ? err.errors.map(e => e.message).join(', ')
        : 'Validation error';
        
      return {
        isValid: false,
        value: null,
        error
      };
    }
  }, [sanitizeInput]);

  /**
   * Create a validation schema for common input types
   */
  const createSchema = useCallback(<T>(type: ZodType<T>) => type, []);

  /**
   * Create form validation schema
   */
  const createFormSchema = useCallback(<T extends Record<string, ZodType<any>>>(schema: T) => schema, []);

  return {
    sanitizeInput,
    validateInput,
    createSchema,
    createFormSchema
  };
};

export default useInputValidation;
