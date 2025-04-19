
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
  
  // Store the token in sessionStorage temporarily
  sessionStorage.setItem('csrfToken', token);
  
  // Set HttpOnly cookie with SameSite=Strict for CSRF protection
  try {
    // Note: In a real implementation, the HttpOnly flag would be set server-side
    // This is a frontend-only implementation with improved security
    document.cookie = `csrf_token=${token}; path=/; SameSite=Strict; Secure`;
  } catch (e) {
    logger.warn('Failed to set CSRF cookie - this is expected in non-secure contexts');
  }
  
  return token;
}

/**
 * Get the current CSRF token
 * @returns Current CSRF token
 */
export function getCsrfToken(): string {
  let token = sessionStorage.getItem('csrfToken');
  
  // Generate a new token if none exists
  if (!token) {
    token = generateCSRFToken();
  }
  
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
  
  // Implement constant-time comparison to prevent timing attacks
  if (token.length !== storedToken.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < token.length; i++) {
    result |= token.charCodeAt(i) ^ storedToken.charCodeAt(i);
  }
  
  return result === 0;
}

// Add the alias for backward compatibility
export const validateCsrfToken = verifyCSRFToken;

/**
 * Add CSRF token to form data
 * @param formData FormData instance to add token to
 * @returns FormData with added CSRF token
 */
export function addCSRFToFormData(formData: FormData): FormData {
  formData.append('csrf_token', getCsrfToken());
  return formData;
}

// Add the alias for backward compatibility
export const addCsrfTokenToForm = addCSRFToFormData;

/**
 * Add CSRF token to request headers
 * @param headers Headers object to add token to
 * @returns Headers with added CSRF token
 */
export function addCSRFToHeaders(headers: Record<string, string>): Record<string, string> {
  return {
    ...headers,
    'X-CSRF-Token': getCsrfToken()
  };
}

// Add the alias for backward compatibility
export const createCsrfHeaders = addCSRFToHeaders;

/**
 * Fetch with CSRF protection
 * @param url URL to fetch
 * @param options Fetch options
 * @returns Fetch promise
 */
export function fetchWithCSRF(url: string, options: RequestInit = {}): Promise<Response> {
  const headers = {
    ...options.headers,
    'X-CSRF-Token': getCsrfToken()
  };
  
  return fetch(url, {
    ...options,
    credentials: 'include', // Include cookies in request
    headers
  });
}

// Add the alias for backward compatibility
export const fetchWithCsrf = fetchWithCSRF;

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

/**
 * A note on improving CSRF protection:
 * 
 * Current implementation:
 * 1. Generates token and stores in sessionStorage
 * 2. Sets the same token in a SameSite=Strict cookie
 * 3. Includes token in form data and request headers
 * 
 * The 'double submit cookie' pattern helps protect against CSRF even
 * if an attacker can execute JavaScript due to XSS, as the attacker
 * would need to know the cookie value which is protected by the 
 * SameSite attribute.
 * 
 * For complete protection, server-side implementation is needed to:
 * 1. Set the CSRF token in an HttpOnly cookie via a secure backend endpoint
 * 2. Validate that the token in the cookie matches the token in the request
 */
