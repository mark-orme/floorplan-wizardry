
/**
 * CSRF Protection Utilities
 * 
 * Provides functions for generating and validating CSRF tokens
 */

// Generate a CSRF token
export const generateCSRFToken = (): string => {
  // Generate a random token
  const token = Math.random().toString(36).substring(2, 15) + 
                Math.random().toString(36).substring(2, 15);
  
  // Store in localStorage for this demo
  // In production, this should be HttpOnly cookies set by the server
  try {
    localStorage.setItem('csrf_token', token);
  } catch (e) {
    console.error('Failed to store CSRF token');
  }
  
  return token;
};

// Get the stored CSRF token
export const getCsrfToken = (): string => {
  let token = localStorage.getItem('csrf_token');
  
  // Generate a token if none exists
  if (!token) {
    token = generateCSRFToken();
  }
  
  return token;
};

// Verify that a token matches the stored token
export const verifyCSRFToken = (token: string): boolean => {
  const storedToken = localStorage.getItem('csrf_token');
  return token === storedToken;
};

// Add CSRF token to form data
export const addCSRFToFormData = (formData: FormData): FormData => {
  formData.append('csrf_token', getCsrfToken());
  return formData;
};

// Add CSRF token to fetch headers
export const addCSRFToken = (options: RequestInit = {}): RequestInit => {
  const token = getCsrfToken();
  
  return {
    ...options,
    headers: {
      ...options.headers,
      'X-CSRF-Token': token
    }
  };
};

// Add CSRF token to request headers
export const addCSRFToHeaders = (headers: HeadersInit = {}): Headers => {
  const newHeaders = new Headers(headers);
  newHeaders.append('X-CSRF-Token', getCsrfToken());
  return newHeaders;
};

// Wrapper for fetch that adds CSRF token
export const fetchWithCSRF = (url: string, options: RequestInit = {}): Promise<Response> => {
  return fetch(url, addCSRFToken(options));
};
