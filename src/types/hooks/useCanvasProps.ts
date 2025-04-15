
/**
 * Canvas Props Interface
 * @module types/hooks/useCanvasProps
 */
import { FabricCanvas } from "@/types/fabric";
import { DrawingTool } from "@/types/core/DrawingTool";
import { MutableRefObject } from "react";

/**
 * Debug info state for tracking canvas initialization
 */
export interface DebugInfoState {
  /** Whether an error has occurred */
  hasError: boolean;
  /** Error message if any */
  errorMessage: string;
  /** Last initialization time */
  lastInitTime: number;
  /** Last grid creation time */
  lastGridCreationTime: number;
  /** Whether event handlers are set */
  eventHandlersSet: boolean;
  /** Whether canvas events are registered */
  canvasEventsRegistered: boolean;
  /** Whether grid is rendered */
  gridRendered: boolean;
  /** Whether tools are initialized */
  toolsInitialized: boolean;
  /** Whether grid is created */
  gridCreated: boolean;
  /** Whether canvas is initialized */
  canvasInitialized: boolean;
  /** Whether dimensions are set */
  dimensionsSet: boolean;
  /** Whether brush is initialized */
  brushInitialized: boolean;
  /** Whether canvas is ready */
  canvasReady: boolean;
  /** Whether canvas is created */
  canvasCreated: boolean;
  /** Number of grid objects */
  gridObjectCount: number;
  /** Canvas dimensions */
  canvasDimensions: {
    width: number;
    height: number;
  };
  /** Last error */
  lastError: string;
  /** Last refresh time */
  lastRefresh: number;
  /** Last error time */
  lastErrorTime?: number;
}

/**
 * Props for useCanvasOperations hook
 */
export interface UseCanvasOperationsProps {
  /** Canvas setter function */
  setCanvas?: (canvas: FabricCanvas | null) => void;
  /** Current drawing tool */
  tool: DrawingTool;
  /** Tool setter function */
  setTool: (tool: DrawingTool) => void;
  /** Current line color */
  lineColor: string;
  /** Current line thickness */
  lineThickness: number;
  /** Line color setter function */
  setLineColor: (color: string) => void;
  /** Line thickness setter function */
  setLineThickness: (thickness: number) => void;
  /** Whether undo is available */
  canUndo: boolean;
  /** Whether redo is available */
  canRedo: boolean;
  /** Set undo availability */
  setCanUndo: (canUndo: boolean) => void;
  /** Set redo availability */
  setCanRedo: (canRedo: boolean) => void;
}

/**
 * Result of useCanvasOperations hook
 */
export interface UseCanvasOperationsResult {
  /** Reference to canvas component */
  canvasComponentRef: MutableRefObject<any>;
  /** Set canvas reference function */
  setCanvasRef: (ref: any) => void;
  /** Canvas cleanup function */
  cleanupCanvas: () => void;
  /** Handle tool change function */
  handleToolChange: (tool: DrawingTool) => void;
  /** Handle undo function */
  handleUndo: () => void;
  /** Handle redo function */
  handleRedo: () => void;
  /** Handle zoom function */
  handleZoom: (zoomFactor: number) => void;
  /** Handle clear function */
  handleClear: () => void;
  /** Handle save function */
  handleSave: () => void;
  /** Handle delete function */
  handleDelete: () => void;
  /** Handle line thickness change function */
  handleLineThicknessChange: (thickness: number) => void;
  /** Handle line color change function */
  handleLineColorChange: (color: string) => void;
}

/**
 * Props for useCanvasInitialization hook
 */
export interface UseCanvasInitializationProps {
  /** Canvas reference */
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  /** Debug info state setter */
  setDebugInfo: (info: DebugInfoState | ((prev: DebugInfoState) => DebugInfoState)) => void;
  /** Optional initial drawing tool */
  initialTool?: DrawingTool;
}
