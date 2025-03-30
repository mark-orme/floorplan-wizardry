
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { DrawingMode } from "@/constants/drawingModes";
import { DebugInfoState } from "@/types/drawingTypes";
import { FloorPlan } from "@/types/floorPlanTypes";
import { useUnifiedGridManagement } from "@/hooks/useUnifiedGridManagement";
import { useSyncedFloorPlans } from "@/hooks/useSyncedFloorPlans";
import { toast } from "sonner";

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

// Define the Canvas Controller context type
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

// Create the Canvas Controller context
const CanvasControllerContext = createContext<CanvasControllerContextType | null>(null);

// Export the useCanvasController hook
export const useCanvasController = () => {
  const context = useContext(CanvasControllerContext);
  if (!context) {
    throw new Error("useCanvasController must be used within a CanvasControllerProvider");
  }
  return context;
};

// Props for the CanvasControllerProvider
interface CanvasControllerProviderProps {
  children: React.ReactNode;
}

// Enhanced Canvas Controller Provider component
export const CanvasControllerEnhanced: React.FC<CanvasControllerProviderProps> = ({ children }) => {
  // State for canvas tools and settings
  const [tool, setTool] = useState<DrawingMode>(DrawingMode.SELECT);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [lineThickness, setLineThickness] = useState(2);
  const [lineColor, setLineColor] = useState("#000000");
  const [snapToGrid, setSnapToGrid] = useState(true);
  
  // State for floor plans
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
  const [currentFloor, setCurrentFloor] = useState(0);
  const [gia, setGia] = useState(0);
  
  // Debug and error state
  const [debugInfo, setDebugInfo] = useState<DebugInfoState>(DEFAULT_DEBUG_INFO);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Canvas references
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const canvasDimensions = useRef({ width: 800, height: 600 });
  
  // Use unified grid management
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
  
  // Use synced floor plans if available
  // Fix: Don't pass any argument to useSyncedFloorPlans
  useSyncedFloorPlans();
  
  // Handle any errors
  useEffect(() => {
    if (hasError) {
      toast.error(errorMessage || "An error occurred in the canvas controller");
      console.error("Canvas controller error:", errorMessage);
      
      // Update debug info
      setDebugInfo(prev => ({
        ...prev,
        hasError: true,
        errorMessage
      }));
    }
  }, [hasError, errorMessage]);
  
  // Memoize context value
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
  
  return (
    <CanvasControllerContext.Provider value={contextValue}>
      {children}
    </CanvasControllerContext.Provider>
  );
};
