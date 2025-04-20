
import * as Sentry from '@sentry/react';

/**
 * Options for captureError function
 */
export interface CaptureErrorOptions {
  /** Severity level */
  level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug';
  /** Tags for filtering */
  tags?: Record<string, string>;
  /** Extra context data */
  extra?: Record<string, any>;
  /** Context about where the error occurred */
  context?: Record<string, any>;
  /** User information */
  user?: {
    id?: string;
    email?: string;
    username?: string;
    [key: string]: any;
  };
  /** Security related context */
  security?: Record<string, any>;
}

/**
 * Options for captureMessage function
 */
export interface CaptureMessageOptions {
  /** Severity level */
  level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug';
  /** Tags for filtering */
  tags?: Record<string, string>;
  /** Extra context data */
  extra?: Record<string, any>;
  /** Context about where the error occurred */
  context?: Record<string, any>;
  /** User information */
  user?: {
    id?: string;
    email?: string;
    username?: string;
    [key: string]: any;
  };
}

/**
 * Result of input validation
 */
export interface InputValidationResult {
  /** Whether validation passed */
  valid: boolean;
  /** Error message if validation failed */
  message?: string;
  /** Validation errors */
  errors?: Record<string, string>;
  /** Sanitized data if validation passed */
  sanitizedData?: any;
  /** Validation errors by field */
  fields?: Record<string, string[]>;
}
