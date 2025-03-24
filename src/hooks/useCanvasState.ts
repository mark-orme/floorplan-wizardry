/**
 * Custom hook for centralized canvas state management
 * @module useCanvasState
 */
import { useState, useEffect } from "react";
import { FloorPlan } from "@/utils/drawing";

/**
 * Type for drawing tools including the select tool
 */
export type DrawingTool = "draw" | "room" | "straightLine" | "hand" | "select";

/**
 * Hook for managing canvas state
 * @returns Canvas state and setters
 */
export const useCanvasState = () => {
  // Default to straightLine (wall) tool as requested
  const [tool, setTool] = useState<DrawingTool>("straightLine");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [gia, setGia] = useState(0);
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
  const [currentFloor, setCurrentFloor] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 800, height: 600 });
  const [lineThickness, setLineThickness] = useState(2);
  const [lineColor, setLineColor] = useState("#000000");
  
  // Ensure tool is set to straightLine on initial load
  useEffect(() => {
    console.log("Initial tool set to straightLine");
    setTool("straightLine");
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
