
/**
 * ValidatedInput Component
 * Input component with built-in validation
 */
import React from 'react';
import { Input } from '@/components/ui/input';
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { sanitizeHtml } from '@/utils/security/htmlSanitization';

interface ValidatedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  helperText?: string;
  error?: string;
  onValueChange?: (value: string) => void;
  sanitizeOnChange?: boolean;
  validateOnChange?: boolean;
  validateFn?: (value: string) => { valid: boolean; message?: string };
  showSuccess?: boolean;
}

/**
 * Input component with built-in validation and sanitization
 */
export const ValidatedInput = React.forwardRef<HTMLInputElement, ValidatedInputProps>(
  (props, ref) => {
    const {
      label,
      helperText,
      error,
      value,
      defaultValue,
      onValueChange,
      sanitizeOnChange = true,
      validateOnChange = true,
      validateFn,
      showSuccess = false,
      className,
      ...rest
    } = props;
    
    const [internalValue, setInternalValue] = React.useState(
      value !== undefined ? String(value) : (defaultValue ? String(defaultValue) : '')
    );
    
    const [internalError, setInternalError] = React.useState<string | undefined>(error);
    const [isValid, setIsValid] = React.useState(!error);
    const [isTouched, setIsTouched] = React.useState(false);
    
    // Sync with external value
    React.useEffect(() => {
      if (value !== undefined) {
        setInternalValue(String(value));
      }
    }, [value]);
    
    // Sync with external error
    React.useEffect(() => {
      setInternalError(error);
      setIsValid(!error);
    }, [error]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      
      // Sanitize if enabled
      const sanitizedValue = sanitizeOnChange ? sanitizeHtml(newValue) : newValue;
      setInternalValue(sanitizedValue);
      
      // Validate if enabled and function provided
      if (validateOnChange && validateFn) {
        const result = validateFn(sanitizedValue);
        setIsValid(result.valid);
        setInternalError(result.valid ? undefined : result.message);
      }
      
      // Call external handler
      if (onValueChange) {
        onValueChange(sanitizedValue);
      }
      
      setIsTouched(true);
    };
    
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      // Validate on blur
      if (validateFn) {
        const result = validateFn(internalValue);
        setIsValid(result.valid);
        setInternalError(result.valid ? undefined : result.message);
      }
      
      setIsTouched(true);
      
      // Call original onBlur if provided
      if (props.onBlur) {
        props.onBlur(e);
      }
    };
    
    const statusClass = React.useMemo(() => {
      if (!isTouched) return '';
      return internalError 
        ? 'border-destructive focus-visible:ring-destructive' 
        : (isValid && showSuccess ? 'border-success focus-visible:ring-success' : '');
    }, [internalError, isValid, isTouched, showSuccess]);
    
    const inputId = rest.id || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <FormItem className="w-full">
        {label && (
          <FormLabel htmlFor={inputId} className={internalError ? 'text-destructive' : ''}>
            {label}
          </FormLabel>
        )}
        
        <FormControl>
          <Input
            ref={ref}
            id={inputId}
            value={internalValue}
            onChange={handleChange}
            onBlur={handleBlur}
            className={cn(statusClass, className)}
            aria-invalid={!!internalError}
            aria-describedby={
              internalError 
                ? `${inputId}-error` 
                : (helperText ? `${inputId}-description` : undefined)
            }
            {...rest}
          />
        </FormControl>
        
        {helperText && !internalError && (
          <FormDescription id={`${inputId}-description`}>
            {helperText}
          </FormDescription>
        )}
        
        {internalError && (
          <FormMessage id={`${inputId}-error`}>
            {internalError}
          </FormMessage>
        )}
      </FormItem>
    );
  }
);

ValidatedInput.displayName = 'ValidatedInput';

export default ValidatedInput;
