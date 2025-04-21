
/**
 * Audit Logging Type Definitions
 * 
 * This module provides type definitions for audit logging functionality,
 * used for tracking user actions and system events for security and compliance.
 * 
 * @module types/security/auditTypes
 */

/**
 * Represents a single entry in the audit log
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
   * Resource that was acted upon (e.g., "floor_plan", "user", "settings")
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
 * Audit severity levels
 */
export enum AuditSeverity {
  /**
   * Informational events that don't require attention
   */
  INFO = 'info',
  
  /**
   * Events that may require monitoring
   */
  WARNING = 'warning',
  
  /**
   * Events that require attention
   */
  ERROR = 'error',
  
  /**
   * Critical security events that require immediate attention
   */
  CRITICAL = 'critical'
}

/**
 * Configuration options for audit logging
 */
export interface AuditConfig {
  /**
   * Whether audit logging is enabled
   * @default true
   */
  enabled: boolean;
  
  /**
   * Where audit logs should be stored
   * @default 'database'
   */
  storage: 'database' | 'file' | 'memory';
  
  /**
   * Minimum severity level to log
   * @default AuditSeverity.INFO
   */
  minSeverity: AuditSeverity;
  
  /**
   * Whether to include user details in logs
   * @default true
   */
  includeUserDetails: boolean;
  
  /**
   * Whether to include IP addresses in logs
   * @default true
   */
  includeIpAddress: boolean;
}

/**
 * Audit search parameters for querying logs
 */
export interface AuditSearchParams {
  /**
   * Start timestamp for the search range
   */
  startDate?: Date;
  
  /**
   * End timestamp for the search range
   */
  endDate?: Date;
  
  /**
   * User ID to filter by
   */
  userId?: string;
  
  /**
   * Action to filter by
   */
  action?: string;
  
  /**
   * Resource to filter by
   */
  resource?: string;
  
  /**
   * Status to filter by
   */
  status?: 'success' | 'failure';
  
  /**
   * IP address to filter by
   */
  ipAddress?: string;
  
  /**
   * Maximum number of results to return
   * @default 100
   */
  limit?: number;
  
  /**
   * Number of results to skip (for pagination)
   * @default 0
   */
  offset?: number;
}

/**
 * Audit log service interface
 */
export interface AuditLogService {
  /**
   * Log an audit event
   * @param entry - The audit log entry to record
   */
  log(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<AuditLogEntry>;
  
  /**
   * Search audit logs
   * @param params - Search parameters
   */
  search(params: AuditSearchParams): Promise<AuditLogEntry[]>;
  
  /**
   * Get a specific audit log entry by ID
   * @param id - The audit log entry ID
   */
  getById(id: string): Promise<AuditLogEntry | null>;
  
  /**
   * Initialize the audit log service
   * @param config - Configuration options
   */
  initialize(config: AuditConfig): Promise<void>;
}
