
/**
 * Validated Form Hook
 * Provides form handling with enhanced validation
 */
import { useState, useCallback, useEffect } from 'react';
import { z } from 'zod';
import { validateWithSchema, sanitizeObject } from '@/utils/validation/validatorService';
import logger from '@/utils/logger';

export interface ValidationErrors {
  [key: string]: string[];
}

export interface FormState<T extends Record<string, any>> {
  values: Partial<T>;
  errors: ValidationErrors;
  touched: Record<string, boolean>;
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
}

export interface ValidatedFormOptions<T extends Record<string, any>> {
  initialValues?: Partial<T>;
  schema: z.ZodSchema<T>;
  onSubmit?: (values: T) => Promise<void> | void;
  onValidationError?: (errors: ValidationErrors) => void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  sanitizeValues?: boolean;
}

/**
 * Hook for handling forms with comprehensive validation
 * 
 * @param options Form configuration options
 */
export function useValidatedForm<T extends Record<string, any>>(options: ValidatedFormOptions<T>) {
  const {
    initialValues = {} as Partial<T>,
    schema,
    onSubmit,
    onValidationError,
    validateOnChange = true,
    validateOnBlur = true,
    sanitizeValues = true
  } = options;
  
  // Form state
  const [formState, setFormState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isValid: false,
    isSubmitting: false,
    isDirty: false
  });
  
  // Validate the entire form
  const validateForm = useCallback((values: Partial<T>): ValidationErrors => {
    const result = validateWithSchema(schema, values, {
      sanitize: sanitizeValues,
      logErrors: false
    });
    
    return result.valid ? {} : (result.errors || {});
  }, [schema, sanitizeValues]);
  
  // Set a field value
  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setFormState(prev => {
      // Update values and mark as dirty
      const newValues = { ...prev.values, [field]: value };
      const newTouched = { ...prev.touched, [String(field)]: true };
      
      // Validate if needed
      const newErrors = validateOnChange
        ? validateForm(newValues)
        : prev.errors;
      
      return {
        values: newValues,
        errors: newErrors,
        touched: newTouched,
        isValid: Object.keys(newErrors).length === 0,
        isSubmitting: prev.isSubmitting,
        isDirty: true
      };
    });
  }, [validateForm, validateOnChange]);
  
  // Handle field blur
  const handleBlur = useCallback((field: keyof T) => {
    setFormState(prev => {
      // Mark field as touched
      const newTouched = { ...prev.touched, [String(field)]: true };
      
      // Validate if needed
      const newErrors = validateOnBlur 
        ? validateForm(prev.values)
        : prev.errors;
      
      return {
        ...prev,
        touched: newTouched,
        errors: newErrors,
        isValid: Object.keys(newErrors).length === 0
      };
    });
  }, [validateForm, validateOnBlur]);
  
  // Reset the form to initial values
  const resetForm = useCallback(() => {
    setFormState({
      values: initialValues,
      errors: {},
      touched: {},
      isValid: false,
      isSubmitting: false,
      isDirty: false
    });
  }, [initialValues]);
  
  // Handle form submission
  const submitForm = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    setFormState(prev => ({ ...prev, isSubmitting: true }));
    
    // Validate the form
    const errors = validateForm(formState.values);
    const isValid = Object.keys(errors).length === 0;
    
    if (isValid) {
      try {
        // Sanitize values before submission if enabled
        const valuesToSubmit = sanitizeValues
          ? sanitizeObject(formState.values as Record<string, any>) as T
          : formState.values as T;
        
        // Submit if handler provided
        if (onSubmit) {
          await onSubmit(valuesToSubmit as T);
        }
      } catch (error) {
        logger.error('Form submission error', { error });
      }
    } else {
      // Call validation error handler if provided
      if (onValidationError) {
        onValidationError(errors);
      }
      
      // Mark all fields as touched
      const allTouched: Record<string, boolean> = {};
      Object.keys(formState.values).forEach(key => {
        allTouched[key] = true;
      });
      
      setFormState(prev => ({
        ...prev,
        errors,
        touched: allTouched,
        isValid: false,
        isSubmitting: false
      }));
    }
    
    setFormState(prev => ({ ...prev, isSubmitting: false }));
  }, [formState.values, onSubmit, onValidationError, validateForm, sanitizeValues]);
  
  // Get field props for binding to inputs
  const getFieldProps = useCallback((field: keyof T) => ({
    id: String(field),
    name: String(field),
    value: formState.values[field] || '',
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
      setFieldValue(field, e.target.value),
    onBlur: () => handleBlur(field),
    'aria-invalid': !!(formState.touched[String(field)] && formState.errors[String(field)]),
    'aria-describedby': formState.errors[String(field)] ? `${String(field)}-error` : undefined
  }), [formState.errors, formState.touched, formState.values, handleBlur, setFieldValue]);
  
  // Initial validation
  useEffect(() => {
    const errors = validateForm(initialValues);
    const isValid = Object.keys(errors).length === 0;
    
    setFormState(prev => ({
      ...prev,
      errors,
      isValid
    }));
  }, [initialValues, validateForm]);
  
  return {
    ...formState,
    setFieldValue,
    handleBlur,
    resetForm,
    submitForm,
    getFieldProps,
    // Shorthand for form submission
    handleSubmit: submitForm
  };
}

export default useValidatedForm;
