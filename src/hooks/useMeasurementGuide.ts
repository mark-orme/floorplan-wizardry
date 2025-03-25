
import { useState, useEffect } from "react";
import { DrawingTool } from "./useCanvasState";

/**
 * Hook to manage the measurement guide visibility
 */
export const useMeasurementGuide = (tool: DrawingTool) => {
  const [showMeasurementGuide, setShowMeasurementGuide] = useState(false);
  
  // Show the guide automatically when switching to line tools
  useEffect(() => {
    // Only run this effect if tool is defined
    if (tool && (tool === "straightLine" || tool === "room") && 
        !localStorage.getItem("hideDrawingGuide")) {
      setShowMeasurementGuide(true);
    }
  }, [tool]); // Ensure tool is the only dependency
  
  // Save user preference
  const handleCloseMeasurementGuide = (dontShowAgain: boolean) => {
    setShowMeasurementGuide(false);
    if (dontShowAgain) {
      localStorage.setItem("hideDrawingGuide", "true");
    }
  };

  return {
    showMeasurementGuide,
    setShowMeasurementGuide,
    handleCloseMeasurementGuide
  };
};
