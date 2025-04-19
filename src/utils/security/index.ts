
/**
 * Security Utilities Index
 * Enhanced version with comprehensive security features
 */

// Import original security utilities
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
  sanitizeHtml,
  sanitizeRichHtml,
  sanitizeCanvasHtml,
  sanitizeCss,
  sanitizeUrl,
  sanitizeText,
  sanitizeObject,
  sanitizeHTML
} from './htmlSanitization';

import {
  sanitizeFileName,
  createSecureFileUploadHandler
} from './FileSecurityUtils';

import {
  secureForm,
  initializeSecurity
} from './SecurityUtils';

// Import enhanced security utilities
import {
  isRateLimited,
  getRateLimitStatus,
  resetRateLimit,
  createRateLimitedFunction,
  rateLimitOptions
} from './enhancedRateLimiting';

import {
  generateEncryptionKey,
  encryptData,
  decryptData
} from './dataEncryption';

import {
  saveEncrypted,
  loadEncrypted,
  deleteEncrypted,
  listEncryptedKeys
} from '../storage/encryptedIdbStore';

import {
  getCSRFToken,
  verifyCSRFToken,
  addCSRFToFormData,
  addCSRFToHeaders,
  fetchWithCSRF,
  createProtectedFormSubmitHandler
} from './enhancedCsrfProtection';

import {
  getSecret,
  storeSecret,
  deleteSecret,
  listSecrets,
  rotateSecret,
  getSecretsToRotate
} from './secretManager';

import {
  checkDependencyVulnerabilities,
  generateVulnerabilityReport,
  hasCriticalVulnerabilities
} from './dependencyManager';

// Create a unified Security namespace with enhanced features
export const Security = {
  // Token management
  Token: {
    store: storeAuthToken,
    get: getAuthToken,
    isExpired: isTokenExpired,
    clear: clearAuthToken,
    refresh: refreshAuthToken
  },
  
  // CSRF protection (enhanced)
  CSRF: {
    generate: generateCSRFToken,
    get: getCSRFToken,
    validate: verifyCSRFToken,
    addToForm: addCSRFToFormData,
    createHeaders: addCSRFToHeaders,
    fetchWithProtection: fetchWithCSRF,
    protectForm: createProtectedFormSubmitHandler
  },
  
  // HTML sanitization
  HTML: {
    sanitize: sanitizeHtml,
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
  
  // Rate limiting (new)
  RateLimiting: {
    isLimited: isRateLimited,
    getStatus: getRateLimitStatus,
    reset: resetRateLimit,
    createLimitedFunction: createRateLimitedFunction,
    options: rateLimitOptions
  },
  
  // Encryption (new)
  Encryption: {
    generateKey: generateEncryptionKey,
    encrypt: encryptData,
    decrypt: decryptData
  },
  
  // Secure storage (new)
  Storage: {
    saveEncrypted,
    loadEncrypted,
    deleteEncrypted,
    listKeys: listEncryptedKeys
  },
  
  // Secret management (new)
  Secrets: {
    get: getSecret,
    store: storeSecret,
    delete: deleteSecret,
    list: listSecrets,
    rotate: rotateSecret,
    getToRotate: getSecretsToRotate
  },
  
  // Dependency security (new)
  Dependencies: {
    checkVulnerabilities: checkDependencyVulnerabilities,
    generateReport: generateVulnerabilityReport,
    hasCriticalVulnerabilities
  },
  
  // General security
  initialize: () => {
    initializeSecurity();
    console.log('Enhanced security features initialized');
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
  sanitizeHtml,
  sanitizeHTML,
  sanitizeRichHtml,
  sanitizeCanvasHtml,
  sanitizeCss,
  sanitizeUrl,
  sanitizeText,
  sanitizeObject,
  
  // File handling
  sanitizeFileName,
  createSecureFileUploadHandler,
  
  // Form security
  secureForm,
  
  // Rate limiting
  isRateLimited,
  getRateLimitStatus,
  resetRateLimit,
  createRateLimitedFunction,
  rateLimitOptions,
  
  // Encryption
  generateEncryptionKey,
  encryptData,
  decryptData,
  
  // Secure storage
  saveEncrypted,
  loadEncrypted,
  deleteEncrypted,
  listEncryptedKeys,
  
  // Secret management
  getSecret,
  storeSecret,
  deleteSecret,
  listSecrets,
  rotateSecret,
  getSecretsToRotate,
  
  // Dependency security
  checkDependencyVulnerabilities,
  generateVulnerabilityReport,
  hasCriticalVulnerabilities,
  
  // General security
  initializeSecurity
};
