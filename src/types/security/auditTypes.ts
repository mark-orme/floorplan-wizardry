
/**
 * Audit Logging Type Definitions
 * 
 * This module provides type definitions for security audit logging functionality.
 * 
 * @module types/security/auditTypes
 */

/**
 * Represents an entry in the security audit log
 */
export interface AuditLogEntry {
  /**
   * Unique identifier for the log entry
   */
  id?: string;
  
  /**
   * When the audited action occurred
   */
  timestamp: Date;
  
  /**
   * ID of the user who performed the action
   */
  userId: string;
  
  /**
   * The action that was performed
   */
  action: string;
  
  /**
   * The resource that was affected
   */
  resource: string;
  
  /**
   * Whether the action succeeded or failed
   */
  status: 'success' | 'failure';
  
  /**
   * Additional details about the action
   */
  details?: Record<string, unknown>;
  
  /**
   * IP address where the action originated
   */
  ipAddress?: string;
}

/**
 * Security event severity levels
 */
export enum SecuritySeverity {
  /**
   * Informational events with no security impact
   */
  INFO = 'info',
  
  /**
   * Low severity events that should be monitored
   */
  LOW = 'low',
  
  /**
   * Medium severity events that require attention
   */
  MEDIUM = 'medium',
  
  /**
   * High severity events that require immediate attention
   */
  HIGH = 'high',
  
  /**
   * Critical severity events that require immediate response
   */
  CRITICAL = 'critical'
}

/**
 * Types of security events that can be audited
 */
export enum SecurityEventType {
  /**
   * User authentication events (login, logout, etc.)
   */
  AUTHENTICATION = 'authentication',
  
  /**
   * Access control events (permission checks, etc.)
   */
  AUTHORIZATION = 'authorization',
  
  /**
   * Data access or modification events
   */
  DATA_ACCESS = 'data_access',
  
  /**
   * Configuration changes
   */
  CONFIGURATION = 'configuration',
  
  /**
   * Security policy violations
   */
  POLICY_VIOLATION = 'policy_violation',
  
  /**
   * System events (startup, shutdown, etc.)
   */
  SYSTEM = 'system'
}

/**
 * Options for creating an audit log entry
 */
export interface CreateAuditLogOptions {
  /**
   * Severity level of the event
   * @default SecuritySeverity.INFO
   */
  severity?: SecuritySeverity;
  
  /**
   * Type of security event
   * @default SecurityEventType.DATA_ACCESS
   */
  eventType?: SecurityEventType;
  
  /**
   * Whether to include user context
   * @default true
   */
  includeUserContext?: boolean;
  
  /**
   * Additional tags for filtering
   */
  tags?: string[];
}

/**
 * Factory function to create an audit log entry
 * 
 * @param action The action that was performed
 * @param resource The resource that was affected
 * @param userId ID of the user who performed the action
 * @param status Whether the action succeeded or failed
 * @param details Additional details about the action
 * @returns A properly formatted audit log entry
 */
export function createAuditLogEntry(
  action: string,
  resource: string,
  userId: string,
  status: 'success' | 'failure',
  details?: Record<string, unknown>
): AuditLogEntry {
  return {
    timestamp: new Date(),
    userId,
    action,
    resource,
    status,
    details,
    // IP address would be captured at logging time
  };
}
