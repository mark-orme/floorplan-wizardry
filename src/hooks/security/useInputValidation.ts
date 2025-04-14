
/**
 * Input Validation Hook
 * Provides Zod-based validation for user inputs
 */
import { useState, useCallback } from 'react';
import { ZodSchema, ZodError } from 'zod';
import { sanitizeHtml } from '@/utils/security/htmlSanitization';
import logger from '@/utils/logger';

interface ValidationResult<T> {
  /** Whether the input is valid */
  isValid: boolean;
  /** Validation error messages */
  errors: Record<string, string[]>;
  /** Sanitized and validated data */
  data: T | null;
  /** Validate a specific field */
  validateField: (field: keyof T, value: any) => boolean;
  /** Reset validation state */
  reset: () => void;
}

/**
 * Hook for validating and sanitizing user input using Zod
 * @param schema Zod schema for validation
 */
export function useInputValidation<T>(schema: ZodSchema<T>): [
  (data: unknown) => ValidationResult<T>,
  ValidationResult<T>
] {
  const [validationResult, setValidationResult] = useState<ValidationResult<T>>({
    isValid: true,
    errors: {},
    data: null,
    validateField: () => true,
    reset: () => {}
  });
  
  // Function to sanitize string values in an object
  const sanitizeData = (data: any): any => {
    if (!data) return data;
    
    if (typeof data === 'string') {
      return sanitizeHtml(data);
    }
    
    if (Array.isArray(data)) {
      return data.map(item => sanitizeData(item));
    }
    
    if (typeof data === 'object' && data !== null) {
      const sanitized: Record<string, any> = {};
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          sanitized[key] = sanitizeData(data[key]);
        }
      }
      return sanitized;
    }
    
    return data;
  };
  
  const validateField = useCallback((field: keyof T, value: any): boolean => {
    try {
      // Create a partial schema for just this field
      // Use the safeParse method instead of trying to access schema.shape
      const partialData = { [field as string]: value } as Partial<T>;
      
      // Using safeParse to validate just this field's data
      const result = schema.safeParse(partialData);
      const isValid = result.success;
      
      // Update the errors state based on validation result
      if (isValid) {
        setValidationResult(prev => ({
          ...prev,
          errors: {
            ...prev.errors,
            [field as string]: []
          }
        }));
        return true;
      } else {
        const zodError = result.error;
        const fieldErrors = zodError.errors
          .filter(err => err.path[0] === field)
          .map(err => err.message);
        
        setValidationResult(prev => ({
          ...prev,
          errors: {
            ...prev.errors,
            [field as string]: fieldErrors
          }
        }));
        return false;
      }
    } catch (error) {
      logger.error('Error validating field', { field, error });
      return false;
    }
  }, [schema]);
  
  const reset = useCallback(() => {
    setValidationResult({
      isValid: true,
      errors: {},
      data: null,
      validateField,
      reset: () => {}
    });
  }, [validateField]);
  
  const validate = useCallback((data: unknown): ValidationResult<T> => {
    // Sanitize input data
    const sanitizedData = sanitizeData(data);
    
    try {
      // Validate with Zod schema
      const result = schema.safeParse(sanitizedData);
      
      if (result.success) {
        const validResult = {
          isValid: true,
          errors: {},
          data: result.data,
          validateField,
          reset
        };
        
        setValidationResult(validResult);
        return validResult;
      } else {
        // Format ZodError into field-specific error messages
        const formattedErrors: Record<string, string[]> = {};
        
        result.error.errors.forEach(err => {
          const field = String(err.path[0]);
          if (!formattedErrors[field]) {
            formattedErrors[field] = [];
          }
          formattedErrors[field].push(err.message);
        });
        
        logger.warn('Input validation error', {
          errors: formattedErrors,
          invalidData: sanitizedData
        });
        
        const errorResult = {
          isValid: false,
          errors: formattedErrors,
          data: null,
          validateField,
          reset
        };
        
        setValidationResult(errorResult);
        return errorResult;
      }
    } catch (error) {
      // Handle unexpected errors
      logger.error('Unexpected validation error', { error });
      
      const errorResult = {
        isValid: false,
        errors: { _general: ['An unexpected error occurred during validation'] },
        data: null,
        validateField,
        reset
      };
      
      setValidationResult(errorResult);
      return errorResult;
    }
  }, [schema, validateField, reset]);
  
  return [validate, validationResult];
}

export default useInputValidation;
