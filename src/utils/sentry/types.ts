
/**
 * Type definitions for Sentry utility functions
 */
import type { User } from '@sentry/react';

// Options for captureError function
export interface CaptureErrorOptions {
  level?: 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug';
  tags?: Record<string, string>;
  extra?: Record<string, any>;
  context?: Record<string, any>;
  user?: User;
  security?: {
    csp?: string;
    hpkp?: string;
    expectCt?: string;
    expectStaple?: string;
  };
}

// Options for captureMessage function
export interface CaptureMessageOptions {
  level?: 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug';
  tags?: Record<string, string>;
  extra?: Record<string, any>;
  context?: Record<string, any>;
  user?: User;
}

// Result of input validation
export interface InputValidationResult {
  valid: boolean;
  error?: string;
  value?: any;
}
