
import { useCallback } from 'react';
import DOMPurify from 'dompurify';
import * as z from 'zod';

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
  const validateInput = useCallback(<T>(input: string, schema: z.ZodType<T>): { 
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
      const error = err instanceof z.ZodError 
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
  const createSchema = useCallback(<T extends z.ZodType>(type: T) => type, []);

  /**
   * Create form validation schema
   */
  const createFormSchema = useCallback(<T extends Record<string, z.ZodType>>(schema: T) => z.object(schema), []);

  return {
    sanitizeInput,
    validateInput,
    createSchema,
    createFormSchema
  };
};

export default useInputValidation;
