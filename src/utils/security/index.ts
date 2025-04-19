
/**
 * Security Utilities Index
 * Enhanced version with comprehensive security features
 */

// Import token management utils
import { 
  storeAuthToken, 
  getAuthToken, 
  isTokenExpired, 
  clearAuthToken, 
  refreshAuthToken 
} from './secureTokenStorage';

// Import HTML sanitization utils
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

// Import file security utils
import {
  sanitizeFileName,
  createSecureFileUploadHandler
} from './FileSecurityUtils';

// Import general security utils
import {
  secureForm,
  initializeSecurity
} from './SecurityUtils';

// Import enhanced CSRF protection
import {
  generateCSRFToken,
  getCSRFToken,
  verifyCSRFToken,
  addCSRFToFormData,
  addCSRFToHeaders,
  fetchWithCSRF,
  createProtectedFormSubmitHandler,
  useCSRFProtection
} from './enhancedCsrfProtection';

// Import enhanced rate limiting
import {
  isRateLimited,
  getRateLimitStatus,
  resetRateLimit,
  createRateLimitedFunction,
  rateLimitOptions
} from './enhancedRateLimiting';

// Import encryption utils
import {
  generateEncryptionKey,
  encryptData,
  decryptData
} from './dataEncryption';

// Import encrypted storage
import {
  saveEncrypted,
  loadEncrypted,
  deleteEncrypted,
  listEncryptedKeys
} from '../storage/encryptedIdbStore';

// Import secret management
import {
  getSecret,
  storeSecret,
  deleteSecret,
  listSecrets,
  rotateSecret,
  getSecretsToRotate
} from './secretManager';

// Import dependency manager
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
  
  // CSRF protection 
  CSRF: {
    generate: generateCSRFToken,
    get: getCSRFToken,
    validate: verifyCSRFToken,
    addToForm: addCSRFToFormData,
    createHeaders: addCSRFToHeaders,
    fetchWithProtection: fetchWithCSRF,
    protectForm: createProtectedFormSubmitHandler,
    useCSRFProtection
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
  
  // Rate limiting
  RateLimiting: {
    isLimited: isRateLimited,
    getStatus: getRateLimitStatus,
    reset: resetRateLimit,
    createLimitedFunction: createRateLimitedFunction,
    options: rateLimitOptions
  },
  
  // Encryption
  Encryption: {
    generateKey: generateEncryptionKey,
    encrypt: encryptData,
    decrypt: decryptData
  },
  
  // Secure storage
  Storage: {
    saveEncrypted,
    loadEncrypted,
    deleteEncrypted,
    listKeys: listEncryptedKeys
  },
  
  // Secret management
  Secrets: {
    get: getSecret,
    store: storeSecret,
    delete: deleteSecret,
    list: listSecrets,
    rotate: rotateSecret,
    getToRotate: getSecretsToRotate
  },
  
  // Dependency security
  Dependencies: {
    checkVulnerabilities: checkDependencyVulnerabilities,
    generateReport: generateVulnerabilityReport,
    hasCriticalVulnerabilities
  },
  
  // General security
  initialize: initializeSecurity
};

// Export everything individually
export {
  // Token management exports
  storeAuthToken,
  getAuthToken,
  isTokenExpired,
  clearAuthToken,
  refreshAuthToken,
  
  // CSRF protection exports
  generateCSRFToken,
  getCSRFToken,
  verifyCSRFToken,
  addCSRFToFormData,
  addCSRFToHeaders,
  fetchWithCSRF,
  createProtectedFormSubmitHandler,
  useCSRFProtection,
  
  // HTML sanitization exports
  sanitizeHtml,
  sanitizeHTML,
  sanitizeRichHtml,
  sanitizeCanvasHtml,
  sanitizeCss,
  sanitizeUrl,
  sanitizeText,
  sanitizeObject,
  
  // File handling exports
  sanitizeFileName,
  createSecureFileUploadHandler,
  
  // Form security exports
  secureForm,
  
  // Rate limiting exports
  isRateLimited,
  getRateLimitStatus,
  resetRateLimit,
  createRateLimitedFunction,
  rateLimitOptions,
  
  // Encryption exports
  generateEncryptionKey,
  encryptData,
  decryptData,
  
  // Secure storage exports
  saveEncrypted,
  loadEncrypted,
  deleteEncrypted,
  listEncryptedKeys,
  
  // Secret management exports
  getSecret,
  storeSecret,
  deleteSecret,
  listSecrets,
  rotateSecret,
  getSecretsToRotate,
  
  // Dependency security exports
  checkDependencyVulnerabilities,
  generateVulnerabilityReport,
  hasCriticalVulnerabilities,
  
  // General security
  initializeSecurity
};
