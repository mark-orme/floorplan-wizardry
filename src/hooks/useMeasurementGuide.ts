
import { useState, useEffect, useCallback, useRef } from "react";
import { DrawingTool } from "./useCanvasState";

/**
 * Hook to manage the measurement guide visibility
 */
export const useMeasurementGuide = (tool: DrawingTool) => {
  // Always declare all state and refs at the top level
  const [showMeasurementGuide, setShowMeasurementGuide] = useState(false);
  const initialRenderRef = useRef(true);
  
  // Save user preference - defined at the top level with useCallback for stability
  const handleCloseMeasurementGuide = useCallback((dontShowAgain: boolean) => {
    setShowMeasurementGuide(false);
    if (dontShowAgain) {
      localStorage.setItem("hideDrawingGuide", "true");
    }
  }, []);
  
  // Show the guide automatically when switching to line tools
  useEffect(() => {
    // Skip effect on initial render to avoid conflicts with conditional rendering
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      return;
    }
    
    // Safety check for tool being defined
    if (!tool) {
      return;
    }
    
    // Only show guide when using line tools and user hasn't dismissed it before
    if ((tool === "straightLine" || tool === "room") && 
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
