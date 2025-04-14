
/**
 * CSRF Protection Utilities
 * Provides CSRF token generation and validation
 */
import logger from '@/utils/logger';

// Storage key for CSRF token
const CSRF_TOKEN_KEY = 'app_csrf_token';
const CSRF_HEADER_NAME = 'X-CSRF-Token';

/**
 * Generate a CSRF token
 * @returns Generated CSRF token
 */
export function generateCsrfToken(): string {
  const token = `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
  
  try {
    // Store in session storage (preferred) or localStorage as fallback
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(CSRF_TOKEN_KEY, token);
    } else if (typeof localStorage !== 'undefined') {
      localStorage.setItem(CSRF_TOKEN_KEY, token);
    }
  } catch (error) {
    logger.error('Failed to store CSRF token', { error });
  }
  
  return token;
}

/**
 * Get the stored CSRF token
 * @returns Stored CSRF token or null if not found
 */
export function getCsrfToken(): string | null {
  try {
    // Try sessionStorage first, then localStorage
    let token: string | null = null;
    
    if (typeof sessionStorage !== 'undefined') {
      token = sessionStorage.getItem(CSRF_TOKEN_KEY);
    }
    
    if (!token && typeof localStorage !== 'undefined') {
      token = localStorage.getItem(CSRF_TOKEN_KEY);
    }
    
    if (!token) {
      // Generate new token if none exists
      token = generateCsrfToken();
    }
    
    return token;
  } catch (error) {
    logger.error('Failed to retrieve CSRF token', { error });
    return null;
  }
}

/**
 * Validate a CSRF token against the stored token
 * @param token Token to validate
 * @returns Whether the token is valid
 */
export function validateCsrfToken(token: string): boolean {
  const storedToken = getCsrfToken();
  return !!storedToken && token === storedToken;
}

/**
 * Add CSRF token to request headers
 * @param headers Existing headers object
 * @returns Headers with CSRF token added
 */
export function addCSRFToHeaders(
  headers: Record<string, string> | Headers = {}
): Record<string, string> | Headers {
  const token = getCsrfToken();
  
  if (!token) {
    logger.warn('No CSRF token available for request');
    return headers;
  }
  
  // Add token to headers
  if (headers instanceof Headers) {
    headers.append(CSRF_HEADER_NAME, token);
    return headers;
  } else {
    return {
      ...headers,
      [CSRF_HEADER_NAME]: token
    };
  }
}

/**
 * Add CSRF token to form data
 * @param formData Form data to augment
 * @returns Form data with CSRF token added
 */
export function addCSRFToFormData(formData: FormData): FormData {
  const token = getCsrfToken();
  
  if (!token) {
    logger.warn('No CSRF token available for form submission');
    return formData;
  }
  
  // Add token to form data
  formData.append('csrf_token', token);
  return formData;
}

/**
 * Get HTML for a CSRF input field
 * @returns HTML string for CSRF input
 */
export function getCsrfInputHtml(): string {
  const token = getCsrfToken();
  
  if (!token) {
    logger.warn('No CSRF token available for form');
    return '';
  }
  
  return `<input type="hidden" name="csrf_token" value="${token}">`;
}
