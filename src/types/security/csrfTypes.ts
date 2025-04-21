
/**
 * CSRF Protection Type Definitions
 * 
 * This module provides type definitions for Cross-Site Request Forgery (CSRF)
 * protection functionality.
 * 
 * @module types/security/csrfTypes
 */

/**
 * Configuration options for CSRF protection
 */
export interface CsrfConfig {
  /**
   * Token name used in headers
   * @default 'X-CSRF-Token'
   */
  tokenHeaderName: string;
  
  /**
   * Token name used in forms
   * @default 'csrf-token'
   */
  tokenFormName: string;
  
  /**
   * Cookie name for double-submit cookie pattern
   * @default 'csrf-token'
   */
  cookieName: string;
  
  /**
   * Whether CSRF protection is enabled
   * @default true
   */
  enabled: boolean;
  
  /**
   * Token expiration time in milliseconds
   * @default 2 * 60 * 60 * 1000 (2 hours)
   */
  tokenExpirationMs: number;
}

/**
 * CSRF token data structure
 */
export interface CsrfToken {
  /**
   * The token value
   */
  token: string;
  
  /**
   * When the token was created
   */
  createdAt: number;
  
  /**
   * When the token expires
   */
  expiresAt: number;
}

/**
 * CSRF verification result
 */
export interface CsrfVerificationResult {
  /**
   * Whether verification was successful
   */
  valid: boolean;
  
  /**
   * Error message if verification failed
   */
  error?: string;
  
  /**
   * Token status (valid, expired, missing, invalid)
   */
  status: 'valid' | 'expired' | 'missing' | 'invalid';
}

/**
 * CSRF protection handler interface
 */
export interface CsrfProtectionHandler {
  /**
   * Generate a new CSRF token
   */
  generateToken(): string;
  
  /**
   * Get the current CSRF token
   */
  getToken(): string;
  
  /**
   * Verify a CSRF token
   */
  verifyToken(token: string): CsrfVerificationResult;
  
  /**
   * Apply CSRF protection to a form element
   */
  protectForm(form: HTMLFormElement): void;
  
  /**
   * Add CSRF token to fetch headers
   */
  addToHeaders(headers: HeadersInit): Headers;
}
