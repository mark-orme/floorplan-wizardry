
/**
 * Security Type Definitions
 * 
 * This module provides centralized type definitions for security-related features.
 * Import these types when implementing security features to ensure type safety.
 * 
 * @module types/security
 */

// Re-export all security types from their respective modules
export * from './auditTypes';
export * from './csrfTypes';
export * from './cspTypes';
export * from './authTypes';
export * from './encryptionTypes';

// Export interfaces from security-types.ts (creating compatibility layer)
export type { 
  SafeUserInput,
  SecurityConfig,
  AuditLogEntry,
  SecurityViolation,
  SecurityCheck,
  SecurityCheckStatus,
  Vulnerability,
  SecurityReport,
  RateLimitViolation,
  SecretRotationLog
} from '../security-types';
