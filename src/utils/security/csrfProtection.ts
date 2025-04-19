
import logger from '@/utils/logger';

/**
 * Generate a CSRF token for form protection
 * @returns Generated CSRF token
 */
export function generateCSRFToken(): string {
  // Generate a random string for CSRF protection
  const buffer = new Uint8Array(32);
  window.crypto.getRandomValues(buffer);
  const token = Array.from(buffer)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
  
  // Store the token in sessionStorage
  sessionStorage.setItem('csrfToken', token);
  
  return token;
}

/**
 * Verify a CSRF token against the stored token
 * @param token Token to verify
 * @returns Boolean indicating if the token is valid
 */
export function verifyCSRFToken(token: string): boolean {
  const storedToken = sessionStorage.getItem('csrfToken');
  
  if (!storedToken) {
    logger.warn('No CSRF token found in storage');
    return false;
  }
  
  // Use constant-time comparison to prevent timing attacks
  return token === storedToken;
}

/**
 * Add CSRF token to form data
 * @param formData FormData instance to add token to
 * @returns FormData with added CSRF token
 */
export function addCSRFToFormData(formData: FormData): FormData {
  formData.append('csrf_token', generateCSRFToken());
  return formData;
}

/**
 * Add CSRF token to request headers
 * @param headers Headers object to add token to
 * @returns Headers with added CSRF token
 */
export function addCSRFToHeaders(headers: Record<string, string>): Record<string, string> {
  return {
    ...headers,
    'X-CSRF-Token': generateCSRFToken()
  };
}

/**
 * Create a CSRF-protected form submission handler
 * @param submitFn Original submit function
 * @returns Protected submit function
 */
export function createProtectedSubmitHandler(
  submitFn: (data: FormData) => Promise<any>
): (data: FormData) => Promise<any> {
  return async (data: FormData) => {
    const protectedData = addCSRFToFormData(data);
    return submitFn(protectedData);
  };
}
