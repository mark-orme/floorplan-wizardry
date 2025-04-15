/**
 * Canvas Props Interface
 * @module types/hooks/useCanvasProps
 */
import { FabricCanvas } from "@/types/fabric";
import { DrawingTool } from "@/types/core/DrawingTool";

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
