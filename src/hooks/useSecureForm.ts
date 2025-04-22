
/**
 * useSecureForm hook
 * Provides form handling with built-in security and validation
 */
import { useState, useCallback } from 'react';
import * as z from 'zod';
import { validateAndSanitize } from '@/utils/validation/typeValidation';
import { sanitizeHtml } from '@/utils/security/inputSanitization';

type FieldErrors = Record<string, string[]>;

interface SecureFormState<T> {
  data: Partial<T>;
  errors: FieldErrors;
  touched: Record<string, boolean>;
  isValid: boolean;
  isSubmitting: boolean;
}

interface SecureFormOptions<T> {
  initialValues?: Partial<T>;
  onSubmit?: (data: T) => Promise<void> | void;
  onValidationError?: (errors: FieldErrors) => void;
}

/**
 * Hook for handling forms with built-in security and validation
 * @param schema Zod schema for form validation
 * @param options Form configuration options
 * @returns Form state and handlers
 */
export function useSecureForm<T>(
  schema: z.ZodSchema<T>,
  options: SecureFormOptions<T> = {}
) {
  const { initialValues = {}, onSubmit, onValidationError } = options;
  
  // Form state
  const [state, setState] = useState<SecureFormState<T>>({
    data: initialValues,
    errors: {},
    touched: {},
    isValid: false,
    isSubmitting: false
  });
  
  // Update a form field with sanitization
  const setField = useCallback((field: keyof T, value: any) => {
    setState(prev => {
      // Sanitize string values
      const sanitizedValue = typeof value === 'string' ? sanitizeHtml(value) : value;
      
      // Update data and mark field as touched
      const newData = { ...prev.data, [field]: sanitizedValue };
      const newTouched = { ...prev.touched, [field]: true };
      
      // Validate the form with the new data
      const result = validateAndSanitize(schema, newData);
      
      // Extract field-specific errors if validation failed
      let newErrors: FieldErrors = {};
      if (!result.success && result.errors) {
        result.errors.errors.forEach(err => {
          const fieldName = err.path.join('.') || field.toString();
          if (!newErrors[fieldName]) {
            newErrors[fieldName] = [];
          }
          newErrors[fieldName].push(err.message);
        });
      }
      
      return {
        data: newData,
        errors: newErrors,
        touched: newTouched,
        isValid: result.success,
        isSubmitting: prev.isSubmitting
      };
    });
  }, [schema]);
  
  // Handle form submission
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    setState(prev => ({ ...prev, isSubmitting: true }));
    
    // Validate all fields
    const result = validateAndSanitize(schema, state.data);
    
    if (result.success && result.data) {
      // Form is valid, call submit handler
      try {
        if (onSubmit) {
          await onSubmit(result.data);
        }
      } catch (error) {
        console.error('Form submission error:', error);
      }
    } else {
      // Form is invalid, extract errors
      let newErrors: FieldErrors = {};
      
      if (result.errors) {
        result.errors.errors.forEach(err => {
          const fieldName = err.path.join('.') || 'form';
          if (!newErrors[fieldName]) {
            newErrors[fieldName] = [];
          }
          newErrors[fieldName].push(err.message);
        });
      }
      
      // Mark all fields as touched
      const allTouched: Record<string, boolean> = {};
      Object.keys(state.data).forEach(key => {
        allTouched[key] = true;
      });
      
      // Update state with errors
      setState(prev => ({
        ...prev,
        errors: newErrors,
        touched: allTouched,
        isValid: false,
        isSubmitting: false
      }));
      
      // Call error handler if provided
      if (onValidationError) {
        onValidationError(newErrors);
      }
    }
    
    setState(prev => ({ ...prev, isSubmitting: false }));
  }, [state.data, schema, onSubmit, onValidationError]);
  
  // Reset the form to initial values
  const resetForm = useCallback(() => {
    setState({
      data: initialValues,
      errors: {},
      touched: {},
      isValid: false,
      isSubmitting: false
    });
  }, [initialValues]);
  
  return {
    ...state,
    setField,
    handleSubmit,
    resetForm,
    // Helper to get field-specific props
    getFieldProps: (field: keyof T) => ({
      value: state.data[field] || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setField(field, e.target.value),
      onBlur: () => setState(prev => ({
        ...prev,
        touched: { ...prev.touched, [field]: true }
      })),
      error: state.touched[field as string] ? state.errors[field as string]?.[0] : undefined,
      'aria-invalid': state.touched[field as string] && !!state.errors[field as string]
    })
  };
}
