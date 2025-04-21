
/**
 * Security Module
 * Initializes all security features
 */
import { initializeSecurity } from './cspUtils';
import { initializeCsrfProtection } from './csrfProtection';
import logger from '@/utils/logger';

/**
 * Initialize all security features
 */
export function initializeAllSecurity(): void {
  try {
    // Initialize Content Security Policy
    initializeSecurity();
    
    // Initialize CSRF protection
    initializeCsrfProtection();
    
    logger.info('All security features initialized');
  } catch (error) {
    logger.error('Failed to initialize security features', { error });
  }
}

// Re-export security utilities
export * from './cspUtils';
export * from './csrfProtection';
export * from './encryption';
export * from './rbacUtils';
export * from './SecurityUtils';
export * from './HttpSecurityUtils';
