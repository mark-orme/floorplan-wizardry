
/**
 * Validation Utilities
 * Provides a simple interface for validating data with Zod schemas
 */
import { z } from 'zod';
import { toast } from 'sonner';

/**
 * Result of a validation operation
 */
export interface ValidationResult<T> {
  success: boolean;
  data: T | null;
  errors: Record<string, string[]>;
}

/**
 * Options for validation
 */
export interface ValidationOptions {
  showToast?: boolean;
  errorPrefix?: string;
}

/**
 * Validate data against a Zod schema
 * 
 * @param schema Zod schema to validate against
 * @param data Data to validate
 * @param options Validation options
 * @returns Validation result
 * 
 * @example
 * ```ts
 * const userSchema = z.object({
 *   name: z.string().min(2),
 *   email: z.string().email()
 * });
 * 
 * const result = validate(userSchema, userData);
 * 
 * if (result.success) {
 *   // Use validated data
 *   saveUser(result.data);
 * } else {
 *   // Handle validation errors
 *   console.error(result.errors);
 * }
 * ```
 */
export function validate<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  options: ValidationOptions = {}
): ValidationResult<T> {
  const { showToast = false, errorPrefix = '' } = options;
  
  try {
    // Validate with schema
    const result = schema.safeParse(data);
    
    if (result.success) {
      return {
        success: true,
        data: result.data,
        errors: {}
      };
    } else {
      // Format errors
      const formattedErrors: Record<string, string[]> = {};
      
      result.error.errors.forEach(err => {
        const field = err.path.join('.') || '_root';
        
        if (!formattedErrors[field]) {
          formattedErrors[field] = [];
        }
        
        const message = errorPrefix ? `${errorPrefix}: ${err.message}` : err.message;
        formattedErrors[field].push(message);
      });
      
      // Show toast if requested
      if (showToast) {
        const errorCount = Object.values(formattedErrors).flat().length;
        const errorMessage = Object.values(formattedErrors).flat()[0] || 'Validation failed';
        
        toast.error(
          errorCount > 1 
            ? `${errorMessage} (and ${errorCount - 1} more errors)`
            : errorMessage
        );
      }
      
      return {
        success: false,
        data: null,
        errors: formattedErrors
      };
    }
  } catch (error) {
    // Handle unexpected errors
    const errorMessage = error instanceof Error ? error.message : 'Unexpected validation error';
    
    if (showToast) {
      toast.error(errorMessage);
    }
    
    return {
      success: false,
      data: null,
      errors: { _error: [errorMessage] }
    };
  }
}

/**
 * Validate a specific field with a schema
 * 
 * @param schema Schema for the field
 * @param value Field value
 * @param options Validation options
 * @returns Validation result for the field
 * 
 * @example
 * ```ts
 * const emailSchema = z.string().email();
 * 
 * const result = validateField(emailSchema, userEmail, {
 *   showToast: true,
 *   errorPrefix: 'Email'
 * });
 * ```
 */
export function validateField<T>(
  schema: z.ZodSchema<T>,
  value: unknown,
  options: ValidationOptions = {}
): ValidationResult<T> {
  return validate(schema, value, options);
}

/**
 * Create a validator function for a specific schema
 * 
 * @param schema Schema to create validator for
 * @param defaultOptions Default validation options
 * @returns Validator function
 * 
 * @example
 * ```ts
 * const userSchema = z.object({
 *   name: z.string(),
 *   email: z.string().email()
 * });
 * 
 * const validateUser = createValidator(userSchema);
 * 
 * // Later in the code:
 * const result = validateUser(userData);
 * ```
 */
export function createValidator<T>(
  schema: z.ZodSchema<T>,
  defaultOptions: ValidationOptions = {}
): (data: unknown, options?: ValidationOptions) => ValidationResult<T> {
  return (data: unknown, options: ValidationOptions = {}) => {
    return validate(schema, data, {
      ...defaultOptions,
      ...options
    });
  };
}
