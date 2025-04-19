
/**
 * Security Utilities Index
 * Centralized exports for all security-related functionality
 */

// Import utilities
import { 
  storeAuthToken, 
  getAuthToken, 
  isTokenExpired, 
  clearAuthToken, 
  refreshAuthToken 
} from './secureTokenStorage';

import {
  generateCsrfToken,
  getCsrfToken,
  validateCsrfToken,
  addCsrfTokenToForm,
  createCsrfHeaders,
  fetchWithCsrf
} from './csrfProtection';

import {
  initializeDOMPurify,
  sanitizeHtml,
  sanitizeRichHtml,
  sanitizeCanvasHtml,
  sanitizeUrl
} from './htmlSanitization';

import {
  sanitizeFileName,
  createSecureFileUploadHandler
} from './FileSecurityUtils';

import {
  secureForm,
  initializeSecurity
} from './SecurityUtils';

// Create a unified Security namespace
export const Security = {
  // Token management
  Token: {
    store: storeAuthToken,
    get: getAuthToken,
    isExpired: isTokenExpired,
    clear: clearAuthToken,
    refresh: refreshAuthToken
  },
  
  // CSRF protection
  CSRF: {
    generate: generateCsrfToken,
    get: getCsrfToken,
    validate: validateCsrfToken,
    addToForm: addCsrfTokenToForm,
    createHeaders: createCsrfHeaders,
    fetchWithProtection: fetchWithCsrf
  },
  
  // HTML sanitization
  HTML: {
    sanitize: sanitizeHtml,
    sanitizeRich: sanitizeRichHtml,
    sanitizeCanvas: sanitizeCanvasHtml,
    sanitizeUrl: sanitizeUrl,
    initializeSanitizer: initializeDOMPurify
  },
  
  // File handling
  Files: {
    sanitizeFileName,
    createSecureFileUploadHandler
  },
  
  // Form security
  Forms: {
    secure: secureForm
  },
  
  // General security
  initialize: () => {
    initializeSecurity();
    initializeDOMPurify();
  }
};

// Direct exports for individual imports
export {
  // Token management
  storeAuthToken,
  getAuthToken,
  isTokenExpired,
  clearAuthToken,
  refreshAuthToken,
  
  // CSRF protection
  generateCsrfToken,
  getCsrfToken,
  validateCsrfToken,
  addCsrfTokenToForm,
  createCsrfHeaders,
  fetchWithCsrf,
  
  // HTML sanitization
  initializeDOMPurify,
  sanitizeHtml,
  sanitizeRichHtml,
  sanitizeCanvasHtml,
  sanitizeUrl,
  
  // File handling
  sanitizeFileName,
  createSecureFileUploadHandler,
  
  // Form security
  secureForm,
  
  // General security
  initializeSecurity
};
