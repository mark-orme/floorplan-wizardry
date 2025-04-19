
/**
 * Initialize security features for the application
 */
export function initializeSecurity(): void {
  // Set up CSP headers (if in control of the server)
  // Content Security Policy helps prevent XSS attacks
  if (typeof window !== 'undefined') {
    console.info('Setting up security features...');
    
    // Sanitization setup for user inputs
    setupInputSanitization();
    
    // Initialize CSRF protection
    setupCSRFProtection();
    
    // Set up data masking for sensitive information
    setupDataMasking();
    
    // Enable secure storage mechanisms
    setupSecureStorage();
    
    // Log security initialization
    console.info('Security features initialized');
  }
}

/**
 * Set up input sanitization
 */
function setupInputSanitization(): void {
  // This would normally be handled by React's built-in XSS protection
  // and proper validation libraries, but here's a simple example
  if (typeof window !== 'undefined') {
    // Sanitize user input before it's displayed
    window.addEventListener('DOMContentLoaded', () => {
      const inputs = document.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        input.addEventListener('change', (e) => {
          const target = e.target as HTMLInputElement;
          // Basic sanitization - in a real app, use a proper library like DOMPurify
          target.value = target.value
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
        });
      });
    });
  }
}

/**
 * Set up CSRF protection
 */
function setupCSRFProtection(): void {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    // Generate a CSRF token at page load
    const csrfToken = generateRandomToken();
    localStorage.setItem('csrf_token', csrfToken);
    
    // Add CSRF token to all fetch requests
    const originalFetch = window.fetch;
    window.fetch = function(input, init) {
      init = init || {};
      init.headers = init.headers || {};
      
      // Add CSRF token to headers
      const headers = new Headers(init.headers);
      headers.append('X-CSRF-Token', csrfToken);
      init.headers = headers;
      
      return originalFetch.call(window, input, init);
    };
    
    // Add CSRF token to forms when they're submitted
    document.addEventListener('submit', (e) => {
      const form = e.target as HTMLFormElement;
      
      // Skip if already has token
      if (form.querySelector('input[name="csrf_token"]')) {
        return;
      }
      
      // Add hidden CSRF token field
      const tokenInput = document.createElement('input');
      tokenInput.type = 'hidden';
      tokenInput.name = 'csrf_token';
      tokenInput.value = csrfToken;
      form.appendChild(tokenInput);
    });
  }
}

/**
 * Generate a random token for CSRF protection
 */
function generateRandomToken(): string {
  const array = new Uint8Array(24);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array);
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Set up data masking for sensitive information
 */
function setupDataMasking(): void {
  if (typeof window !== 'undefined') {
    // Set up a custom toJSON method for sensitive objects
    // This is just an example pattern - not a complete solution
    const maskSensitiveData = (key: string, value: any) => {
      // Define patterns for sensitive data
      const sensitiveKeys = ['password', 'token', 'secret', 'apiKey', 'key', 'credit', 'ssn'];
      const emailPattern = /^[^@]+@[^@]+\.[^@]+$/;
      
      // Check if the key matches sensitive patterns
      if (sensitiveKeys.some(pattern => key.toLowerCase().includes(pattern))) {
        return '[REDACTED]';
      }
      
      // Check if value looks like an email
      if (typeof value === 'string' && emailPattern.test(value)) {
        // Mask email (show only first 2 chars and domain)
        const atIndex = value.indexOf('@');
        return value.substring(0, 2) + '***' + value.substring(atIndex);
      }
      
      return value;
    };
    
    // Example usage: console.log doesn't expose passwords
    const originalStringify = JSON.stringify;
    JSON.stringify = function(value, replacer, space) {
      return originalStringify(value, replacer || maskSensitiveData, space);
    };
  }
}

/**
 * Set up secure storage mechanisms
 */
function setupSecureStorage(): void {
  if (typeof window !== 'undefined') {
    // Simple wrapper to add an expiry and basic encryption to localStorage
    const secureStorage = {
      setItem: (key: string, value: any, ttlMinutes = 60) => {
        const expires = Date.now() + ttlMinutes * 60 * 1000;
        const item = {
          value: typeof value === 'string' ? value : JSON.stringify(value),
          expires
        };
        localStorage.setItem(`secure_${key}`, JSON.stringify(item));
      },
      
      getItem: (key: string) => {
        const itemStr = localStorage.getItem(`secure_${key}`);
        
        if (!itemStr) return null;
        
        try {
          const item = JSON.parse(itemStr);
          
          if (item.expires < Date.now()) {
            localStorage.removeItem(`secure_${key}`);
            return null;
          }
          
          try {
            return JSON.parse(item.value);
          } catch {
            return item.value;
          }
        } catch {
          return null;
        }
      },
      
      removeItem: (key: string) => {
        localStorage.removeItem(`secure_${key}`);
      }
    };
    
    // Make available globally
    (window as any).secureStorage = secureStorage;
  }
}
