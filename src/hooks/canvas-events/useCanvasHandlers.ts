
/**
 * Hook for registering global canvas handlers
 * @module useCanvasHandlers
 */
import { useEffect } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { BaseEventHandlerProps } from "./types";

/**
 * Props for the useCanvasHandlers hook
 */
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
 * @param {UseCanvasHandlersProps} props - Hook properties
 */
export const useCanvasHandlers = ({
  fabricCanvasRef,
  handleUndo,
  handleRedo,
  saveCurrentState,
  deleteSelectedObjects
}: UseCanvasHandlersProps): void => {
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    const fabricCanvas = fabricCanvasRef.current;
    
    // Expose undo/redo handlers to the global canvas object for debugging
    // This helps with external access from CanvasController
    const enhancedCanvas = fabricCanvas as FabricCanvas & {
      handleUndo?: () => void;
      handleRedo?: () => void;
      saveCurrentState?: () => void;
      deleteSelectedObjects?: () => void;
    };
    
    enhancedCanvas.handleUndo = handleUndo;
    enhancedCanvas.handleRedo = handleRedo;
    enhancedCanvas.saveCurrentState = saveCurrentState;
    enhancedCanvas.deleteSelectedObjects = deleteSelectedObjects;
    
    return () => {
      if (fabricCanvas) {
        // Clean up custom handlers
        delete enhancedCanvas.handleUndo;
        delete enhancedCanvas.handleRedo;
        delete enhancedCanvas.saveCurrentState;
        delete enhancedCanvas.deleteSelectedObjects;
      }
    };
  }, [fabricCanvasRef, handleUndo, handleRedo, saveCurrentState, deleteSelectedObjects]);
};
