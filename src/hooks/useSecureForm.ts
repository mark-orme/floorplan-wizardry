import { useState, useCallback } from 'react';
import * as z from 'zod';
import { toast } from 'sonner';

interface FormField {
  value: string;
  error: string | null;
  touched: boolean;
}

interface FormState<T extends Record<string, FormField>> {
  fields: T;
  isValid: boolean;
  isSubmitting: boolean;
}

interface UseSecureFormOptions<T> {
  initialValues: Record<string, string>;
  validationSchema?: z.ZodType<T>;
  onSubmit?: (values: T) => Promise<void> | void;
  validateOnChange?: boolean;
}

export function useSecureForm<T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit,
  validateOnChange = true
}: UseSecureFormOptions<T>) {
  // Initialize form fields
  const initialFields = Object.entries(initialValues).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: { value, error: null, touched: false }
    }),
    {} as Record<string, FormField>
  );

  const [formState, setFormState] = useState<FormState<Record<string, FormField>>>({
    fields: initialFields,
    isValid: false,
    isSubmitting: false
  });

  // Function to validate the entire form
  const validateForm = useCallback(() => {
    if (!validationSchema) return true;

    const values = Object.entries(formState.fields).reduce(
      (acc, [key, field]) => ({
        ...acc,
        [key]: field.value
      }),
      {} as Record<string, string>
    );

    try {
      validationSchema.parse(values);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newFields = { ...formState.fields };
        
        error.errors.forEach((err) => {
          const field = err.path[0];
          if (field && typeof field === 'string' && field in newFields) {
            newFields[field] = {
              ...newFields[field],
              error: err.message
            };
          }
        });
        
        setFormState((prev) => ({
          ...prev,
          fields: newFields,
          isValid: false
        }));
      }
      return false;
    }
  }, [formState.fields, validationSchema]);

  // Function to update field value
  const handleChange = useCallback(
    (name: string, value: string) => {
      setFormState((prev) => {
        const newFields = {
          ...prev.fields,
          [name]: {
            ...prev.fields[name],
            value,
            touched: true,
            error: validateOnChange ? prev.fields[name].error : null
          }
        };
        
        return {
          ...prev,
          fields: newFields
        };
      });
      
      if (validateOnChange) {
        setTimeout(validateForm, 0);
      }
    },
    [validateForm, validateOnChange]
  );

  // Function to handle blur events
  const handleBlur = useCallback(
    (name: string) => {
      setFormState((prev) => ({
        ...prev,
        fields: {
          ...prev.fields,
          [name]: {
            ...prev.fields[name],
            touched: true
          }
        }
      }));
      
      validateForm();
    },
    [validateForm]
  );

  // Function to handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      
      setFormState((prev) => ({
        ...prev,
        isSubmitting: true
      }));
      
      // Mark all fields as touched
      const touchedFields = Object.entries(formState.fields).reduce(
        (acc, [key, field]) => ({
          ...acc,
          [key]: { ...field, touched: true }
        }),
        {} as Record<string, FormField>
      );
      
      setFormState((prev) => ({
        ...prev,
        fields: touchedFields
      }));
      
      const isValid = validateForm();
      
      if (isValid && onSubmit) {
        const values = Object.entries(formState.fields).reduce(
          (acc, [key, field]) => ({
            ...acc,
            [key]: field.value
          }),
          {} as T
        );
        
        try {
          await onSubmit(values);
          toast.success('Form submitted successfully');
        } catch (error) {
          console.error('Form submission error:', error);
          toast.error('Form submission failed');
        }
      } else {
        toast.error('Please correct the errors in the form');
      }
      
      setFormState((prev) => ({
        ...prev,
        isSubmitting: false
      }));
    },
    [formState.fields, onSubmit, validateForm]
  );

  return {
    fields: formState.fields,
    isValid: formState.isValid,
    isSubmitting: formState.isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    validateForm,
    resetForm: useCallback(() => {
      setFormState({
        fields: initialFields,
        isValid: false,
        isSubmitting: false
      });
    }, [initialFields])
  };
}
