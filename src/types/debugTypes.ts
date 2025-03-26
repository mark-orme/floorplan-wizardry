
/**
 * Debug information state type definitions
 * @module debugTypes
 */

/**
 * Debug information state for tracking canvas initialization and grid creation
 * @interface DebugInfoState
 */
export interface DebugInfoState {
  /** Whether the canvas has been initialized */
  canvasInitialized: boolean;
  /** Whether the grid has been created */
  gridCreated: boolean;
  /** Whether the canvas dimensions have been set */
  dimensionsSet: boolean;
  /** Whether the brush has been initialized */
  brushInitialized: boolean;
  /** Index signature to allow additional debug properties */
  [key: string]: unknown;
}
