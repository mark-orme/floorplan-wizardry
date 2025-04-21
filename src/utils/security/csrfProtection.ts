
/**
 * CSRF Protection Module
 * Provides Cross-Site Request Forgery protection utilities with enhanced security
 */
import { generateSecureToken } from './SecurityUtils';
import { setCookie, getCookie, deleteCookie } from './cookieSecurity';

// Configuration constants
const CSRF_TOKEN_KEY = 'x-csrf-token';
const CSRF_HEADER_KEY = 'X-CSRF-Token';
const CSRF_COOKIE_NAME = 'x-csrf-cookie';
const CSRF_TOKEN_EXPIRY = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

interface CsrfTokenData {
  token: string;
  expiry: number;
}

/**
 * Generate a new CSRF token and store it in both localStorage and as a cookie
 * Implements double-submit cookie pattern for enhanced security
 */
export const generateCsrfToken = (): string => {
  const token = generateSecureToken();
  const expiry = Date.now() + CSRF_TOKEN_EXPIRY;
  
  // Store in localStorage for JavaScript access
  if (typeof window !== 'undefined') {
    const tokenData: CsrfTokenData = { token, expiry };
    localStorage.setItem(CSRF_TOKEN_KEY, JSON.stringify(tokenData));
    
    // Set as HttpOnly cookie with same expiry for double-submit verification
    setCookie(CSRF_COOKIE_NAME, token, {
      secure: window.location.protocol === 'https:',
      sameSite: 'strict',
      path: '/',
      maxAge: Math.floor(CSRF_TOKEN_EXPIRY / 1000) // Convert to seconds
    });
  }
  
  return token;
};

/**
 * Get the current CSRF token, generating a new one if needed or if expired
 */
export const getCsrfToken = (): string => {
  if (typeof window === 'undefined') {
    return '';
  }
  
  try {
    const tokenDataStr = localStorage.getItem(CSRF_TOKEN_KEY);
    
    if (tokenDataStr) {
      const tokenData: CsrfTokenData = JSON.parse(tokenDataStr);
      
      // Check if token is still valid
      if (tokenData.expiry > Date.now()) {
        // Verify cookie and localStorage token match (double-submit verification)
        const cookieToken = getCookie(CSRF_COOKIE_NAME);
        
        if (cookieToken === tokenData.token) {
          return tokenData.token;
        } else {
          console.warn('CSRF token mismatch between cookie and localStorage. Regenerating for security.');
        }
      } else {
        console.info('CSRF token expired. Generating new token.');
      }
    }
  } catch (error) {
    console.error('Error retrieving CSRF token:', error);
  }
  
  // Generate new token if not found, expired, or verification failed
  return generateCsrfToken();
};

/**
 * Rotate the CSRF token - useful after critical actions
 */
export const rotateCsrfToken = (): string => {
  if (typeof window === 'undefined') {
    return '';
  }
  
  // Clear existing token
  localStorage.removeItem(CSRF_TOKEN_KEY);
  deleteCookie(CSRF_COOKIE_NAME);
  
  // Generate new token
  return generateCsrfToken();
};

/**
 * Verify a CSRF token using double-submit cookie pattern
 */
export const verifyCsrfToken = (token: string): boolean => {
  if (typeof window === 'undefined' || !token) {
    return false;
  }
  
  try {
    // Get token from localStorage
    const tokenDataStr = localStorage.getItem(CSRF_TOKEN_KEY);
    if (!tokenDataStr) {
      return false;
    }
    
    const tokenData: CsrfTokenData = JSON.parse(tokenDataStr);
    
    // Verify token hasn't expired
    if (tokenData.expiry <= Date.now()) {
      return false;
    }
    
    // Double verification: check localStorage token against submitted token
    const lsTokenValid = token === tokenData.token;
    
    // Double verification: check cookie token against submitted token
    const cookieToken = getCookie(CSRF_COOKIE_NAME);
    const cookieTokenValid = cookieToken === token;
    
    // Both verifications must pass
    return lsTokenValid && cookieTokenValid;
  } catch (error) {
    console.error('Error verifying CSRF token:', error);
    return false;
  }
};

/**
 * Add CSRF token to fetch headers
 */
export const addCsrfHeader = (headers: HeadersInit = {}): HeadersInit => {
  const token = getCsrfToken();
  
  if (headers instanceof Headers) {
    const newHeaders = new Headers(headers);
    newHeaders.set(CSRF_HEADER_KEY, token);
    return newHeaders;
  }
  
  return {
    ...headers,
    [CSRF_HEADER_KEY]: token
  };
};

/**
 * Add CSRF protection to a form element
 */
export const protectForm = (form: HTMLFormElement): void => {
  if (!form) return;
  
  // Don't add token if it already exists
  if (form.querySelector(`input[name="${CSRF_TOKEN_KEY}"]`)) return;
  
  const token = getCsrfToken();
  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = CSRF_TOKEN_KEY;
  input.value = token;
  
  form.appendChild(input);
};

/**
 * Initialize CSRF protection by monkey patching fetch
 */
export const initializeCsrfProtection = (): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  // Generate token if it doesn't exist
  getCsrfToken();
  
  // Add CSRF token to all fetch requests
  const originalFetch = window.fetch;
  
  window.fetch = function(input, init) {
    // Clone the init object to avoid modifying the original
    const modifiedInit = init ? { ...init } : {};
    
    // Add CSRF header
    modifiedInit.headers = addCsrfHeader(modifiedInit.headers);
    
    // Apply special handling for different request types
    const method = (modifiedInit.method || 'GET').toUpperCase();
    
    // Automatically rotates token after sensitive state-changing operations
    const shouldRotateToken = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method);
    
    return originalFetch.call(this, input, modifiedInit)
      .then(response => {
        // Rotate token after sensitive operations that succeeded
        if (shouldRotateToken && response.ok) {
          // Use setTimeout to avoid blocking the response
          setTimeout(() => {
            rotateCsrfToken();
          }, 0);
        }
        return response;
      })
      .catch(error => {
        // Re-throw the error after logging
        console.error('Fetch error with CSRF protection:', error);
        throw error;
      });
  };
  
  // Auto-protect all forms
  if (typeof document !== 'undefined') {
    // Protect existing forms
    document.querySelectorAll('form').forEach(protectForm);
    
    // Watch for dynamically added forms
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeName === 'FORM') {
              protectForm(node as HTMLFormElement);
            } else if (node instanceof Element) {
              node.querySelectorAll('form').forEach(protectForm);
            }
          });
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  console.log('Enhanced CSRF protection initialized with double-submit verification');
};

/**
 * Reset CSRF protection (for testing)
 */
export const resetCsrfProtection = (): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  localStorage.removeItem(CSRF_TOKEN_KEY);
  deleteCookie(CSRF_COOKIE_NAME);
};
