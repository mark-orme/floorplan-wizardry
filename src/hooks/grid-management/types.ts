
/**
 * Grid management types
 * Type definitions for grid management hooks
 * @module grid-management/types
 */
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";

/**
 * Grid attempt tracker interface
 * Tracks grid creation attempts and status
 * @interface GridAttemptTracker
 */
export interface GridAttemptTracker {
  /** Whether initial grid creation has been attempted */
  initialAttempted: boolean;
  /** Number of attempts made to create grid */
  count: number;
  /** Maximum number of attempts allowed */
  maxAttempts: number;
  /** Whether creation was successful */
  successful: boolean;
  /** Timestamp of the last attempt */
  lastAttemptTime: number;
}

/**
 * Props for the useGridManagement hook
 * @interface UseGridManagementProps
 */
export interface UseGridManagementProps {
  /** Reference to the fabric canvas instance */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Canvas dimensions */
  canvasDimensions: { width: number, height: number } | undefined;
  /** Debug information about canvas state */
  debugInfo: {
    canvasInitialized: boolean;
    gridCreated: boolean;
    dimensionsSet: boolean;
    brushInitialized: boolean;
    [key: string]: unknown;
  };
  /** Function to create grid elements */
  createGrid: (canvas: FabricCanvas) => FabricObject[];
}

/**
 * Return type for the useGridManagement hook
 * @interface UseGridManagementResult
 */
export interface UseGridManagementResult {
  /** Reference to grid layer objects */
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
}
