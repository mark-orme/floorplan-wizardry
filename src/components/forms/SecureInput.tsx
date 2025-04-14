
/**
 * SecureInput Component
 * Text input component with built-in security features
 */
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Security } from '@/utils/security';

interface SecureInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  sanitize?: boolean;
  onSanitizedChange?: (value: string) => void;
}

export const SecureInput: React.FC<SecureInputProps> = ({
  label,
  error,
  sanitize = true,
  onSanitizedChange,
  onChange,
  id,
  className,
  ...props
}) => {
  const [value, setValue] = useState(props.defaultValue || props.value || '');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    
    // Sanitize input if enabled
    if (sanitize && typeof newValue === 'string') {
      newValue = Security.Input.sanitizeHtml(newValue);
    }
    
    setValue(newValue);
    
    // Call original onChange
    if (onChange) {
      onChange(e);
    }
    
    // Call sanitized change handler
    if (onSanitizedChange) {
      onSanitizedChange(newValue);
    }
  };
  
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
      )}
      
      <Input
        id={id}
        value={value}
        onChange={handleChange}
        className={className}
        aria-invalid={!!error}
        {...props}
      />
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};
