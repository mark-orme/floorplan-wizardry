
/**
 * Hook for managing drawing actions
 * @module hooks/drawing/useDrawingActions
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { toast } from "sonner";
import { DrawingTool } from "@/constants/drawingModes";

/**
 * Props for the useDrawingActions hook
 */
interface UseDrawingActionsProps {
  /** Reference to the fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Function to save the current state */
  saveCurrentState: () => void;
  /** Current drawing tool */
  tool: DrawingTool;
  /** Function to set the current tool */
  setTool: React.Dispatch<React.SetStateAction<DrawingTool>>;
  /** Current zoom level */
  zoomLevel: number;
  /** Function to set the zoom level */
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
}

/**
 * Hook for managing drawing actions
 * 
 * @param {UseDrawingActionsProps} props - Hook properties
 * @returns Drawing action functions
 */
export const useDrawingActions = ({
  fabricCanvasRef,
  saveCurrentState,
  tool,
  setTool,
  zoomLevel,
  setZoomLevel
}: UseDrawingActionsProps) => {
  
  /**
   * Change the current drawing tool
   */
  const handleToolChange = useCallback((newTool: DrawingTool) => {
    if (!fabricCanvasRef.current) return;
    
    // Save current state before changing tools
    saveCurrentState();
    
    try {
      // Update the tool state
      setTool(newTool);
      toast(`Tool changed to ${newTool}`);

    } catch (error) {
      console.error('Error changing tool:', error);
    }
  }, [fabricCanvasRef, saveCurrentState, setTool]);
  
  /**
   * Handle zoom changes
   */
  const handleZoom = useCallback((zoomChange: number) => {
    setZoomLevel(prevZoom => {
      const newZoom = Math.max(0.1, Math.min(3, prevZoom * zoomChange));
      return newZoom;
    });
  }, [setZoomLevel]);
  
  /**
   * Clear the canvas
   */
  const clearCanvas = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    
    // First save the current state
    saveCurrentState();
    
    // Remove non-grid objects
    canvas.getObjects().forEach(obj => {
      if (!(obj as any).isGrid) {
        canvas.remove(obj);
      }
    });
    
    // Render the canvas after clearing
    canvas.renderAll();
    
  }, [fabricCanvasRef, saveCurrentState]);
  
  /**
   * Save the canvas state
   */
  const saveCanvas = useCallback(() => {
    // Implement save canvas functionality here
    toast("Canvas saved");
  }, []);
  
  /**
   * Delete selected objects
   */
  const deleteSelectedObjects = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    const activeObjects = canvas.getActiveObjects();
    
    if (activeObjects.length > 0) {
      // First save the current state
      saveCurrentState();
      
      // Remove the selected objects
      activeObjects.forEach(obj => {
        canvas.remove(obj);
      });
      
      // Clear the selection and render
      canvas.discardActiveObject();
      canvas.requestRenderAll();
    }
  }, [fabricCanvasRef, saveCurrentState]);
  
  return {
    handleToolChange,
    handleZoom,
    clearCanvas,
    saveCanvas,
    deleteSelectedObjects
  };
};
