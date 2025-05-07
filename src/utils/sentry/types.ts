
/**
 * Type definitions for Sentry utilities
 */

export interface CaptureErrorOptions {
  level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug';
  tags?: Record<string, string>;
  extra?: Record<string, any>;
  user?: {
    id?: string;
    email?: string;
    username?: string;
  };
  context?: Record<string, any>;
  security?: Record<string, any>;
}

export interface CaptureMessageOptions {
  level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug';
  tags?: Record<string, string>;
  extra?: Record<string, any>;
  user?: {
    id?: string;
    email?: string;
    username?: string;
  };
  context?: Record<string, any>;
}

export interface InputValidationResult {
  valid: boolean;
  errors: string[];
  field: string;
}
