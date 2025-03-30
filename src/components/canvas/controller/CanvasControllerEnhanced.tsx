
/**
 * Enhanced Canvas Controller Component
 * Provides unified state management and control for the canvas
 * @module components/canvas/controller/CanvasControllerEnhanced
 */
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { DrawingMode } from "@/constants/drawingModes";
import { DebugInfoState } from "@/types/drawingTypes";
import { FloorPlan } from "@/types/floorPlanTypes";
import { useUnifiedGridManagement } from "@/hooks/useUnifiedGridManagement";
import { useSyncedFloorPlans } from "@/hooks/useSyncedFloorPlans";
import { toast } from "sonner";

/**
 * Default debug information state
 * Initialized with all error flags set to false and timestamps to 0
 */
const DEFAULT_DEBUG_INFO: DebugInfoState = {
  hasError: false,
  errorMessage: "",
  lastInitTime: 0,
  lastGridCreationTime: 0,
  eventHandlersSet: false,
  canvasEventsRegistered: false,
  gridRendered: false,
  toolsInitialized: false,
  gridCreated: false,
  canvasInitialized: false,
  dimensionsSet: false,
  brushInitialized: false,
  canvasReady: false
};

/**
 * Canvas Controller context type definition
 * Defines the shape of data and functions provided by the context
 * @interface CanvasControllerContextType
 */
interface CanvasControllerContextType {
  tool: DrawingMode;
  setTool: React.Dispatch<React.SetStateAction<DrawingMode>>;
  zoomLevel: number;
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
  lineThickness: number;
  setLineThickness: React.Dispatch<React.SetStateAction<number>>;
  lineColor: string;
  setLineColor: React.Dispatch<React.SetStateAction<string>>;
  snapToGrid: boolean;
  setSnapToGrid: React.Dispatch<React.SetStateAction<boolean>>;
  floorPlans: FloorPlan[];
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  currentFloor: number;
  setCurrentFloor: React.Dispatch<React.SetStateAction<number>>;
  gia: number;
  setGia: React.Dispatch<React.SetStateAction<number>>;
  debugInfo: DebugInfoState;
  setDebugInfo: React.Dispatch<React.SetStateAction<DebugInfoState>>;
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  hasError: boolean;
  setHasError: React.Dispatch<React.SetStateAction<boolean>>;
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  createGrid: () => FabricObject[];
  checkAndFixGrid: () => void;
  forceGridCreation: () => FabricObject[];
}

// Create the context with initial null value
const CanvasControllerContext = createContext<CanvasControllerContextType | null>(null);

/**
 * Custom hook to access the Canvas Controller context
 * Throws an error if used outside of a CanvasControllerProvider
 * @returns {CanvasControllerContextType} The canvas controller context
 */
export const useCanvasController = () => {
  const context = useContext(CanvasControllerContext);
  if (!context) {
    throw new Error("useCanvasController must be used within a CanvasControllerProvider");
  }
  return context;
};

/**
 * Props for the Canvas Controller Provider
 * @interface CanvasControllerProviderProps
 */
interface CanvasControllerProviderProps {
  /** React children to be wrapped by the provider */
  children: React.ReactNode;
}

/**
 * Enhanced Canvas Controller Provider Component
 * Manages canvas state, tools, and grid functionality
 * 
 * @param {CanvasControllerProviderProps} props - Component properties
 * @returns {JSX.Element} Rendered context provider
 */
export const CanvasControllerEnhanced: React.FC<CanvasControllerProviderProps> = ({ children }) => {
  // Drawing tool and settings state
  const [tool, setTool] = useState<DrawingMode>(DrawingMode.SELECT);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [lineThickness, setLineThickness] = useState(2);
  const [lineColor, setLineColor] = useState("#000000");
  const [snapToGrid, setSnapToGrid] = useState(true);
  
  // Floor plan state
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
  const [currentFloor, setCurrentFloor] = useState(0);
  const [gia, setGia] = useState(0);
  
  // Debugging and error state
  const [debugInfo, setDebugInfo] = useState<DebugInfoState>(DEFAULT_DEBUG_INFO);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // References
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const canvasDimensions = useRef({ width: 800, height: 600 });
  
  // Initialize grid management system
  const { 
    gridLayerRef, 
    createGrid, 
    checkAndFixGrid, 
    forceGridCreation 
  } = useUnifiedGridManagement({
    fabricCanvasRef,
    canvasDimensions: canvasDimensions.current,
    zoomLevel
  });
  
  // Initialize floor plan synchronization
  // Note: No arguments needed for useSyncedFloorPlans
  useSyncedFloorPlans();
  
  // Handle error state changes
  useEffect(() => {
    if (hasError) {
      toast.error(errorMessage || "An error occurred in the canvas controller");
      console.error("Canvas controller error:", errorMessage);
      
      // Update debug info with error details
      setDebugInfo(prev => ({
        ...prev,
        hasError: true,
        errorMessage
      }));
    }
  }, [hasError, errorMessage]);
  
  // Create the context value object with all required properties
  const contextValue: CanvasControllerContextType = {
    tool,
    setTool,
    zoomLevel,
    setZoomLevel,
    lineThickness,
    setLineThickness,
    lineColor,
    setLineColor,
    snapToGrid,
    setSnapToGrid,
    floorPlans,
    setFloorPlans,
    currentFloor,
    setCurrentFloor,
    gia,
    setGia,
    debugInfo,
    setDebugInfo,
    fabricCanvasRef,
    gridLayerRef,
    hasError,
    setHasError,
    errorMessage,
    setErrorMessage,
    createGrid,
    checkAndFixGrid,
    forceGridCreation
  };
  
  // Provide the context to all children components
  return (
    <CanvasControllerContext.Provider value={contextValue}>
      {children}
    </CanvasControllerContext.Provider>
  );
};
