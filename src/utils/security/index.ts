
/**
 * Centralized Security Module
 * Exports all security-related utilities from a single entry point
 */

// CSRF Protection
export {
  generateCSRFToken,
  getCSRFToken,
  verifyCSRFToken,
  addCSRFToFormData,
  addCSRFToHeaders,
  fetchWithCSRF,
  createFormProtection
} from './enhancedCsrfProtection';

// Authentication & Authorization
export {
  isAuthenticated,
  redirectUnauthorized,
  hasRole,
  hasPermission,
  validateAuthorization,
  createAuthGuard
} from './authGuard';

// Data Protection
export {
  isEncryptionSupported,
  generateEncryptionKey,
  encryptData,
  decryptData
} from './dataEncryption';

// Secure Storage
export { secureLocalStorage } from './secureStorage';

// Audit & Logging
export { 
  logSecurityEvent, 
  fetchSecurityEvents
} from './securityAudit';

// Token Management
export {
  storeAuthToken,
  getAuthToken,
  isTokenExpired,
  clearAuthToken,
  refreshAuthToken
} from './secureTokenStorage';

// HTTP Security
export {
  secureFetch,
  addSecurityHeaders,
  createSafeRedirect
} from './HttpSecurityUtils';

// Initialize all security features
export { initializeSecurity } from './securityInit';
