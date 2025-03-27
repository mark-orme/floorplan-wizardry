
/**
 * Grid state type definitions
 * @module core/GridState
 */

/**
 * Grid configuration interface
 */
export interface GridConfig {
  spacing: number;
  color: string;
  opacity: number;
  snapThreshold: number;
}

/**
 * Grid dimensions interface
 */
export interface GridDimensions {
  width: number;
  height: number;
  cellSize: number;
}

/**
 * Grid options interface
 */
export interface GridOptions {
  visible: boolean;
  snapToGrid: boolean;
  showLabels: boolean;
  showAxes: boolean;
}

/**
 * Grid parameters interface
 */
export interface GridParameters {
  majorGridSpacing: number;
  minorGridSpacing: number;
  majorGridColor: string;
  minorGridColor: string;
  axisColor: string;
}

/**
 * Grid style interface
 */
export interface GridStyle {
  strokeWidth: number;
  strokeDashArray: number[];
  opacity: number;
}

/**
 * Grid interface
 */
export interface Grid {
  config: GridConfig;
  dimensions: GridDimensions;
  options: GridOptions;
  parameters: GridParameters;
  style: GridStyle;
}

/**
 * Grid creation state interface
 */
export interface GridCreationState {
  isCreating: boolean;
  creationInProgress: boolean;
  consecutiveResets: number;
  maxConsecutiveResets: number;
  lastCreationTime: number;
  throttleInterval: number;
  exists: boolean;
  totalCreations: number;
  maxRecreations: number;
  minRecreationInterval: number;
  creationLock: boolean;
  inProgress: boolean;
  attempts: number;
  isCreated?: boolean;
  lastAttemptTime?: number;
  hasError?: boolean;
  errorMessage?: string;
}
