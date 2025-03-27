
/**
 * Debug information state type definitions
 * @module debugTypes
 */

/**
 * Debug information state interface
 * @interface DebugInfoState
 */
export interface DebugInfoState {
  /** Whether to show debug information */
  showDebugInfo: boolean;
  /** Whether canvas has been initialized */
  canvasInitialized: boolean;
  /** Whether dimensions have been set */
  dimensionsSet: boolean;
  /** Grid initialization state */
  gridInitialized?: boolean;
  /** Custom debug messages */
  messages?: string[];
  /** Amount of objects on canvas */
  objectCount?: number;
  /** Canvas dimensions */
  dimensions?: {
    width: number;
    height: number;
  };
  /** Current tool */
  currentTool?: string;
  /** Canvas initialization time */
  initTime?: number;
}
