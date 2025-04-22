import { useState, useCallback } from 'react';
import { z, type ZodError } from 'zod';

export interface UseSecureFormOptions<T> {
  schema: z.ZodType<T>;
  initialValues: T;
  onSubmit: (values: T) => void | Promise<void>;
  sanitize?: (values: T) => T;
}

export interface UseSecureFormResult<T> {
  values: T;
  errors: Record<string, string>;
  isSubmitting: boolean;
  submitted: boolean;
  handleChange: (name: keyof T, value: any) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  reset: () => void;
  setFieldError: (name: keyof T, error: string) => void;
}

/**
 * Custom hook for creating secure forms with validation and sanitization
 */
export function useSecureForm<T extends Record<string, any>>({
  schema,
  initialValues,
  onSubmit,
  sanitize = (values) => values
}: UseSecureFormOptions<T>): UseSecureFormResult<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = useCallback((name: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    
    // Clear the error for this field when it's changed
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name as string];
      return newErrors;
    });
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      setSubmitted(true);

      try {
        // Sanitize values before validation
        const sanitizedValues = sanitize(values);
        
        // Validate with Zod
        schema.parse(sanitizedValues);
        
        // Call onSubmit if validation passes
        await onSubmit(sanitizedValues);
        
        // Clear errors after successful submission
        setErrors({});
      } catch (error) {
        if (error instanceof ZodError) {
          // Format Zod errors into a user-friendly format
          const formattedErrors: Record<string, string> = {};
          error.errors.forEach((err) => {
            const path = err.path.join('.');
            formattedErrors[path] = err.message;
          });
          setErrors(formattedErrors);
        } else {
          // Handle other errors
          console.error('Form submission error:', error);
          setErrors({ 
            _form: 'An unexpected error occurred. Please try again.' 
          });
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [schema, values, onSubmit, sanitize]
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setSubmitted(false);
  }, [initialValues]);

  const setFieldError = useCallback((name: keyof T, error: string) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  return {
    values,
    errors,
    isSubmitting,
    submitted,
    handleChange,
    handleSubmit,
    reset,
    setFieldError
  };
}
