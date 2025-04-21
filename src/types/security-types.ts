
/**
 * Security Type Definitions
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

// Audit log entry interface
export interface AuditLogEntry {
  id?: string;
  timestamp: Date;
  userId: string;
  action: string;
  resource: string;
  status: 'success' | 'failure';
  details?: Record<string, unknown>;
  ipAddress?: string;
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

// Security check status
export type SecurityCheckStatus = 'pending' | 'passed' | 'failed' | 'warning';

// Security check interface
export interface SecurityCheck {
  id: string;
  name: string;
  description: string;
  status: SecurityCheckStatus;
  details?: string;
  lastRun?: Date;
}

// Vulnerability interface
export interface Vulnerability {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  affectedComponent?: string;
  remediation?: string;
  discoveredAt: Date;
  fixedAt?: Date;
  status: 'open' | 'fixed' | 'ignored';
}

// Security report interface
export interface SecurityReport {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  type: 'vulnerability' | 'audit' | 'compliance';
  findings: Array<Vulnerability | AuditLogEntry>;
  summary: {
    critical: number;
    high: number;
    moderate: number;
    low: number;
    passed: number;
    failed: number;
  };
}

// Rate limit violation interface
export interface RateLimitViolation {
  id: string;
  timestamp: Date;
  endpoint: string;
  ipAddress: string;
  userId?: string;
  requestCount: number;
  blockDuration: number;
  headers?: Record<string, string>;
}

// Secret rotation log interface
export interface SecretRotationLog {
  id: string;
  secretName: string;
  rotatedAt: Date;
  rotatedBy: string;
  reason: 'scheduled' | 'manual' | 'compromise';
  previousExpiry?: Date;
  newExpiry?: Date;
}
