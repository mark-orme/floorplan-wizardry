/**
 * Custom hook for centralized canvas state management
 * @module useCanvasState
 */
import { useState, useEffect } from "react";
import { FloorPlan } from "@/utils/drawing";
import { CanvasDimensions } from "@/types/drawingTypes";

/**
 * Type for drawing tools including the select tool
 */
export type DrawingTool = "draw" | "straightLine" | "hand" | "select" | "room" | "none";

/**
 * Canvas state return type
 */
interface CanvasStateReturn {
  tool: DrawingTool;
  setTool: React.Dispatch<React.SetStateAction<DrawingTool>>;
  zoomLevel: number;
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
  gia: number;
  setGia: React.Dispatch<React.SetStateAction<number>>;
  floorPlans: FloorPlan[];
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  currentFloor: number;
  setCurrentFloor: React.Dispatch<React.SetStateAction<number>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  canvasDimensions: CanvasDimensions;
  setCanvasDimensions: React.Dispatch<React.SetStateAction<CanvasDimensions>>;
  lineThickness: number;
  setLineThickness: React.Dispatch<React.SetStateAction<number>>;
  lineColor: string;
  setLineColor: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * Hook for managing canvas state
 * @returns Canvas state and setters
 */
export const useCanvasState = (): CanvasStateReturn => {
  // Default to "none" tool (no tool selected)
  const [tool, setTool] = useState<DrawingTool>("none");
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [gia, setGia] = useState<number>(0);
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
  const [currentFloor, setCurrentFloor] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [canvasDimensions, setCanvasDimensions] = useState<CanvasDimensions>({ width: 800, height: 600 });
  const [lineThickness, setLineThickness] = useState<number>(2);
  const [lineColor, setLineColor] = useState<string>("#000000");
  
  // We no longer force set the tool to straightLine on load
  useEffect(() => {
    console.log("Initial tool set to none");
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
