
/**
 * Custom hook for centralized canvas state management
 * @module useCanvasState
 */
import { useState } from "react";
import { FloorPlan } from "@/utils/drawing";

/**
 * Hook for managing canvas state
 * @returns Canvas state and setters
 */
export const useCanvasState = () => {
  // Default to straightLine (wall) tool as requested
  const [tool, setTool] = useState<"draw" | "room" | "straightLine">("straightLine");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [gia, setGia] = useState(0);
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
  const [currentFloor, setCurrentFloor] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 800, height: 600 });

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
    setCanvasDimensions
  };
};
