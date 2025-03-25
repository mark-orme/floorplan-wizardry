
import { useState, useEffect } from "react";
import { DrawingTool } from "./useCanvasState";

/**
 * Hook to manage the measurement guide visibility
 */
export const useMeasurementGuide = (tool: DrawingTool) => {
  const [showMeasurementGuide, setShowMeasurementGuide] = useState(false);
  
  // Show the guide automatically when switching to line tools
  // Safely handle tool being undefined initially
  useEffect(() => {
    if (!tool) return; // Guard against undefined tool
    
    // Only show guide when using line tools and user hasn't dismissed it before
    if ((tool === "straightLine" || tool === "room") && 
        !localStorage.getItem("hideDrawingGuide")) {
      setShowMeasurementGuide(true);
    }
  }, [tool]); // Only depend on tool changes
  
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
