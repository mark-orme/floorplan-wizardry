
/**
 * Hook for managing line tool event handlers
 * @module hooks/straightLineTool/useLineToolHandlers
 */
import { useEffect } from "react";
import { Canvas } from "fabric";
import { useLineState } from "./useLineState";

/**
 * Props for useLineToolHandlers hook
 */
export interface UseLineToolHandlersProps {
  /**
   * Reference to the fabric canvas
   */
  fabricCanvasRef: React.MutableRefObject<Canvas | null>;
  /**
   * Whether the tool is enabled
   */
  enabled: boolean;
  /**
   * Line state from useLineState hook
   */
  lineState: ReturnType<typeof useLineState>;
  /**
   * Callback for saving the current state
   */
  saveCurrentState?: () => void;
}

/**
 * Hook for handling line tool events
 */
export const useLineToolHandlers = (props: UseLineToolHandlersProps) => {
  const { fabricCanvasRef, enabled, lineState, saveCurrentState } = props;
  
  // Set up keyboard event handlers
  useEffect(() => {
    if (!enabled) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle escape key
      if (e.key === 'Escape' && lineState.isDrawing) {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;
        
        // Remove current line and tooltip
        if (lineState.currentLineRef.current) {
          canvas.remove(lineState.currentLineRef.current);
        }
        
        if (lineState.distanceTooltipRef.current) {
          canvas.remove(lineState.distanceTooltipRef.current);
        }
        
        // Reset drawing state
        lineState.resetDrawingState();
        
        // Render canvas
        canvas.requestRenderAll();
      }
      
      // Handle grid snapping toggle
      if (e.key === 'g' || e.key === 'G') {
        lineState.toggleSnap();
      }
    };
    
    // Add event listener
    window.addEventListener('keydown', handleKeyDown);
    
    // Clean up
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [fabricCanvasRef, enabled, lineState]);
  
  return {
    // No need to return anything for now
  };
};
