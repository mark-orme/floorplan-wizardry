
/**
 * Debug information state type definition
 * @module core/DebugInfo
 */
import { CanvasDimensions } from './Geometry';
import { PerformanceStats } from '../performanceTypes';

/**
 * Debug info state interface
 * Tracks debug and performance information
 * @interface DebugInfoState
 */
export interface DebugInfoState {
  /** Whether to show debug info */
  showDebugInfo: boolean;
  /** Whether canvas is initialized */
  canvasInitialized: boolean;
  /** Whether dimensions are set */
  dimensionsSet: boolean;
  /** Whether grid is created */
  gridCreated: boolean;
  /** Whether brush is initialized */
  brushInitialized: boolean;
  /** Whether canvas is ready */
  canvasReady: boolean;
  /** Whether canvas is created */
  canvasCreated: boolean;
  /** Whether canvas is loaded */
  canvasLoaded: boolean;
  /** Whether event handlers are set */
  eventHandlersSet: boolean;
  /** Whether canvas events are registered */
  canvasEventsRegistered: boolean;
  /** Whether grid is rendered */
  gridRendered: boolean;
  /** Whether tools are initialized */
  toolsInitialized: boolean;
  /** Last initialization time */
  lastInitTime: number;
  /** Last grid creation time */
  lastGridCreationTime: number;
  /** Grid object count */
  gridObjectCount: number;
  /** Canvas dimensions */
  canvasDimensions: CanvasDimensions;
  /** Whether there's an error */
  hasError: boolean;
  /** Error message */
  errorMessage: string;
  /** Performance stats */
  performanceStats: PerformanceStats;
  /** Additional properties */
  [key: string]: boolean | number | string | object;
}

/**
 * Default debug state with all required properties
 */
export const DEFAULT_DEBUG_STATE: DebugInfoState = {
  showDebugInfo: false,
  canvasInitialized: false,
  dimensionsSet: false,
  gridCreated: false,
  brushInitialized: false,
  canvasReady: false,
  canvasCreated: false,
  canvasLoaded: false,
  eventHandlersSet: false,
  canvasEventsRegistered: false,
  gridRendered: false,
  toolsInitialized: false,
  lastInitTime: 0,
  lastGridCreationTime: 0,
  gridObjectCount: 0,
  canvasDimensions: { width: 0, height: 0 },
  hasError: false,
  errorMessage: '',
  performanceStats: {}
};
