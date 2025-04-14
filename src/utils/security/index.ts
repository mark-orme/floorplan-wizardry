
/**
 * Security utilities index
 * Re-exports all security-related functions
 * @module utils/security
 */

// Export CSRF protection utilities
export * from './csrfProtection';

// Export authentication guard utilities
export * from './authGuard';

// Export token storage utilities
export * from './tokenStorage';

// Create a Security namespace for backwards compatibility
export const Security = {
  isSecureConnection: (): boolean => {
    return window.location.protocol === 'https:';
  },
  secureForm: (formElement: HTMLFormElement): void => {
    // Add security attributes to form
    formElement.setAttribute('autocomplete', 'off');
    formElement.setAttribute('novalidate', 'true');
    
    // Add CSRF token
    const csrfToken = localStorage.getItem('csrf_token') || '';
    const csrfInput = document.createElement('input');
    csrfInput.type = 'hidden';
    csrfInput.name = 'csrf_token';
    csrfInput.value = csrfToken;
    formElement.appendChild(csrfInput);
  }
};

// Initialize all security features
export const initializeSecurity = (): void => {
  // Initialize CSRF protection
  initializeCSRFProtection();
  
  // Set up other security measures as needed
  if (process.env.NODE_ENV === 'production' && !Security.isSecureConnection()) {
    console.warn('Warning: Application running without HTTPS in production mode');
  }
};
