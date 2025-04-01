
/**
 * Grid type definitions
 * @module utils/grid/gridTypes
 */

import { FabricObject } from 'fabric';

/**
 * Grid options interface
 */
export interface GridOptions {
  /** Grid line size (spacing between lines) */
  size?: number;
  /** Color for regular grid lines */
  stroke?: string;
  /** Width of regular grid lines */
  strokeWidth?: number;
  /** Whether to show major grid lines */
  showMajorLines?: boolean;
  /** Interval for major grid lines (in terms of regular grid lines) */
  majorInterval?: number;
  /** Color for major grid lines */
  majorStroke?: string;
  /** Width of major grid lines */
  majorStrokeWidth?: number;
}

/**
 * Grid creation result
 */
export interface GridCreationResult {
  /** Created grid objects */
  gridObjects: FabricObject[];
  /** Whether grid creation was successful */
  success: boolean;
  /** Performance metrics for grid creation */
  metrics?: Record<string, any>;
}

/**
 * Grid diagnostic result
 */
export interface GridDiagnosticResult {
  /** Canvas dimensions */
  canvasDimensions: { width: number | undefined; height: number | undefined };
  /** Whether grid exists */
  gridExists: boolean;
  /** Number of grid objects */
  gridObjectCount: number;
  /** Issues found during diagnostics */
  issues: string[];
  /** Timestamp of diagnostics */
  timestamp: string;
}
