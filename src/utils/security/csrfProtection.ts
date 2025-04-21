
/**
 * CSRF Protection Utilities
 * Implements Cross-Site Request Forgery protection
 */
import logger from '@/utils/logger';

/**
 * Generate a CSRF token
 * @returns New CSRF token
 */
export function generateCSRFToken(): string {
  // Generate a random token
  const tokenBytes = new Uint8Array(32);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(tokenBytes);
  } else {
    // Fallback for older browsers or SSR
    for (let i = 0; i < tokenBytes.length; i++) {
      tokenBytes[i] = Math.floor(Math.random() * 256);
    }
  }
  
  // Convert to base64 string
  const tokenString = Array.from(tokenBytes)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
  
  return tokenString;
}

/**
 * Get the current CSRF token, or generate a new one
 * @returns Current CSRF token
 */
export function getCsrfToken(): string {
  if (typeof window === 'undefined') {
    // Handle server-side rendering
    return '';
  }
  
  try {
    // Get token from storage
    let token = localStorage.getItem('csrf_token');
    
    // Generate new token if none exists
    if (!token) {
      token = generateCSRFToken();
      localStorage.setItem('csrf_token', token);
    }
    
    return token;
  } catch (error) {
    logger.error('Error accessing CSRF token', { error });
    
    // Fallback to generating new token without storage
    return generateCSRFToken();
  }
}

/**
 * Verify a CSRF token against the stored token
 * @param token Token to verify
 * @returns True if token is valid
 */
export function verifyCSRFToken(token: string): boolean {
  try {
    const storedToken = localStorage.getItem('csrf_token');
    return storedToken === token;
  } catch (error) {
    logger.error('Error verifying CSRF token', { error });
    return false;
  }
}

/**
 * Add CSRF token to form data
 * @param formData Form data to add token to
 * @returns Updated form data
 */
export function addCSRFToFormData(formData: FormData): FormData {
  formData.append('csrf_token', getCsrfToken());
  return formData;
}

/**
 * Add CSRF token to request headers
 * @param headers Existing request headers
 * @returns Headers with CSRF token added
 */
export function addCsrfHeader(headers: Record<string, string> = {}): Record<string, string> {
  const token = getCsrfToken();
  return {
    ...headers,
    'X-CSRF-Token': token
  };
}

/**
 * Wrap fetch with CSRF protection
 * @param url URL to fetch
 * @param options Fetch options
 * @returns Fetch response
 */
export async function fetchWithCsrf(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Only add token to state-changing requests
  const method = options.method || 'GET';
  if (method !== 'GET' && method !== 'HEAD') {
    const headers = options.headers || {};
    const newHeaders = addCsrfHeader(headers as Record<string, string>);
    
    return fetch(url, {
      ...options,
      headers: newHeaders
    });
  }
  
  // Pass through for GET/HEAD requests
  return fetch(url, options);
}

/**
 * Apply CSRF protection to forms
 * @param form Form element to protect
 */
export function protectForm(form: HTMLFormElement): void {
  try {
    // Generate token
    const token = getCsrfToken();
    
    // Check if token input already exists
    let tokenInput = form.querySelector('input[name="csrf_token"]') as HTMLInputElement;
    
    if (!tokenInput) {
      // Create hidden input for token
      tokenInput = document.createElement('input');
      tokenInput.type = 'hidden';
      tokenInput.name = 'csrf_token';
      form.appendChild(tokenInput);
    }
    
    // Set current token value
    tokenInput.value = token;
  } catch (error) {
    logger.error('Error protecting form with CSRF token', { error });
  }
}

/**
 * Automatically protect all forms on the page
 */
export function protectAllForms(): void {
  if (typeof document === 'undefined') return;
  
  try {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      if (form instanceof HTMLFormElement) {
        protectForm(form);
      }
    });
    
    logger.info(`Protected ${forms.length} forms with CSRF tokens`);
  } catch (error) {
    logger.error('Error protecting forms with CSRF tokens', { error });
  }
}

/**
 * Initialize CSRF protection
 */
export function initializeCsrfProtection(): void {
  // Generate initial token
  getCsrfToken();
  
  // Protect forms when DOM is ready
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', protectAllForms);
    } else {
      protectAllForms();
    }
  }
  
  logger.info('CSRF protection initialized');
}
