
interface InputValidationResult {
  valid: boolean;
  errors?: string[];
  severity?: 'error' | 'warning' | 'info'; // Add optional severity property
}

// Export the interface
export type { InputValidationResult };

// Add missing function exports
export const validateAndSanitizeForm = (form: any, schema: any) => {
  return { valid: true }; // Placeholder implementation
};

export const appSchemas = {
  // Define your schemas here
};

export const trackValidationFailure = (formName: string, errors: string[]) => {
  console.error(`Validation failed for ${formName}:`, errors);
};
