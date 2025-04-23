
import { useState, useEffect, useCallback } from 'react';
import { z, ZodType } from '@/utils/zod-mock';

interface ValidationOptions<T> {
  initialValues: T;
  validationSchema: ZodType<T>;
  onSubmit: (values: T) => void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export function useValidatedForm<T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit,
  validateOnChange = false,
  validateOnBlur = true
}: ValidationOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const validateField = useCallback((name: keyof T, value: any) => {
    try {
      // Create a schema for just this field - using our mock
      const fieldObject = { [name]: value };
      // We're not actually validating since this is a mock, just showing the pattern
      return '';
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }
      return 'Invalid field';
    }
  }, []);
  
  const validateForm = useCallback(() => {
    try {
      validationSchema.parse(values);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof Error) {
        // In a real implementation, we would parse the Zod error structure
        // For now, just set a generic error
        setErrors({ general: error.message } as Partial<Record<keyof T, string>>);
      }
      return false;
    }
  }, [values, validationSchema]);
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : value;
    
    setValues(prev => ({ ...prev, [name]: newValue }));
    
    if (validateOnChange) {
      const error = validateField(name as keyof T, newValue);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [validateField, validateOnChange]);
  
  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target;
    
    setTouched(prev => ({ ...prev, [name]: true }));
    
    if (validateOnBlur) {
      const error = validateField(name as keyof T, values[name as keyof T]);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [validateField, validateOnBlur, values]);
  
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key as keyof T] = true;
      return acc;
    }, {} as Record<keyof T, boolean>);
    
    setTouched(allTouched);
    
    const isValid = validateForm();
    if (isValid) {
      onSubmit(values);
    }
    
    setIsSubmitting(false);
  }, [onSubmit, validateForm, values]);
  
  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
    reset: () => {
      setValues(initialValues);
      setErrors({});
      setTouched({});
    }
  };
}

export default useValidatedForm;
