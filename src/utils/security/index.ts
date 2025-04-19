
import { generateCSRFToken, getCSRFToken, verifyCSRFToken, addCSRFToFormData, addCSRFToHeaders, fetchWithCSRF, createFormProtection, CSRFProtection } from './enhancedCsrfProtection';
import { rotateApiKeys, checkKeyAge } from './secretRotation';
import { initializeSecurity } from './securityInit';
import { scanForVulnerabilities } from './vulnerabilityScanner';
import { secureLocalStorage } from './secureStorage';
import { auditAccessAttempt } from './accessAuditing';
import { enableOfflineEncryption } from './offlineEncryption';
import { fetchSecurityEvents } from './securityAudit';

// Re-export all security functions
export {
  // CSRF Protection
  generateCSRFToken,
  getCSRFToken,
  verifyCSRFToken,
  addCSRFToFormData,
  addCSRFToHeaders,
  fetchWithCSRF,
  createFormProtection,
  CSRFProtection,
  
  // Secret Rotation
  rotateApiKeys,
  checkKeyAge,
  
  // Security Initialization
  initializeSecurity,
  
  // Vulnerability Scanning
  scanForVulnerabilities,
  
  // Secure Storage
  secureLocalStorage,
  
  // Access Auditing
  auditAccessAttempt,
  
  // Offline Encryption
  enableOfflineEncryption,
  
  // Security Events
  fetchSecurityEvents
};

/**
 * Apply rate limiting to a function
 * @param fn Function to rate limit
 * @param limitMs Time window in milliseconds
 * @param maxCalls Maximum number of calls allowed in time window
 */
export function rateLimit<T extends (...args: any[]) => any>(
  fn: T,
  limitMs: number = 1000,
  maxCalls: number = 5
): (...args: Parameters<T>) => ReturnType<T> | null {
  const calls: number[] = [];
  
  return (...args: Parameters<T>): ReturnType<T> | null => {
    const now = Date.now();
    
    // Remove calls outside of time window
    while (calls.length > 0 && calls[0] < now - limitMs) {
      calls.shift();
    }
    
    // Check if we've exceeded the rate limit
    if (calls.length >= maxCalls) {
      console.warn('Rate limit exceeded');
      return null;
    }
    
    // Add this call to the record
    calls.push(now);
    
    return fn(...args);
  };
}

/**
 * Initialize security features
 */
export function initializeSecurityFeatures(): void {
  // Generate initial CSRF token
  generateCSRFToken();
  
  // Initialize offline encryption
  enableOfflineEncryption();
  
  // Set up form protection
  if (typeof document !== 'undefined') {
    createFormProtection();
  }
  
  // Check API key age
  checkKeyAge();
  
  // Log security initialization
  console.info('Security features initialized');
}
