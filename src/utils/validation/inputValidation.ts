
interface InputValidationResult {
  valid: boolean;
  errors?: string[];
  severity?: 'error' | 'warning' | 'info'; // Add optional severity property
}

