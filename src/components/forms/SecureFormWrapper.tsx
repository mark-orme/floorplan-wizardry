
/**
 * SecureFormWrapper Component
 * Wraps forms with security features like CSRF protection and input sanitization
 */
import React, { useEffect, useRef } from 'react';
import { Security, secureForm } from '@/utils/security';

interface SecureFormWrapperProps {
  children: React.ReactNode;
  onValidSubmit?: (data: Record<string, any>) => void;
  onInvalidSubmit?: (errors: Record<string, string[]>) => void;
  className?: string;
}

export const SecureFormWrapper: React.FC<SecureFormWrapperProps> = ({
  children,
  onValidSubmit,
  onInvalidSubmit,
  className
}) => {
  const formRef = useRef<HTMLFormElement>(null);

  // Apply security measures when the form mounts
  useEffect(() => {
    if (formRef.current) {
      secureForm(formRef.current);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formRef.current) return;
    
    // Get form data
    const formData = new FormData(formRef.current);
    const data: Record<string, any> = {};
    const errors: Record<string, string[]> = {};
    let hasErrors = false;
    
    // Process and validate each field
    formData.forEach((value, key) => {
      if (typeof value === 'string') {
        // Sanitize string inputs
        data[key] = Security.Input.sanitizeHtml(value);
        
        // Perform basic validation
        if (formRef.current) {
          const input = formRef.current.elements.namedItem(key) as HTMLInputElement;
          
          if (input && input.required && !value) {
            errors[key] = errors[key] || [];
            errors[key].push('This field is required');
            hasErrors = true;
          }
          
          if (input && input.type === 'email' && value && !/\S+@\S+\.\S+/.test(value)) {
            errors[key] = errors[key] || [];
            errors[key].push('Please enter a valid email address');
            hasErrors = true;
          }
        }
      } else {
        // Handle non-string values (like files)
        data[key] = value;
      }
    });
    
    // Call appropriate handler based on validation result
    if (hasErrors && onInvalidSubmit) {
      onInvalidSubmit(errors);
    } else if (onValidSubmit) {
      onValidSubmit(data);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className={className}>
      {children}
    </form>
  );
};
