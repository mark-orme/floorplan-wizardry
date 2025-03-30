
/**
 * Hook for canvas operations
 * Handles canvas operations like clear, save, etc.
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";

/**
 * Props for useCanvasOperations hook
 */
interface UseCanvasOperationsProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  saveCurrentState: () => void;
}

/**
 * Hook that manages canvas operations
 */
export const useCanvasOperations = ({
  fabricCanvasRef,
  gridLayerRef,
  saveCurrentState
}: UseCanvasOperationsProps) => {
  /**
   * Clear canvas drawings
   */
  const clearDrawings = useCallback((): void => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Save current state before clearing
    saveCurrentState();
    
    // Get all non-grid objects
    const objectsToRemove = canvas.getObjects().filter(obj => 
      !gridLayerRef.current.includes(obj)
    );
    
    // Remove them
    if (objectsToRemove.length > 0) {
      canvas.remove(...objectsToRemove);
      canvas.discardActiveObject();
      canvas.requestRenderAll();
    }
  }, [fabricCanvasRef, gridLayerRef, saveCurrentState]);
  
  /**
   * Save canvas state
   */
  const saveCanvas = useCallback((): boolean => {
    try {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return false;
      
      // Save the current canvas state
      // This is just a placeholder for the actual implementation
      console.log("Canvas saved");
      return true;
    } catch (error) {
      console.error("Error saving canvas:", error);
      return false;
    }
  }, [fabricCanvasRef]);
  
  /**
   * Delete selected objects
   */
  const deleteSelectedObjects = useCallback((): void => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length === 0) return;
    
    // Save current state before deleting
    saveCurrentState();
    
    // Remove selected objects
    canvas.remove(...activeObjects);
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  }, [fabricCanvasRef, saveCurrentState]);
  
  return {
    clearDrawings,
    clearCanvas: clearDrawings, // Alias for backward compatibility
    saveCanvas,
    deleteSelectedObjects
  };
};
