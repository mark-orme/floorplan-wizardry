
/**
 * Hook for managing measurement guide visibility
 * Controls when to show the measurement guide to users
 * @module useMeasurementGuide
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { DrawingTool } from "./useCanvasState";

/**
 * Hook to manage the measurement guide visibility
 * Shows guide automatically for line tools unless user dismissed it
 * 
 * @param {DrawingTool | undefined} tool - Current drawing tool
 * @returns {Object} Guide visibility state and handlers
 */
export const useMeasurementGuide = (tool: DrawingTool | undefined) => {
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
      console.log("Tool is undefined in useMeasurementGuide");
      return;
    }
    
    // Only show guide when using line tools and user hasn't dismissed it before
    if ((tool === "straightLine" || tool === "room") && 
        !localStorage.getItem("hideDrawingGuide")) {
      // Show the guide more prominently
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
