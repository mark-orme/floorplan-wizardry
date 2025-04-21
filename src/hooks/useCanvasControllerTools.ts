
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { DrawingTool } from "@/types/canvasStateTypes";
import { FloorPlan } from "@/types/floorPlanTypes";
import { useFloorPlanGIA } from "@/hooks/useFloorPlanGIA";
import { useCanvasToolsManager } from "./canvas/controller/useCanvasToolsManager";
import { useCanvasToolsGIA } from "./canvas/controller/useCanvasToolsGIA";

// Create the proper props interface for the useCanvasToolsManager hook
interface CanvasToolsManagerProps {
  /** Reference to the Fabric canvas instance */
  canvas: any;
  /** Reference to the Fabric canvas instance */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Current zoom level */
  zoomLevel?: number; // Added as optional
  /** Current line thickness */
  lineThickness: number;
  /** Current line color */
  lineColor: string;
  /** Function to set the current tool */
  setTool: React.Dispatch<React.SetStateAction<DrawingTool>>;
  /** Function to set the zoom level */
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
  /** Array of floor plans */
  floorPlans: FloorPlan[];
  /** Current floor index */
  currentFloor: number;
  /** Function to set floor plans */
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  /** Function to set the gross internal area */
  setGia: React.Dispatch<React.SetStateAction<number>>;
  /** Function to create grid */
  createGrid: (canvas: FabricCanvas) => any[];
  /** Optional function to recalculate GIA */
  recalculateGIA?: () => void;
  /** Optional tool property for backward compatibility */
  tool?: string | DrawingTool;
}

/**
 * Props interface for useCanvasControllerTools hook
 * @interface UseCanvasControllerToolsProps
 */
interface UseCanvasControllerToolsProps {
  /** Reference to the Fabric canvas instance */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Reference to the grid layer objects */
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  /** Reference to the drawing history */
  historyRef: React.MutableRefObject<{past: any[][], future: any[][]}>;
  /** Current zoom level */
  zoomLevel: number;
  /** Current line thickness */
  lineThickness: number;
  /** Current line color */
  lineColor: string;
  /** Function to set the current tool */
  setTool: React.Dispatch<React.SetStateAction<DrawingTool>>;
  /** Function to set the zoom level */
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
  /** Array of floor plans */
  floorPlans: FloorPlan[];
  /** Current floor index */
  currentFloor: number;
  /** Function to set floor plans */
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  /** Function to set the gross internal area */
  setGia: React.Dispatch<React.SetStateAction<number>>;
  /** Function to create grid */
  createGrid: (canvas: FabricCanvas) => any[];
}

/**
 * Hook that manages canvas drawing tools and operations
 * Provides functionality for tool changes, undo/redo, zooming and saving
 * 
 * @param {UseCanvasControllerToolsProps} props - Hook properties
 * @returns Drawing tool functions and handlers
 */
export const useCanvasControllerTools = (props: UseCanvasControllerToolsProps) => {
  const {
    fabricCanvasRef,
    gridLayerRef,
    historyRef,
    zoomLevel,
    lineThickness,
    lineColor,
    setTool,
    setZoomLevel,
    floorPlans,
    currentFloor,
    setFloorPlans,
    setGia,
    createGrid
  } = props;

  // Initialize GIA calculation hook
  const { recalculateGIA } = useFloorPlanGIA({
    fabricCanvasRef,
    setGia
  });

  // Set up GIA calculation and event listeners
  useCanvasToolsGIA({
    fabricCanvasRef,
    setGia,
    recalculateGIA
  });

  // Get all drawing tool functions from the tool manager
  const toolFunctions = useCanvasToolsManager({
    canvas: fabricCanvasRef.current,
    fabricCanvasRef,
    zoomLevel,
    lineThickness,
    lineColor,
    setTool,
    setZoomLevel,
    floorPlans,
    currentFloor,
    setFloorPlans,
    setGia,
    createGrid,
    recalculateGIA
  });

  return toolFunctions;
};
