
/**
 * Custom hook for managing canvas drawing state
 * @module canvas/drawing/useCanvasDrawingState
 */
import { useState, useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { useDrawingState } from "@/hooks/useDrawingState";
import { DrawingTool } from "@/hooks/useCanvasState";
import { DrawingState } from "@/types/drawingTypes";

/**
 * Props for the useCanvasDrawingState hook
 * 
 * @interface UseCanvasDrawingStateProps
 * @property {React.MutableRefObject<FabricCanvas | null>} fabricCanvasRef - Reference to the Fabric.js canvas instance
 * @property {DrawingTool} tool - Currently selected drawing tool
 */
interface UseCanvasDrawingStateProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  tool: DrawingTool;
}

/**
 * Hook for managing drawing state and zoom level
 * Provides drawing state and event handlers with zoom awareness
 * 
 * @param {UseCanvasDrawingStateProps} props - Hook properties
 * @returns {Object} Drawing state with current zoom level and handlers
 */
export const useCanvasDrawingState = (props: UseCanvasDrawingStateProps) => {
  const { fabricCanvasRef, tool } = props;
  
  // Track current zoom level for proper tooltip positioning
  const [currentZoom, setCurrentZoom] = useState<number>(1);
  
  // Get the drawing state from the useDrawingState hook
  const {
    drawingState,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    cleanupTimeouts
  } = useDrawingState({ 
    fabricCanvasRef,
    tool
  });
  
  /**
   * Update zoom level from canvas
   * Gets current zoom level from canvas for tooltip positioning
   */
  const updateZoomLevel = useCallback(() => {
    if (fabricCanvasRef.current) {
      const zoom = fabricCanvasRef.current.getZoom();
      setCurrentZoom(zoom);
    }
  }, [fabricCanvasRef]);
  
  return {
    drawingState: {
      ...drawingState,
      currentZoom
    },
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    cleanupTimeouts,
    updateZoomLevel,
    setCurrentZoom
  };
};
