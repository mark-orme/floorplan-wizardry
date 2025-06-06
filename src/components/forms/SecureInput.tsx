
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { sanitizeHtml, stripJavaScriptEvents } from '@/utils/security/InputSanitizationUtils';

interface SecureInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  id?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  sanitizationStrategy?: 'strict' | 'basic' | 'allowHtml';
}

export const SecureInput: React.FC<SecureInputProps> = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  className,
  id,
  name,
  required = false,
  disabled = false,
  maxLength,
  sanitizationStrategy = 'basic'
}) => {
  const [rawValue, setRawValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setRawValue(inputValue);
    
    // Simple synchronous sanitization instead of async
    let sanitizedValue = inputValue;
    if (sanitizationStrategy === 'strict') {
      sanitizedValue = inputValue.replace(/[<>]/g, ''); // Remove < and > characters
    } else if (sanitizationStrategy === 'basic') {
      sanitizedValue = sanitizeHtml(inputValue); // Remove HTML tags
    } else if (sanitizationStrategy === 'allowHtml') {
      sanitizedValue = stripJavaScriptEvents(inputValue); // Remove script tags and events
    }
    
    onChange(sanitizedValue);
  };

  return (
    <Input
      type={type}
      value={rawValue}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
      id={id}
      name={name}
      required={required}
      disabled={disabled}
      maxLength={maxLength}
    />
  );
};

export default SecureInput;
