import { useCallback, useRef, useState } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { DrawingMode } from "@/constants/drawingModes";
import { useDrawingContext } from "@/contexts/DrawingContext";
import { useGridSnapping } from "./useGridSnapping";
import { toast } from "sonner";

/**
 * Hook for managing drawing operations on canvas
 */
export const useDrawingOperations = (
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>
) => {
  const { activeTool, lineColor, lineThickness, setCanUndo, setCanRedo } = useDrawingContext();
  const { snapPointToGrid } = useGridSnapping({ 
    fabricCanvasRef,
    initialSnapEnabled: true
  }); 
  
  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<FabricObject | null>(null);
  const startPointRef = useRef<Point | null>(null);
  
  // History state - maintain separate from the canvas history
  const historyRef = useRef<{
    past: FabricObject[][];
    future: FabricObject[][];
  }>({
    past: [],
    future: []
  });
  
  /**
   * Save current canvas state to history
   */
  const saveCurrentState = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    try {
      // Get all non-grid objects
      const currentObjects = canvas.getObjects().filter(
        obj => (obj as any).objectType !== 'grid' && (obj as any).isGrid !== true
      );
      
      // Clone the objects (simple version - for complex objects you'd need deeper cloning)
      const clonedObjects = currentObjects.map(obj => obj);
      
      // Add to history
      historyRef.current.past.push(clonedObjects);
      
      // Clear future history when a new action is taken
      historyRef.current.future = [];
      
      // Update undo/redo state
      setCanUndo(true);
      setCanRedo(false);
    } catch (error) {
      console.error("Error saving canvas state:", error);
    }
  }, [fabricCanvasRef, setCanUndo, setCanRedo]);
  
  /**
   * Undo last action
   */
  const undo = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || historyRef.current.past.length === 0) return;
    
    try {
      // Get current state
      const currentObjects = canvas.getObjects().filter(
        obj => (obj as any).objectType !== 'grid' && (obj as any).isGrid !== true
      );
      
      // Move current state to future
      historyRef.current.future.unshift(currentObjects.map(obj => obj));
      
      // Get previous state
      const previousState = historyRef.current.past.pop();
      
      // Remove all non-grid objects
      canvas.remove(...currentObjects);
      
      // Add previous state objects
      if (previousState) {
        canvas.add(...previousState);
      }
      
      // Update canvas
      canvas.requestRenderAll();
      
      // Update undo/redo state
      setCanUndo(historyRef.current.past.length > 0);
      setCanRedo(true);
      
      toast.info("Undo successful");
    } catch (error) {
      console.error("Error during undo:", error);
      toast.error("Failed to undo");
    }
  }, [fabricCanvasRef, setCanUndo, setCanRedo]);
  
  /**
   * Redo last undone action
   */
  const redo = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || historyRef.current.future.length === 0) return;
    
    try {
      // Get current state
      const currentObjects = canvas.getObjects().filter(
        obj => (obj as any).objectType !== 'grid' && (obj as any).isGrid !== true
      );
      
      // Move current state to past
      historyRef.current.past.push(currentObjects.map(obj => obj));
      
      // Get next state
      const nextState = historyRef.current.future.shift();
      
      // Remove all non-grid objects
      canvas.remove(...currentObjects);
      
      // Add next state objects
      if (nextState) {
        canvas.add(...nextState);
      }
      
      // Update canvas
      canvas.requestRenderAll();
      
      // Update undo/redo state
      setCanUndo(true);
      setCanRedo(historyRef.current.future.length > 0);
      
      toast.info("Redo successful");
    } catch (error) {
      console.error("Error during redo:", error);
      toast.error("Failed to redo");
    }
  }, [fabricCanvasRef, setCanUndo, setCanRedo]);
  
  /**
   * Delete selected objects
   */
  const deleteSelectedObjects = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    try {
      // Save current state before deletion
      saveCurrentState();
      
      // Get selected objects
      const selectedObjects = canvas.getActiveObjects();
      
      // Filter out grid objects
      const nonGridObjects = selectedObjects.filter(
        obj => (obj as any).objectType !== 'grid' && (obj as any).isGrid !== true
      );
      
      if (nonGridObjects.length === 0) {
        return;
      }
      
      // Remove selected objects
      canvas.remove(...nonGridObjects);
      canvas.discardActiveObject();
      canvas.requestRenderAll();
      
      toast.success(`Deleted ${nonGridObjects.length} object(s)`);
    } catch (error) {
      console.error("Error deleting objects:", error);
      toast.error("Failed to delete objects");
    }
  }, [fabricCanvasRef, saveCurrentState]);
  
  /**
   * Clear all objects from canvas except grid
   */
  const clearCanvas = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    try {
      // Save current state before clearing
      saveCurrentState();
      
      // Get all non-grid objects
      const nonGridObjects = canvas.getObjects().filter(
        obj => (obj as any).objectType !== 'grid' && (obj as any).isGrid !== true
      );
      
      // Remove all non-grid objects
      canvas.remove(...nonGridObjects);
      canvas.requestRenderAll();
      
      toast.success("Canvas cleared");
    } catch (error) {
      console.error("Error clearing canvas:", error);
      toast.error("Failed to clear canvas");
    }
  }, [fabricCanvasRef, saveCurrentState]);
  
  return {
    isDrawing,
    currentPath,
    startPointRef,
    setIsDrawing,
    setCurrentPath,
    saveCurrentState,
    undo,
    redo,
    deleteSelectedObjects,
    clearCanvas,
    snapPointToGrid
  };
};
