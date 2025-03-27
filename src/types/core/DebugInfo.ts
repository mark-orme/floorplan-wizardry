
/**
 * Debug information state types
 * @module types/core/DebugInfo
 */

/**
 * Debug information state interface
 * Contains properties for tracking debug state
 */
export interface DebugInfoState {
  /** Whether the application has an error */
  hasError: boolean;
  /** Error message if an error occurred */
  errorMessage: string;
  /** Time taken for last initialization */
  lastInitTime: number;
  /** Time taken for last grid creation */
  lastGridCreationTime: number;
  /** Whether event handlers have been set */
  eventHandlersSet: boolean;
  /** Whether canvas events are registered */
  canvasEventsRegistered: boolean;
  /** Whether the grid has been rendered */
  gridRendered: boolean;
  /** Whether drawing tools have been initialized */
  toolsInitialized: boolean;
  /** Whether the grid has been created */
  gridCreated: boolean;
  /** Additional debug properties */
  [key: string]: string | number | boolean | object;
}

/**
 * Default debug state
 * Initialize with default values
 */
export const DEFAULT_DEBUG_STATE: DebugInfoState = {
  hasError: false,
  errorMessage: '',
  lastInitTime: 0,
  lastGridCreationTime: 0,
  eventHandlersSet: false,
  canvasEventsRegistered: false,
  gridRendered: false,
  toolsInitialized: false,
  gridCreated: false
};
