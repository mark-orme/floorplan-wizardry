
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
  generateCSRFToken,
  getCsrfToken,
  verifyCSRFToken,
  validateCsrfToken,
  addCSRFToFormData,
  addCsrfTokenToForm,
  addCSRFToHeaders,
  createCsrfHeaders,
  fetchWithCSRF,
  fetchWithCsrf
} from './csrfProtection';

import {
  sanitizeHTML,
  sanitizeRichHtml,
  sanitizeCanvasHtml,
  sanitizeCss,
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
    generate: generateCSRFToken,
    get: getCsrfToken,
    validate: verifyCSRFToken,
    addToForm: addCSRFToFormData,
    createHeaders: addCSRFToHeaders,
    fetchWithProtection: fetchWithCSRF
  },
  
  // HTML sanitization
  HTML: {
    sanitize: sanitizeHTML,
    sanitizeRich: sanitizeRichHtml,
    sanitizeCanvas: sanitizeCanvasHtml,
    sanitizeUrl: sanitizeUrl,
    initializeSanitizer: () => console.log('DOMPurify initialized')
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
    console.log('DOMPurify initialized');
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
  generateCSRFToken,
  getCsrfToken,
  verifyCSRFToken,
  validateCsrfToken,
  addCSRFToFormData,
  addCsrfTokenToForm,
  addCSRFToHeaders,
  createCsrfHeaders,
  fetchWithCSRF,
  fetchWithCsrf,
  
  // HTML sanitization
  sanitizeHTML,
  sanitizeRichHtml,
  sanitizeCanvasHtml,
  sanitizeUrl,
  sanitizeCss,
  
  // File handling
  sanitizeFileName,
  createSecureFileUploadHandler,
  
  // Form security
  secureForm,
  
  // General security
  initializeSecurity
};
