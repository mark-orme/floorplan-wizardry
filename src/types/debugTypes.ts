
/**
 * Debug information types
 * @module types/debugTypes
 */

// Import the canonical type definition to avoid duplication
import { DebugInfoState as CoreDebugInfoState } from './core/DebugInfo';

// Re-export the type
export type DebugInfoState = CoreDebugInfoState;

// Re-export the default state
export { DEFAULT_DEBUG_STATE } from './core/DebugInfo';

/**
 * Performance statistics interface
 */
export interface PerformanceStats {
  /** Frames per second */
  fps?: number;
  /** Number of dropped frames */
  droppedFrames?: number;
  /** Average frame time in milliseconds */
  frameTime?: number;
  /** Maximum frame time in milliseconds */
  maxFrameTime?: number;
  /** Number of long frames (frames taking longer than 16ms) */
  longFrames?: number;
  /** Additional performance metrics */
  [key: string]: number | undefined;
}
