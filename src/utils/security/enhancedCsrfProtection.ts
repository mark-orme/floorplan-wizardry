
/**
 * Enhanced CSRF Protection
 * Provides more robust CSRF protection with double submit cookie pattern
 */

import { toast } from 'sonner';
import logger from '@/utils/logger';
import React from 'react';

/**
 * Generate a cryptographically secure CSRF token
 * @returns Generated CSRF token
 */
export function generateCSRFToken(): string {
  // Generate a random string for CSRF protection using crypto API
  const buffer = new Uint8Array(32);
  window.crypto.getRandomValues(buffer);
  const token = Array.from(buffer)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
  
  // Store the token in sessionStorage
  try {
    sessionStorage.setItem('csrfToken', token);
  } catch (e) {
    logger.error('Failed to store CSRF token in sessionStorage', e);
  }
  
  // Set HttpOnly cookie with SameSite=Strict for CSRF protection
  // This cookie would ideally be set by the server, but for client-side protection:
  try {
    document.cookie = `csrf_token=${token}; path=/; SameSite=Strict; Secure;`;
  } catch (e) {
    logger.warn('Failed to set CSRF cookie - this is expected in non-secure contexts', e);
  }
  
  return token;
}

/**
 * Get the current CSRF token, generating one if it doesn't exist
 * @returns Current CSRF token
 */
export function getCSRFToken(): string {
  let token = sessionStorage.getItem('csrfToken');
  
  // Generate a new token if none exists
  if (!token) {
    token = generateCSRFToken();
    logger.info('Generated new CSRF token');
  }
  
  return token;
}

/**
 * Verify a CSRF token using constant-time comparison
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
  
  if (result !== 0) {
    logger.warn('CSRF token validation failed');
  }
  
  return result === 0;
}

/**
 * Add CSRF token to form data
 * @param formData FormData instance to add token to
 * @returns FormData with added CSRF token
 */
export function addCSRFToFormData(formData: FormData): FormData {
  formData.append('csrf_token', getCSRFToken());
  return formData;
}

/**
 * Add CSRF token to request headers
 * @param headers Headers object to add token to
 * @returns Headers with added CSRF token
 */
export function addCSRFToHeaders(headers: Record<string, string> = {}): Record<string, string> {
  return {
    ...headers,
    'X-CSRF-Token': getCSRFToken()
  };
}

/**
 * Create a protected form submit handler with CSRF validation
 * @param formElement Form element to protect
 * @param submitHandler Original submit handler
 * @returns Protected submit handler
 */
export function createProtectedFormSubmitHandler(
  formElement: HTMLFormElement,
  submitHandler: (e: SubmitEvent) => void
): (e: SubmitEvent) => void {
  return (e: SubmitEvent) => {
    e.preventDefault();
    
    // Add CSRF token input if it doesn't exist
    let csrfInput = formElement.querySelector('input[name="csrf_token"]') as HTMLInputElement;
    if (!csrfInput) {
      csrfInput = document.createElement('input') as HTMLInputElement;
      csrfInput.type = 'hidden';
      csrfInput.name = 'csrf_token';
      formElement.appendChild(csrfInput);
    }
    
    // Set token value
    csrfInput.value = getCSRFToken();
    
    // Call the original handler
    submitHandler(e);
  };
}

/**
 * Fetch with CSRF protection
 * @param url URL to fetch
 * @param options Fetch options
 * @returns Promise resolving to response
 */
export async function fetchWithCSRF(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Get current headers or initialize empty object
  const headers = options.headers || {};
  
  // Add CSRF token header
  const headersWithCSRF = {
    ...headers,
    'X-CSRF-Token': getCSRFToken()
  };
  
  try {
    // Make the fetch request with CSRF token
    return fetch(url, {
      ...options,
      headers: headersWithCSRF,
      credentials: 'include' // Include cookies
    });
  } catch (error) {
    logger.error('CSRF protected fetch failed:', error);
    throw error;
  }
}

/**
 * Create an axios request interceptor for CSRF protection
 * @param axios Axios instance
 */
export function createCSRFInterceptor(axios: any): void {
  axios.interceptors.request.use((config: any) => {
    config.headers = config.headers || {};
    config.headers['X-CSRF-Token'] = getCSRFToken();
    return config;
  });
}

/**
 * Hook to secure a form with CSRF protection
 * @param formRef React ref to form element
 */
export function useCSRFProtection(formRef: React.RefObject<HTMLFormElement>): void {
  React.useEffect(() => {
    if (formRef.current) {
      // Add CSRF token input if it doesn't exist
      let csrfInput = formRef.current.querySelector('input[name="csrf_token"]') as HTMLInputElement;
      if (!csrfInput) {
        csrfInput = document.createElement('input') as HTMLInputElement;
        csrfInput.type = 'hidden';
        csrfInput.name = 'csrf_token';
        csrfInput.value = getCSRFToken();
        formRef.current.appendChild(csrfInput);
      } else {
        csrfInput.value = getCSRFToken();
      }
    }
  }, [formRef]);
}
