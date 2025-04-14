
/**
 * Sentry types
 * Type definitions for Sentry-related utilities
 */

// Result of input validation
export interface InputValidationResult {
  valid: boolean;
  message?: string;
  fields?: Record<string, string[]>;
  severity?: 'low' | 'medium' | 'high';
}

// Security context for Sentry
export interface SecurityContext {
  level: 'low' | 'medium' | 'high';
  details: string;
  impact?: string;
  recommendations?: string[];
}

// Options for captureError
export interface CaptureErrorOptions {
  level?: 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug';
  tags?: Record<string, string>;
  extra?: Record<string, any>;
  context?: Record<string, any>;
  user?: { 
    id?: string; 
    email?: string; 
    username?: string;
    role?: string;
  };
  security?: SecurityContext;
}

// Options for captureMessage
export interface CaptureMessageOptions {
  level?: 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug';
  tags?: Record<string, string>;
  extra?: Record<string, any>;
  context?: Record<string, any>;
  user?: { 
    id?: string; 
    email?: string; 
    username?: string;
    role?: string;
  };
}

// Alias for backward compatibility
export type ErrorCaptureOptions = CaptureErrorOptions;

// Drawing session context
export interface DrawingSessionContext {
  sessionId: string;
  startTime: number;
  duration: number;
  activeTools: string[];
  objectCount: number;
  changes: number;
}

// Extended error with drawing context
export interface DrawingError extends Error {
  toolContext?: {
    activeTool: string;
    lineColor?: string;
    lineThickness?: number;
  };
  canvasState?: {
    width: number;
    height: number;
    zoom: number;
    objectCount: number;
  };
}

// Transaction options for performance monitoring
export interface TransactionOptions {
  tags?: Record<string, string>;
  data?: Record<string, any>;
  context?: Record<string, any>;
}

// Transaction result with control methods
export interface TransactionResult {
  finish: (status?: string | number) => void;
  setName: (name: string) => void;
  setStatus: (status: string) => void;
  setTag: (key: string, value: string) => void;
  setData: (key: string, value: any) => void;
}
