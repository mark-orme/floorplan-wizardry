
/**
 * Hook for registering global canvas handlers
 * @module useCanvasHandlers
 */
import { useEffect } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { BaseEventHandlerProps } from "./types";

interface UseCanvasHandlersProps extends BaseEventHandlerProps {
  /** Function to handle undo operation */
  handleUndo: () => void;
  /** Function to handle redo operation */
  handleRedo: () => void;
  /** Function to save current state before making changes */
  saveCurrentState: () => void;
  /** Function to delete selected objects */
  deleteSelectedObjects: () => void;
}

/**
 * Hook to register global canvas handlers
 */
export const useCanvasHandlers = ({
  fabricCanvasRef,
  handleUndo,
  handleRedo,
  saveCurrentState,
  deleteSelectedObjects
}: UseCanvasHandlersProps) => {
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    const fabricCanvas = fabricCanvasRef.current;
    
    // Expose undo/redo handlers to the global canvas object for debugging
    // This helps with external access from CanvasController
    (fabricCanvas as any).handleUndo = handleUndo;
    (fabricCanvas as any).handleRedo = handleRedo;
    (fabricCanvas as any).saveCurrentState = saveCurrentState;
    (fabricCanvas as any).deleteSelectedObjects = deleteSelectedObjects;
    
    return () => {
      if (fabricCanvas) {
        // Clean up custom handlers
        delete (fabricCanvas as any).handleUndo;
        delete (fabricCanvas as any).handleRedo;
        delete (fabricCanvas as any).saveCurrentState;
        delete (fabricCanvas as any).deleteSelectedObjects;
      }
    };
  }, [fabricCanvasRef, handleUndo, handleRedo, saveCurrentState, deleteSelectedObjects]);
};
