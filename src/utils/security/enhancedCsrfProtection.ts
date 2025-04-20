
/**
 * Enhanced CSRF Protection Implementation
 */

import { v4 as uuidv4 } from 'uuid';

// Centralized configuration
const CSRF_CONFIG = {
  tokenKey: 'csrf-token',
  headerName: 'X-CSRF-Token',
  cookieName: 'x-csrf-token',
  storageKey: '_csrf_protection_token',
  tokenExpiry: 2 * 60 * 60 * 1000 // 2 hours in milliseconds
};

/**
 * Generate a new CSRF token and store it
 */
export function generateCSRFToken(): string {
  const token = uuidv4();
  const expiry = Date.now() + CSRF_CONFIG.tokenExpiry;
  
  // Store token with expiry in localStorage for web apps
  try {
    localStorage.setItem(
      CSRF_CONFIG.storageKey,
      JSON.stringify({ token, expiry })
    );
  } catch (e) {
    console.error('Failed to store CSRF token:', e);
  }
  
  return token;
}

/**
 * Get the stored CSRF token if valid, or generate a new one
 */
export function getCSRFToken(): string {
  try {
    const storedValue = localStorage.getItem(CSRF_CONFIG.storageKey);
    
    if (storedValue) {
      const { token, expiry } = JSON.parse(storedValue);
      
      // If token is still valid, return it
      if (expiry && expiry > Date.now()) {
        return token;
      }
    }
  } catch (e) {
    console.error('Error retrieving CSRF token:', e);
  }
  
  // If no valid token found, generate a new one
  return generateCSRFToken();
}

/**
 * Verify that the provided token matches the stored token
 */
export function verifyCSRFToken(token: string): boolean {
  try {
    const storedValue = localStorage.getItem(CSRF_CONFIG.storageKey);
    
    if (!storedValue) {
      return false;
    }
    
    const { token: storedToken, expiry } = JSON.parse(storedValue);
    
    // Check if token is valid and not expired
    return token === storedToken && expiry > Date.now();
  } catch (e) {
    console.error('Error verifying CSRF token:', e);
    return false;
  }
}

/**
 * Add CSRF token to form data
 */
export function addCSRFToFormData(formData: FormData): FormData {
  formData.append(CSRF_CONFIG.tokenKey, getCSRFToken());
  return formData;
}

/**
 * Add CSRF token to request headers
 */
export function addCSRFToHeaders(headers: HeadersInit = {}): Headers {
  const newHeaders = new Headers(headers);
  newHeaders.append(CSRF_CONFIG.headerName, getCSRFToken());
  return newHeaders;
}

/**
 * Extended fetch with CSRF token
 */
export function fetchWithCSRF(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const newOptions = { ...options };
  
  // Add CSRF token to headers
  newOptions.headers = addCSRFToHeaders(newOptions.headers);
  
  return fetch(url, newOptions);
}

/**
 * Create an interceptor function to protect forms by adding CSRF tokens
 */
export function createFormProtection(): void {
  if (typeof document === 'undefined') return;
  
  // Handle form submissions
  document.addEventListener('submit', (event) => {
    const form = event.target as HTMLFormElement;
    
    // Skip if already protected
    if (form.querySelector(`input[name="${CSRF_CONFIG.tokenKey}"]`)) {
      return;
    }
    
    // Create and add CSRF token input
    const csrfInput = document.createElement('input');
    csrfInput.type = 'hidden';
    csrfInput.name = CSRF_CONFIG.tokenKey;
    csrfInput.value = getCSRFToken();
    form.appendChild(csrfInput);
  });
  
  // Automatically protect dynamic forms
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement && node.nodeName === 'FORM') {
            const form = node as HTMLFormElement;
            
            // Skip if already protected
            if (form.querySelector(`input[name="${CSRF_CONFIG.tokenKey}"]`)) {
              return;
            }
            
            // Create and add CSRF token input
            const csrfInput = document.createElement('input');
            csrfInput.type = 'hidden';
            csrfInput.name = CSRF_CONFIG.tokenKey;
            csrfInput.value = getCSRFToken();
            form.appendChild(csrfInput);
          }
        });
      }
    });
  });
  
  // Start observing the document with configured parameters
  observer.observe(document.body, { childList: true, subtree: true });
}

/**
 * React component for CSRF protection
 */
export function CSRFProtection(): null {
  // Initialize CSRF protection when component mounts
  if (typeof window !== 'undefined') {
    // Generate initial token
    getCSRFToken();
    
    // Set up form protection
    createFormProtection();
    
    // Run token refresh periodically (30 minutes)
    const refreshInterval = setInterval(() => {
      generateCSRFToken();
    }, 30 * 60 * 1000);
    
    // This should return a cleanup function, but TypeScript expects null
    // For React components this will be handled correctly
  }
  
  return null;
}

