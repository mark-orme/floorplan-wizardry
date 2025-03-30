
/**
 * Grid management type definitions
 * @module hooks/grid-management/types
 */
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { DebugInfoState } from "@/types/drawingTypes";
import { GridAttemptTracker } from "./gridAttemptTracker";

/**
 * Props for useGridManagement hook
 */
export interface UseGridManagementProps {
  /** Reference to the fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Canvas dimensions */
  canvasDimensions: { width: number; height: number };
  /** Debug information */
  debugInfo?: DebugInfoState;
  /** Function to create grid */
  createGrid: (canvas: FabricCanvas) => FabricObject[];
}

/**
 * Result of useGridManagement hook
 */
export interface UseGridManagementResult {
  /** Reference to the grid layer objects */
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
}

/**
 * Props for useDimensionChangeHandler hook
 */
export interface UseDimensionChangeHandlerProps {
  /** Current canvas dimensions */
  canvasDimensions: { width: number; height: number };
  /** Reference to Fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Reference to grid layer objects */
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  /** Function to create grid elements */
  createGrid: (canvas: FabricCanvas) => FabricObject[];
  /** Timestamp of last creation attempt */
  lastAttemptTime: number;
  /** Function to update last attempt timestamp */
  updateLastAttemptTime: (time: number) => void;
}
