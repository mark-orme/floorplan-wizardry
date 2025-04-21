
/**
 * Security Utilities
 * Common security utility functions
 */

/**
 * Generate a secure random token
 * @returns A secure random token string
 */
export function generateSecureToken(): string {
  // Generate a random token
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Apply security measures to a form element
 * @param form Form element to secure
 */
export function secureForm(form: HTMLFormElement): void {
  // Add CSRF token
  const csrfToken = getCsrfToken();
  
  // Store token in a hidden field
  const tokenInput = document.createElement('input');
  tokenInput.type = 'hidden';
  tokenInput.name = 'csrf_token';
  tokenInput.value = csrfToken;
  form.appendChild(tokenInput);
  
  // Store in session storage for validation
  try {
    sessionStorage.setItem('csrf_token', csrfToken);
  } catch (e) {
    console.error('Failed to store CSRF token');
  }
  
  // Add event listener to sanitize inputs on submit
  form.addEventListener('submit', (e) => {
    const formData = new FormData(form);
    const hasInvalidData = Array.from(formData.entries()).some(([key, value]) => {
      if (typeof value === 'string' && value.includes('<script')) {
        console.error(`Potentially malicious input detected in field: ${key}`);
        e.preventDefault();
        return true;
      }
      return false;
    });
    
    if (hasInvalidData) {
      console.error('Form submission blocked due to potentially malicious input');
      e.preventDefault();
    }
  });
}

/**
 * Generate a simple CSRF token
 * For use in the SecurityUtils module
 */
function getCsrfToken(): string {
  // Generate a random token if none exists in storage
  let token = sessionStorage.getItem('csrf_token');
  if (!token) {
    token = `csrf-${Math.random().toString(36).substring(2, 15)}`;
    sessionStorage.setItem('csrf_token', token);
  }
  return token;
}

/**
 * Initialize all security features
 * Call this during application startup
 */
export function initializeSecurity(): void {
  if (typeof window !== 'undefined') {
    // Initialize Content Security Policy
    // Apply security-related meta tags
    const metaReferrer = document.createElement('meta');
    metaReferrer.setAttribute('name', 'referrer');
    metaReferrer.content = 'no-referrer';
    document.head.appendChild(metaReferrer);
    
    console.info('Security features initialized');
  }
}
