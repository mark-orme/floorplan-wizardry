
/**
 * Hook for the straight line drawing tool
 * @module hooks/straightLineTool/useStraightLineTool
 */
import { useCallback, useEffect, useState } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { useLineState } from "./useLineState";
import { useLineEvents } from "./useLineEvents";
import { DrawingMode } from "@/constants/drawingModes";
import { toast } from "sonner";
import logger from "@/utils/logger";
import { validateStraightLineTool } from "@/utils/diagnostics/straightLineValidator";

interface UseStraightLineToolProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  enabled: boolean;
  lineColor: string;
  lineThickness: number;
  saveCurrentState?: () => void;
  snapToGrid?: boolean;
  tool?: DrawingMode;
}

export const useStraightLineTool = ({
  fabricCanvasRef,
  enabled,
  lineColor,
  lineThickness,
  saveCurrentState,
  snapToGrid = true,
  tool
}: UseStraightLineToolProps) => {
  // Track if the tool is active and initialized
  const [isActive, setIsActive] = useState(false);
  const [isToolInitialized, setIsToolInitialized] = useState(false);
  
  // Use line state hook
  const lineState = useLineState({
    lineColor,
    lineThickness
  });
  
  /**
   * Complete drawing handler
   */
  const handleDrawingComplete = useCallback(() => {
    if (saveCurrentState) {
      saveCurrentState();
    }
  }, [saveCurrentState]);
  
  // Set up event handlers
  const { handleMouseDown, handleMouseMove, handleMouseUp } = useLineEvents({
    fabricCanvasRef,
    lineState,
    onComplete: handleDrawingComplete,
    enabled: isActive
  });
  
  /**
   * Cancel the current drawing
   */
  const cancelDrawing = useCallback(() => {
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
    
    // Render
    canvas.requestRenderAll();
    
    logger.info("Drawing canceled");
    toast.info("Line drawing canceled");
  }, [fabricCanvasRef, lineState]);
  
  /**
   * Handle Escape key to cancel drawing
   */
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && lineState.isDrawing) {
      cancelDrawing();
    }
  }, [cancelDrawing, lineState.isDrawing]);
  
  // Setup and cleanup the tool
  useEffect(() => {
    if (!enabled) {
      setIsActive(false);
      setIsToolInitialized(false);
      return;
    }
    
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Set tool as active
    setIsActive(true);
    
    // Configure canvas for line drawing
    canvas.isDrawingMode = false;
    canvas.selection = false;
    canvas.defaultCursor = 'crosshair';
    canvas.hoverCursor = 'crosshair';
    
    // Make objects non-selectable
    canvas.getObjects().forEach(obj => {
      if ((obj as any).objectType !== 'grid') {
        obj.selectable = false;
      }
    });
    
    // Discard any active object
    canvas.discardActiveObject();
    canvas.requestRenderAll();
    
    // Add keyboard event listener
    window.addEventListener('keydown', handleKeyDown);
    
    // Set tool as initialized
    setIsToolInitialized(true);
    
    // Validate tool setup
    setTimeout(() => {
      validateStraightLineTool(canvas, DrawingMode.STRAIGHT_LINE);
    }, 100);
    
    logger.info("Straight line tool activated");
    
    // Cleanup
    return () => {
      // Reset canvas configuration
      if (canvas) {
        canvas.defaultCursor = 'default';
        canvas.hoverCursor = 'move';
        canvas.selection = true;
        
        // Make objects selectable again
        canvas.getObjects().forEach(obj => {
          if ((obj as any).objectType !== 'grid') {
            obj.selectable = true;
          }
        });
        
        canvas.requestRenderAll();
      }
      
      // Remove keyboard event listener
      window.removeEventListener('keydown', handleKeyDown);
      
      // Cancel any active drawing
      if (lineState.isDrawing) {
        cancelDrawing();
      }
      
      logger.info("Straight line tool deactivated");
    };
  }, [enabled, fabricCanvasRef, handleKeyDown, cancelDrawing, lineState.isDrawing]);
  
  return {
    isActive,
    isToolInitialized,
    isDrawing: lineState.isDrawing,
    startPoint: lineState.startPointRef.current,
    cancelDrawing,
    snapEnabled: lineState.snapEnabled,
    toggleSnap: lineState.toggleSnap
  };
};
