
/**
 * Canvas performance and state types
 * @module types/canvas
 */

/**
 * Performance metrics for canvas rendering
 */
export interface PerformanceMetrics {
  /** Frames per second */
  fps: number;
  /** Total number of objects on canvas */
  objectCount: number;
  /** Number of visible objects (in viewport) */
  visibleObjectCount: number;
}

/**
 * Canvas state for persistence
 */
export interface CanvasState {
  /** Canvas version */
  version: string;
  /** Canvas objects */
  objects: any[];
  /** Canvas background color */
  background?: string;
  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * Canvas saving options
 */
export interface CanvasSaveOptions {
  /** Include object IDs */
  includeIds?: boolean;
  /** Include object metadata */
  includeMetadata?: boolean;
  /** Custom properties to include */
  additionalProps?: string[];
}

/**
 * Canvas loading result
 */
export interface CanvasLoadResult {
  /** Whether loading was successful */
  success: boolean;
  /** Error message if loading failed */
  error?: string;
  /** Number of objects loaded */
  objectCount?: number;
  /** Timestamp of saved state */
  timestamp?: string;
}
