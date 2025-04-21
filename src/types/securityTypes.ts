
/**
 * Security Types
 * 
 * Comprehensive type definitions for security-related features.
 * This file serves as a central location for all security type definitions.
 * 
 * @module types/securityTypes
 */

/**
 * Strict type for user input validation
 */
export type SafeUserInput = {
  /**
   * The input value to validate
   */
  readonly value: string;
  
  /**
   * The type of content expected
   */
  readonly type: 'text' | 'html' | 'url' | 'email';
  
  /**
   * Maximum length of the input
   */
  readonly maxLength: number;
};

/**
 * Security configuration options
 */
export interface SecurityConfig {
  /**
   * Whether CSRF protection is enabled
   */
  readonly csrfEnabled: boolean;
  
  /**
   * Number of requests allowed in the rate limit window
   */
  readonly rateLimitRequests: number;
  
  /**
   * Rate limit window in milliseconds
   */
  readonly rateLimitWindowMs: number;
  
  /**
   * Maximum upload size in MB
   */
  readonly maxUploadSizeMb: number;
  
  /**
   * List of allowed file types for uploads
   */
  readonly allowedFileTypes: readonly string[];
  
  /**
   * List of allowed origins for CORS
   */
  readonly allowedOrigins: readonly string[];
}

/**
 * Audit log entry interface
 */
export interface AuditLogEntry {
  /**
   * Unique identifier for the log entry
   */
  id?: string;
  
  /**
   * Timestamp when the event occurred
   */
  timestamp: Date;
  
  /**
   * User ID associated with the action
   */
  userId: string;
  
  /**
   * Action performed (e.g., "create", "update", "delete", "login")
   */
  action: string;
  
  /**
   * Resource that was acted upon
   */
  resource: string;
  
  /**
   * Status of the action
   */
  status: 'success' | 'failure';
  
  /**
   * Additional details about the action
   */
  details?: Record<string, unknown>;
  
  /**
   * IP address from which the action was performed
   */
  ipAddress?: string;
}

/**
 * Security violation report
 */
export interface SecurityViolation {
  /**
   * Type of violation
   */
  readonly type: 'csrf' | 'xss' | 'injection' | 'unauthorized';
  
  /**
   * Severity level of the violation
   */
  readonly severity: 'low' | 'medium' | 'high' | 'critical';
  
  /**
   * Details about the violation
   */
  readonly details: string;
  
  /**
   * When the violation occurred
   */
  readonly timestamp: Date;
  
  /**
   * Data associated with the request that caused the violation
   */
  readonly requestData: Record<string, unknown>;
}

/**
 * Security check status
 */
export type SecurityCheckStatus = 'pending' | 'passed' | 'failed' | 'warning';

/**
 * Security check interface
 */
export interface SecurityCheck {
  /**
   * Unique identifier for the check
   */
  id: string;
  
  /**
   * Name of the check
   */
  name: string;
  
  /**
   * Description of the check
   */
  description: string;
  
  /**
   * Current status of the check
   */
  status: SecurityCheckStatus;
  
  /**
   * Additional details about the check
   */
  details?: string;
  
  /**
   * When the check was last run
   */
  lastRun?: Date;
}

/**
 * Vulnerability interface
 */
export interface Vulnerability {
  /**
   * Unique identifier for the vulnerability
   */
  id: string;
  
  /**
   * Name of the vulnerability
   */
  name: string;
  
  /**
   * Description of the vulnerability
   */
  description: string;
  
  /**
   * Severity level
   */
  severity: 'low' | 'moderate' | 'high' | 'critical';
  
  /**
   * Component affected by the vulnerability
   */
  affectedComponent?: string;
  
  /**
   * How to fix the vulnerability
   */
  remediation?: string;
  
  /**
   * When the vulnerability was discovered
   */
  discoveredAt: Date;
  
  /**
   * When the vulnerability was fixed
   */
  fixedAt?: Date;
  
  /**
   * Current status of the vulnerability
   */
  status: 'open' | 'fixed' | 'ignored';
}

/**
 * Security report interface
 */
export interface SecurityReport {
  /**
   * Unique identifier for the report
   */
  id: string;
  
  /**
   * Report name
   */
  name: string;
  
  /**
   * Report description
   */
  description: string;
  
  /**
   * When the report was created
   */
  createdAt: Date;
  
  /**
   * Type of report
   */
  type: 'vulnerability' | 'audit' | 'compliance';
  
  /**
   * Report findings
   */
  findings: Array<Vulnerability | AuditLogEntry>;
  
  /**
   * Summary statistics
   */
  summary: {
    /**
     * Number of critical issues
     */
    critical: number;
    
    /**
     * Number of high-severity issues
     */
    high: number;
    
    /**
     * Number of moderate-severity issues
     */
    moderate: number;
    
    /**
     * Number of low-severity issues
     */
    low: number;
    
    /**
     * Number of checks that passed
     */
    passed: number;
    
    /**
     * Number of checks that failed
     */
    failed: number;
  };
}

/**
 * Rate limit violation interface
 */
export interface RateLimitViolation {
  /**
   * Unique identifier for the violation
   */
  id: string;
  
  /**
   * When the violation occurred
   */
  timestamp: Date;
  
  /**
   * Endpoint that was being accessed
   */
  endpoint: string;
  
  /**
   * IP address of the request
   */
  ipAddress: string;
  
  /**
   * User ID if authenticated
   */
  userId?: string;
  
  /**
   * Number of requests made
   */
  requestCount: number;
  
  /**
   * Duration of the block in milliseconds
   */
  blockDuration: number;
  
  /**
   * Request headers
   */
  headers?: Record<string, string>;
}

/**
 * Secret rotation log interface
 */
export interface SecretRotationLog {
  /**
   * Unique identifier for the log entry
   */
  id: string;
  
  /**
   * Name of the secret
   */
  secretName: string;
  
  /**
   * When the secret was rotated
   */
  rotatedAt: Date;
  
  /**
   * Who rotated the secret
   */
  rotatedBy: string;
  
  /**
   * Reason for rotation
   */
  reason: 'scheduled' | 'manual' | 'compromise';
  
  /**
   * Previous expiry date
   */
  previousExpiry?: Date;
  
  /**
   * New expiry date
   */
  newExpiry?: Date;
}
