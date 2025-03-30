
import React, { createContext, useContext, useState, useRef } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { DrawingTool } from "@/hooks/useCanvasState";
import { DebugInfoState } from "@/types/core/DebugInfo";
import { FloorPlan } from "@/types/floorPlanTypes";
import { ZoomDirection } from "@/types/drawingTypes";

/**
 * Canvas controller context type
 */
interface CanvasControllerContextType {
  // Canvas state
  canvas: FabricCanvas | null;
  setCanvas: React.Dispatch<React.SetStateAction<FabricCanvas | null>>;
  
  // Core functionality
  clearCanvas: () => void;
  
  // Drawing tools state
  tool?: DrawingTool;
  lineThickness?: number;
  lineColor?: string;
  
  // Measurement
  gia?: number;
  
  // Floor plans
  floorPlans?: FloorPlan[];
  currentFloor?: number;
  
  // Debug info
  debugInfo?: DebugInfoState;
  
  // UI refs
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  
  // Actions
  handleToolChange?: (tool: DrawingTool) => void;
  handleUndo?: () => void;
  handleRedo?: () => void;
  handleZoom?: (direction: ZoomDirection) => void;
  saveCanvas?: () => boolean;
  deleteSelectedObjects?: () => void;
  handleFloorSelect?: (floorIndex: number) => void;
  handleAddFloor?: () => void;
  handleLineThicknessChange?: (thickness: number) => void; 
  handleLineColorChange?: (color: string) => void;
  openMeasurementGuide?: () => void;
}

// Create context with default values
const CanvasControllerContext = createContext<CanvasControllerContextType | null>(null);

/**
 * Props for the CanvasControllerProvider
 */
interface CanvasControllerProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component for canvas controller context
 */
export const CanvasControllerProvider: React.FC<CanvasControllerProviderProps> = ({ children }) => {
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  
  // Create refs for canvas components
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /**
   * Clear all objects from canvas
   */
  const clearCanvas = () => {
    if (!canvas) return;
    
    // Get all objects that are not grid
    const nonGridObjects = canvas.getObjects().filter(obj => (obj as any).objectType !== 'grid');
    
    // Remove non-grid objects
    nonGridObjects.forEach(obj => {
      canvas.remove(obj);
    });
    
    // Force render
    canvas.requestRenderAll();
  };

  return (
    <CanvasControllerContext.Provider value={{ 
      canvas, 
      setCanvas, 
      clearCanvas,
      canvasRef
    }}>
      {children}
    </CanvasControllerContext.Provider>
  );
};

/**
 * Hook to access canvas controller context
 * @returns {CanvasControllerContextType} Canvas controller context
 */
export const useCanvasController = (): CanvasControllerContextType => {
  const context = useContext(CanvasControllerContext);
  
  if (!context) {
    throw new Error("useCanvasController must be used within a CanvasControllerProvider");
  }
  
  return context;
};
