
/**
 * Authentication Type Definitions
 * 
 * This module provides type definitions for authentication-related functionality.
 * 
 * @module types/security/authTypes
 */

/**
 * Authentication method types
 */
export type AuthMethod = 'password' | 'oauth' | 'magic_link' | 'sso' | 'mfa';

/**
 * User authentication status
 */
export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading';

/**
 * Multi-factor authentication types
 */
export type MfaType = 'totp' | 'sms' | 'email' | 'recovery_code';

/**
 * Authentication error types
 */
export enum AuthErrorType {
  INVALID_CREDENTIALS = 'invalid_credentials',
  EXPIRED_SESSION = 'expired_session',
  ACCOUNT_LOCKED = 'account_locked',
  MFA_REQUIRED = 'mfa_required',
  NETWORK_ERROR = 'network_error',
  UNKNOWN_ERROR = 'unknown_error'
}

/**
 * Authentication error data
 */
export interface AuthError {
  /**
   * Error type
   */
  type: AuthErrorType;
  
  /**
   * Error message
   */
  message: string;
  
  /**
   * Error code, if applicable
   */
  code?: string;
  
  /**
   * Additional error details
   */
  details?: Record<string, unknown>;
}

/**
 * User session data
 */
export interface AuthSession {
  /**
   * Session ID
   */
  id: string;
  
  /**
   * User ID associated with this session
   */
  userId: string;
  
  /**
   * When the session was created
   */
  createdAt: Date;
  
  /**
   * When the session expires
   */
  expiresAt: Date;
  
  /**
   * IP address that created the session
   */
  ipAddress?: string;
  
  /**
   * User agent string from the browser/device
   */
  userAgent?: string;
  
  /**
   * Whether this is the current active session
   */
  isCurrentSession?: boolean;
}

/**
 * Login attempt data
 */
export interface LoginAttempt {
  /**
   * IP address of the attempt
   */
  ipAddress: string;
  
  /**
   * User agent of the device/browser
   */
  userAgent: string;
  
  /**
   * Username or email attempted
   */
  identifier: string;
  
  /**
   * Whether the attempt was successful
   */
  success: boolean;
  
  /**
   * Failure reason if unsuccessful
   */
  failureReason?: string;
  
  /**
   * Timestamp of the attempt
   */
  timestamp: Date;
}
