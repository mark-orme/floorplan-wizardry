
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

// Export file security utilities
export * from './fileUploadSecurity';

// Export the isSecureConnection function directly
export const isSecureConnection = (): boolean => {
  return window.location.protocol === 'https:';
};

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
  },
  Input: {
    sanitizeHtml: (input: string): string => {
      // Basic HTML sanitization
      return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }
  },
  // Add Files namespace with re-exported functions from fileUploadSecurity
  Files: {
    createSecureFileUploadHandler: (
      onValidFile: (file: File, sanitizedFileName: string) => void,
      onInvalidFile: (error: string) => void,
      options?: any
    ) => {
      // Import at runtime to avoid circular dependency
      const { createSecureFileUploadHandler } = require('./fileUploadSecurity');
      return createSecureFileUploadHandler(onValidFile, onInvalidFile, options);
    },
    sanitizeFileName: (fileName: string, maxLength?: number): string => {
      // Import at runtime to avoid circular dependency
      const { sanitizeFileName } = require('./fileUploadSecurity');
      return sanitizeFileName(fileName, maxLength);
    },
    validateFile: (file: File, options?: any) => {
      // Import at runtime to avoid circular dependency
      const { validateFile } = require('./fileUploadSecurity');
      return validateFile(file, options);
    }
  }
};

// Import the initializeCSRFProtection function to make it available
import { initializeCSRFProtection } from './csrfProtection';

// Initialize all security features
export const initializeSecurity = (): void => {
  // Initialize CSRF protection
  initializeCSRFProtection();
  
  // Set up other security measures as needed
  if (process.env.NODE_ENV === 'production' && !isSecureConnection()) {
    console.warn('Warning: Application running without HTTPS in production mode');
  }
};

// Re-export the secureForm function at the top level for more convenient imports
export const secureForm = Security.secureForm;
