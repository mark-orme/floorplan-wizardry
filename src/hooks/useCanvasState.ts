
/**
 * Custom hook for centralized canvas state management
 * @module useCanvasState
 */
import { useState, useEffect } from "react";
import type { FloorPlan } from '@/types/floorPlanTypes';
import type { CanvasDimensions } from "@/types";

/**
 * Type for drawing tools including the select tool
 */
export type DrawingTool = "draw" | "straightLine" | "hand" | "select" | "room" | "none" | 
                          "wall" | "door" | "window" | "furniture" | "area";

/**
 * Canvas state return type
 */
interface CanvasStateReturn {
  /** Currently active drawing tool */
  tool: DrawingTool;
  /** Function to set the active drawing tool */
  setTool: React.Dispatch<React.SetStateAction<DrawingTool>>;
  /** Current zoom level of the canvas */
  zoomLevel: number;
  /** Function to set the zoom level */
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
  /** Gross internal area calculation */
  gia: number;
  /** Function to set the gross internal area */
  setGia: React.Dispatch<React.SetStateAction<number>>;
  /** Array of floor plans in the project */
  floorPlans: FloorPlan[];
  /** Function to update the floor plans */
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  /** Current active floor index */
  currentFloor: number;
  /** Function to set the current floor index */
  setCurrentFloor: React.Dispatch<React.SetStateAction<number>>;
  /** Loading state of the canvas */
  isLoading: boolean;
  /** Function to set the loading state */
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  /** Canvas dimensions (width and height) */
  canvasDimensions: CanvasDimensions;
  /** Function to set canvas dimensions */
  setCanvasDimensions: React.Dispatch<React.SetStateAction<CanvasDimensions>>;
  /** Line thickness for drawing */
  lineThickness: number;
  /** Function to set line thickness */
  setLineThickness: React.Dispatch<React.SetStateAction<number>>;
  /** Line color for drawing */
  lineColor: string;
  /** Function to set line color */
  setLineColor: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * Hook for managing canvas state
 * @returns Canvas state and setters
 */
export const useCanvasState = (): CanvasStateReturn => {
  // Default to "select" tool instead of "none"
  const [tool, setTool] = useState<DrawingTool>("select");
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [gia, setGia] = useState<number>(0);
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
  const [currentFloor, setCurrentFloor] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [canvasDimensions, setCanvasDimensions] = useState<CanvasDimensions>({ width: 800, height: 600 });
  const [lineThickness, setLineThickness] = useState<number>(2);
  const [lineColor, setLineColor] = useState<string>("#000000");
  
  // Initial log only once during component lifecycle
  useEffect(() => {
    console.log("Initial tool set to select");
  }, []);

  return {
    // Tool state
    tool,
    setTool,
    
    // Zoom state
    zoomLevel,
    setZoomLevel,
    
    // Measurement state
    gia,
    setGia,
    
    // Floor plans state
    floorPlans,
    setFloorPlans,
    currentFloor,
    setCurrentFloor,
    
    // Loading state
    isLoading,
    setIsLoading,
    
    // Canvas dimensions
    canvasDimensions,
    setCanvasDimensions,
    
    // Line settings
    lineThickness,
    setLineThickness,
    lineColor,
    setLineColor
  };
};

