
/**
 * Canvas error type definitions
 * @module utils/canvas/monitoring/errorTypes
 */

/**
 * Severity levels for canvas errors
 */
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * Canvas error categories
 */
export enum ErrorCategory {
  INITIALIZATION = 'initialization',
  RENDERING = 'rendering',
  INTERACTION = 'interaction',
  TOOL = 'tool',
  GRID = 'grid',
  OBJECTS = 'objects',
  PERFORMANCE = 'performance',
  OTHER = 'other'
}

/**
 * Canvas error information structure
 */
export interface CanvasErrorInfo {
  /** Error message */
  message: string;
  /** Error category */
  category: ErrorCategory;
  /** Error severity */
  severity: ErrorSeverity;
  /** Stack trace if available */
  stack?: string;
  /** Timestamp when error occurred */
  timestamp: number;
  /** Additional context about the error */
  context?: Record<string, any>;
}
