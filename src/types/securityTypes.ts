
/**
 * Security-related type definitions
 */

/**
 * Represents a security check that can be performed on the application
 */
export interface SecurityCheck {
  id: string;
  name: string;
  description: string;
  status: 'passed' | 'failed' | 'warning' | 'pending';
  details?: string;
}

/**
 * Security check result status values
 */
export type SecurityCheckStatus = 'passed' | 'failed' | 'warning' | 'pending';

/**
 * Security check category
 */
export enum SecurityCheckCategory {
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  DATA_VALIDATION = 'data_validation',
  COMMUNICATION = 'communication',
  STORAGE = 'storage',
  DEPENDENCY = 'dependency'
}

/**
 * Security check severity level
 */
export enum SecuritySeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}
