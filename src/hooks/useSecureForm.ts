
import { useState, useCallback } from 'react';
import { sanitizeHtml, sanitizeObject } from '@/utils/security/inputSanitization';
import z, { ZodType } from '@/utils/zod-mock';

interface UseSecureFormOptions<T> {
  initialValues: T;
  onSubmit: (values: T) => void;
  sanitize?: boolean;
  validationSchema?: ZodType<T>;
}

export function useSecureForm<T extends Record<string, any>>({
  initialValues,
  onSubmit,
  sanitize = true,
  validationSchema
}: UseSecureFormOptions<T>) {
  const [formValues, setFormValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = useCallback((field: keyof T, value: any) => {
    // Sanitize input if enabled
    const sanitizedValue = sanitize && typeof value === 'string' 
      ? sanitizeHtml(value)
      : value;
    
    setFormValues(prev => ({ ...prev, [field]: sanitizedValue }));
    
    // Clear error when field is edited
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors, sanitize]);
  
  const validateForm = useCallback(() => {
    if (!validationSchema) return true;
    
    try {
      validationSchema.parse(formValues);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof Error) {
        // Handle validation errors
        const newErrors: Partial<Record<keyof T, string>> = {};
        // In a real implementation, we would parse the Zod error structure
        // For now, just set a generic error
        newErrors.general = error.message;
        setErrors(newErrors);
      }
      return false;
    }
  }, [formValues, validationSchema]);
  
  const handleSubmit = useCallback((e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    setIsSubmitting(true);
    
    // Validate before submission
    const isValid = validateForm();
    
    if (isValid) {
      // Final sanitization of all values before submission
      const finalValues = sanitize 
        ? sanitizeObject(formValues) as T
        : formValues;
      
      // Submit form
      onSubmit(finalValues);
    }
    
    setIsSubmitting(false);
  }, [formValues, onSubmit, sanitize, validateForm]);
  
  return {
    formValues,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    validateForm,
    setFormValues,
    reset: () => setFormValues(initialValues)
  };
}

export default useSecureForm;
