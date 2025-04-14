
/**
 * CSRF Protection Utilities
 * Provides token generation and validation for CSRF protection
 * @module utils/security/csrfProtection
 */

/**
 * Generate a secure random token
 * @returns Random token string
 */
export function generateCSRFToken(): string {
  // Generate random bytes and encode as base64
  const bytes = new Uint8Array(32);
  window.crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes));
}

/**
 * Get or create a CSRF token for the current session
 * Stores in sessionStorage to persist across page loads but clear on browser close
 * @returns CSRF token
 */
export function getCSRFToken(): string {
  const tokenKey = 'app_csrf_token';
  let token = sessionStorage.getItem(tokenKey);
  
  if (!token) {
    token = generateCSRFToken();
    sessionStorage.setItem(tokenKey, token);
  }
  
  return token;
}

/**
 * Add CSRF token to a form as a hidden input
 * @param form Form element to protect
 */
export function protectForm(form: HTMLFormElement): void {
  // Remove any existing token to prevent duplicates
  const existingToken = form.querySelector('input[name="csrf_token"]');
  if (existingToken) {
    existingToken.remove();
  }
  
  // Create and add the token input
  const token = getCSRFToken();
  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = 'csrf_token';
  input.value = token;
  
  form.appendChild(input);
}

/**
 * Add CSRF token to a fetch request's headers
 * @param headers Headers object to augment
 * @returns Updated headers with CSRF token
 */
export function addCSRFHeader(headers: HeadersInit): HeadersInit {
  const token = getCSRFToken();
  
  // Use the headers' native format if possible
  if (headers instanceof Headers) {
    const newHeaders = new Headers(headers);
    newHeaders.set('X-CSRF-Token', token);
    return newHeaders;
  } 
  else if (Array.isArray(headers)) {
    // For array format, add a new entry
    return [...headers, ['X-CSRF-Token', token]];
  }
  else {
    // For object format
    return {
      ...headers,
      'X-CSRF-Token': token
    };
  }
}

/**
 * Create fetch options with CSRF protection
 * @param options Original fetch options
 * @returns Updated fetch options with CSRF protection
 */
export function createProtectedFetchOptions(options: RequestInit = {}): RequestInit {
  return {
    ...options,
    credentials: 'include' as RequestCredentials, // Include cookies for auth
    headers: addCSRFHeader(options.headers || {})
  };
}

/**
 * Protected fetch wrapper that adds CSRF tokens
 * @param url URL to fetch
 * @param options Fetch options
 * @returns Fetch promise
 */
export function protectedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  return fetch(url, createProtectedFetchOptions(options));
}
