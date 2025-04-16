
/**
 * Canvas error type definitions
 * @module utils/canvas/monitoring/errorTypes
 */

/**
 * Canvas initialization error
 */
export class CanvasInitializationError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'CanvasInitializationError';
  }
}

/**
 * Canvas rendering error
 */
export class CanvasRenderingError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'CanvasRenderingError';
  }
}

/**
 * Object creation error
 */
export class ObjectCreationError extends Error {
  constructor(message: string, public readonly details?: Record<string, unknown>) {
    super(message);
    this.name = 'ObjectCreationError';
  }
}

/**
 * Grid creation error
 */
export class GridCreationError extends Error {
  constructor(message: string, public readonly gridType?: string) {
    super(message);
    this.name = 'GridCreationError';
  }
}

/**
 * Tool initialization error
 */
export class ToolInitializationError extends Error {
  constructor(message: string, public readonly toolName?: string) {
    super(message);
    this.name = 'ToolInitializationError';
  }
}

/**
 * Event handling error
 */
export class EventHandlingError extends Error {
  constructor(message: string, public readonly eventName?: string) {
    super(message);
    this.name = 'EventHandlingError';
  }
}

/**
 * History operation error
 */
export class HistoryOperationError extends Error {
  constructor(message: string, public readonly operation?: 'undo' | 'redo' | 'save') {
    super(message);
    this.name = 'HistoryOperationError';
  }
}

/**
 * JSON serialization error
 */
export class SerializationError extends Error {
  constructor(message: string, public readonly direction?: 'toJSON' | 'fromJSON') {
    super(message);
    this.name = 'SerializationError';
  }
}

/**
 * Canvas export error
 */
export class ExportError extends Error {
  constructor(message: string, public readonly format?: string) {
    super(message);
    this.name = 'ExportError';
  }
}
