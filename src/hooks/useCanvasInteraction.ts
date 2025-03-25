
/**
 * Custom hook for handling canvas interaction options
 * @module useCanvasInteraction
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { toast } from "sonner";
import { DrawingTool } from "./useCanvasState";
import { enableSelection, disableSelection } from "@/utils/fabricInteraction";

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
      }
    });
    
    canvas.requestRenderAll();
  }, [fabricCanvasRef]);
  
  /**
   * Setup selection mode based on current tool
   */
  const setupSelectionMode = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    if (tool === "select") {
      enablePointSelection();
    } else {
      disableSelection(fabricCanvasRef.current);
    }
  }, [fabricCanvasRef, tool, enablePointSelection]);
  
  return {
    deleteSelectedObjects,
    enablePointSelection,
    setupSelectionMode
  };
};
