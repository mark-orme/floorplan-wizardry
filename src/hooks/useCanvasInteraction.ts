
/**
 * Custom hook for handling canvas interaction options
 * @module useCanvasInteraction
 */
import { useCallback, useEffect } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { toast } from "sonner";
import { DrawingTool } from "./useCanvasState";
import { enableSelection, disableSelection } from "@/utils/fabricInteraction";
import logger from "@/utils/logger";

interface UseCanvasInteractionProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  tool: DrawingTool;
  saveCurrentState: () => void;
}

/**
 * Hook that provides canvas interaction options
 */
export const useCanvasInteraction = ({
  fabricCanvasRef,
  tool,
  saveCurrentState
}: UseCanvasInteractionProps) => {
  
  /**
   * Delete the currently selected object(s) on the canvas
   */
  const deleteSelectedObjects = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    const activeObjects = canvas.getActiveObjects();
    
    if (activeObjects.length === 0) {
      toast.info("No objects selected. Select an object to delete.");
      return;
    }
    
    // Save current state before deletion for proper undo
    saveCurrentState();
    
    // Remove all selected objects
    activeObjects.forEach(obj => {
      // Skip grid elements
      if ((obj as any).objectType && (obj as any).objectType.includes('grid')) {
        return;
      }
      canvas.remove(obj);
    });
    
    // Clear selection and render
    canvas.discardActiveObject();
    canvas.requestRenderAll();
    
    toast.success(`Deleted ${activeObjects.length} object(s)`);
  }, [fabricCanvasRef, saveCurrentState]);
  
  /**
   * Enable point-based selection mode (instead of lasso)
   */
  const enablePointSelection = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    
    // Enable selection but disable group selection (lasso)
    canvas.selection = false; // Disable drag-to-select (lasso)
    canvas.defaultCursor = 'default';
    canvas.hoverCursor = 'pointer';
    
    // Make objects selectable
    canvas.getObjects().forEach(obj => {
      // Skip grid elements
      const objectType = (obj as any).objectType;
      if (!objectType || !objectType.includes('grid')) {
        obj.selectable = true;
        obj.hoverCursor = 'pointer';
        
        // Ensure lines and polylines are selectable
        if (obj.type === 'polyline' || obj.type === 'line' || (obj as any).objectType === 'line') {
          obj.selectable = true;
          obj.evented = true;
          obj.hoverCursor = 'pointer';
          
          // Increase hit box for easier selection
          obj.strokeWidth = Math.max((obj as any).strokeWidth || 2, 2);
          obj.perPixelTargetFind = false;
          (obj as any).targetFindTolerance = 10;
        }
      }
    });
    
    canvas.requestRenderAll();
    logger.info("Point selection mode enabled");
  }, [fabricCanvasRef]);
  
  /**
   * Setup selection mode based on current tool
   */
  const setupSelectionMode = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    if (tool === "select") {
      logger.info("Setting up selection mode for tool:", tool);
      enablePointSelection();
    } else {
      disableSelection(fabricCanvasRef.current);
    }
  }, [fabricCanvasRef, tool, enablePointSelection]);
  
  // Apply selection mode immediately when tool changes
  useEffect(() => {
    if (tool === "select") {
      logger.info("Selection tool active - setting up selection mode");
      enablePointSelection();
    }
  }, [tool, enablePointSelection]);
  
  return {
    deleteSelectedObjects,
    enablePointSelection,
    setupSelectionMode
  };
};
