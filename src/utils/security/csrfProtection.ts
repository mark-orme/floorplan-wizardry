
/**
 * CSRF Protection Module
 * Provides Cross-Site Request Forgery protection utilities
 */
import { generateSecureToken } from './SecurityUtils';

const CSRF_TOKEN_KEY = 'x-csrf-token';
const CSRF_HEADER_KEY = 'X-CSRF-Token';

// Generate a new CSRF token
export const generateCsrfToken = (): string => {
  const token = generateSecureToken();
  
  // Store in localStorage for persistence
  if (typeof window !== 'undefined') {
    localStorage.setItem(CSRF_TOKEN_KEY, token);
  }
  
  return token;
};

// Get the current CSRF token, generating a new one if needed
export const getCsrfToken = (): string => {
  if (typeof window === 'undefined') {
    return '';
  }
  
  let token = localStorage.getItem(CSRF_TOKEN_KEY);
  
  if (!token) {
    token = generateCsrfToken();
  }
  
  return token;
};

// Verify a CSRF token
export const verifyCsrfToken = (token: string): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  const storedToken = localStorage.getItem(CSRF_TOKEN_KEY);
  return !!storedToken && token === storedToken;
};

// Add CSRF token to fetch headers
export const addCsrfHeader = (headers: HeadersInit = {}): HeadersInit => {
  const token = getCsrfToken();
  
  return {
    ...headers,
    [CSRF_HEADER_KEY]: token
  };
};

// Initialize CSRF protection
export const initializeCsrfProtection = (): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  // Generate token if it doesn't exist
  getCsrfToken();
  
  // Add CSRF token to all fetch requests
  const originalFetch = window.fetch;
  
  window.fetch = function(input, init) {
    init = init || {};
    init.headers = addCsrfHeader(init.headers);
    
    return originalFetch.call(this, input, init);
  };
  
  console.log('CSRF protection initialized');
};

// Reset CSRF protection (for testing)
export const resetCsrfProtection = (): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  localStorage.removeItem(CSRF_TOKEN_KEY);
};
