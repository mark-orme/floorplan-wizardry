
/**
 * CSRF Protection utilities
 * Provides functions for CSRF token generation and validation
 */

// Generate a random CSRF token
export const generateCSRFToken = (): string => {
  const randomBytes = new Uint8Array(32);
  window.crypto.getRandomValues(randomBytes);
  return Array.from(randomBytes)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
};

// Store a CSRF token in localStorage
export const storeCSRFToken = (token: string): void => {
  localStorage.setItem('csrf_token', token);
};

// Retrieve the CSRF token from localStorage
export const getCSRFToken = (): string | null => {
  return localStorage.getItem('csrf_token');
};

// Validate a CSRF token against the stored one
export const validateCSRFToken = (token: string): boolean => {
  const storedToken = getCSRFToken();
  return storedToken !== null && token === storedToken;
};

// Add CSRF token to headers for fetch requests
export const addCSRFToHeaders = (headers: HeadersInit): HeadersInit => {
  const token = getCSRFToken();
  if (!token) return headers;
  
  if (headers instanceof Headers) {
    const newHeaders = new Headers(headers);
    newHeaders.append('X-CSRF-Token', token);
    return newHeaders;
  } else if (Array.isArray(headers)) {
    return [...headers, ['X-CSRF-Token', token]];
  } else {
    return {
      ...headers,
      'X-CSRF-Token': token
    };
  }
};

// Initialize CSRF protection for the application
export const initializeCSRFProtection = (): void => {
  if (!getCSRFToken()) {
    const newToken = generateCSRFToken();
    storeCSRFToken(newToken);
  }
};

// Alias for addCSRFToHeaders for backward compatibility
export const addCSRFHeader = addCSRFToHeaders;

// Add CSRF protection to an HTML form
export const protectForm = (form: HTMLFormElement): void => {
  const token = getCSRFToken() || generateCSRFToken();
  
  if (!token) {
    console.error('Failed to generate CSRF token for form protection');
    return;
  }
  
  // Store token if it doesn't exist
  if (!getCSRFToken()) {
    storeCSRFToken(token);
  }
  
  // Check if token input already exists
  let tokenInput = form.querySelector('input[name="csrf_token"]');
  
  // Create or update token input
  if (!tokenInput) {
    tokenInput = document.createElement('input');
    tokenInput.setAttribute('type', 'hidden');
    tokenInput.setAttribute('name', 'csrf_token');
    form.appendChild(tokenInput);
  }
  
  // Set token value
  (tokenInput as HTMLInputElement).value = token;
};

// Create fetch options with CSRF protection
export const createProtectedFetchOptions = (options: RequestInit = {}): RequestInit => {
  const token = getCSRFToken();
  if (!token) return options;
  
  // Create headers with token
  const headers = new Headers(options.headers || {});
  headers.append('X-CSRF-Token', token);
  
  return {
    ...options,
    headers
  };
};

// Perform a fetch with CSRF protection
export const protectedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const protectedOptions = createProtectedFetchOptions(options);
  return fetch(url, protectedOptions);
};
