
/**
 * Type definitions for security-related features
 */

/**
 * Strict type for user input validation
 */
export type SafeUserInput = {
  readonly value: string;
  readonly type: 'text' | 'html' | 'url' | 'email';
  readonly maxLength: number;
};

/**
 * Security configuration options
 */
export interface SecurityConfig {
  readonly csrfEnabled: boolean;
  readonly rateLimitRequests: number;
  readonly rateLimitWindowMs: number;
  readonly maxUploadSizeMb: number;
  readonly allowedFileTypes: readonly string[];
  readonly allowedOrigins: readonly string[];
}

/**
 * Audit log entry type
 */
export interface AuditLogEntry {
  readonly timestamp: Date;
  readonly userId: string;
  readonly action: string;
  readonly resource: string;
  readonly status: 'success' | 'failure';
  readonly details: Record<string, unknown>;
  readonly ipAddress: string;
}

/**
 * Security violation report
 */
export interface SecurityViolation {
  readonly type: 'csrf' | 'xss' | 'injection' | 'unauthorized';
  readonly severity: 'low' | 'medium' | 'high' | 'critical';
  readonly details: string;
  readonly timestamp: Date;
  readonly requestData: Record<string, unknown>;
}
