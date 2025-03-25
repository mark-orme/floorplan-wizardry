
import { useState, useEffect, useCallback } from "react";
import { DrawingTool } from "./useCanvasState";

/**
 * Hook to manage the measurement guide visibility
 */
export const useMeasurementGuide = (tool: DrawingTool) => {
  // Always declare state at the top level
  const [showMeasurementGuide, setShowMeasurementGuide] = useState(false);
  
  // Save user preference - defined at the top level
  const handleCloseMeasurementGuide = useCallback((dontShowAgain: boolean) => {
    setShowMeasurementGuide(false);
    if (dontShowAgain) {
      localStorage.setItem("hideDrawingGuide", "true");
    }
  }, []);
  
  // Show the guide automatically when switching to line tools
  useEffect(() => {
    // Guard against undefined tool with default value
    const currentTool = tool || "select";
    
    // Only show guide when using line tools and user hasn't dismissed it before
    if ((currentTool === "straightLine" || currentTool === "room") && 
        !localStorage.getItem("hideDrawingGuide")) {
      setShowMeasurementGuide(true);
    }
  }, [tool]); // Only depend on tool changes
  
  // Return values that remain consistent between renders
  return {
    showMeasurementGuide,
    setShowMeasurementGuide,
    handleCloseMeasurementGuide
  };
};
