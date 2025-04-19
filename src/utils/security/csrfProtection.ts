
/**
 * CSRF Protection Utilities
 * Provides utilities for generating and validating CSRF tokens
 */

import { v4 as uuidv4 } from 'uuid';
import logger from '@/utils/logger';

// Store CSRF token in sessionStorage for better security than localStorage
const CSRF_TOKEN_KEY = 'CSRF_TOKEN';

/**
 * Generate a new CSRF token and store it
 * @returns The generated CSRF token
 */
export const generateCsrfToken = (): string => {
  try {
    // Generate a cryptographically strong random token
    const token = uuidv4();
    
    // Store in sessionStorage (better than localStorage for CSRF tokens)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(CSRF_TOKEN_KEY, token);
    }
    
    return token;
  } catch (error) {
    logger.error('Failed to generate CSRF token', { error });
    return '';
  }
};

/**
 * Get the stored CSRF token
 * @returns The stored CSRF token or generates a new one if not found
 */
export const getCsrfToken = (): string => {
  if (typeof window === 'undefined') return '';
  
  const storedToken = sessionStorage.getItem(CSRF_TOKEN_KEY);
  if (storedToken) return storedToken;
  
  // Generate a new token if none exists
  return generateCsrfToken();
};

/**
 * Validate a CSRF token against the stored token
 * @param token The token to validate
 * @returns Whether the token is valid
 */
export const validateCsrfToken = (token: string): boolean => {
  if (typeof window === 'undefined') return false;
  if (!token) return false;
  
  const storedToken = sessionStorage.getItem(CSRF_TOKEN_KEY);
  return token === storedToken;
};

/**
 * Add CSRF token to a form element
 * @param form The form element to add the token to
 */
export const addCsrfTokenToForm = (form: HTMLFormElement): void => {
  if (!form) return;
  
  // Remove any existing CSRF token input
  const existingInput = form.querySelector('input[name="csrf_token"]');
  if (existingInput) {
    existingInput.remove();
  }
  
  // Create a new hidden input for the CSRF token
  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = 'csrf_token';
  input.value = getCsrfToken();
  
  // Add the input to the form
  form.appendChild(input);
};

/**
 * Add CSRF token to headers
 * @param headers Headers object or plain object to add the token to
 * @returns Headers with CSRF token added
 */
export const addCSRFToHeaders = (headers: HeadersInit = {}): Headers | Record<string, string> => {
  const token = getCsrfToken();
  
  if (headers instanceof Headers) {
    const newHeaders = new Headers(headers);
    newHeaders.append('X-CSRF-Token', token);
    return newHeaders;
  } else if (typeof headers === 'object') {
    return {
      ...headers,
      'X-CSRF-Token': token
    };
  }
  
  return { 'X-CSRF-Token': token };
};

/**
 * Create headers with CSRF token
 * @param headers Optional existing headers
 * @returns Headers with CSRF token added
 */
export const createCsrfHeaders = (headers: HeadersInit = {}): Headers => {
  const newHeaders = new Headers(headers);
  newHeaders.append('X-CSRF-Token', getCsrfToken());
  return newHeaders;
};

/**
 * Add CSRF protection to a fetch request
 * @param url The URL to fetch
 * @param options Fetch options
 * @returns The fetch promise
 */
export const fetchWithCsrf = (url: string, options: RequestInit = {}): Promise<Response> => {
  const csrfHeaders = createCsrfHeaders(options.headers);
  return fetch(url, {
    ...options,
    headers: csrfHeaders
  });
};
