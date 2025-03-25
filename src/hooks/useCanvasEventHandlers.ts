
/**
 * Custom hook for handling canvas event registration and cleanup
 * @module useCanvasEventHandlers
 */
import { useCallback, useEffect } from "react";
import { Canvas as FabricCanvas, Path as FabricPath, Object as FabricObject } from "fabric";
import { DrawingTool } from "./useCanvasState";
import logger from "@/utils/logger";

interface UseCanvasEventHandlersProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  tool: DrawingTool;
  lineColor: string;
  lineThickness: number;
  saveCurrentState: () => void;
  handleUndo: () => void;
  handleRedo: () => void;
  handleMouseDown: (e: any) => void;
  handleMouseMove: (e: any) => void;
  handleMouseUp: () => void;
  processCreatedPath: (path: FabricPath) => void;
  cleanupTimeouts: () => void;
}

export const useCanvasEventHandlers = ({
  fabricCanvasRef,
  tool,
  lineColor,
  lineThickness,
  saveCurrentState,
  handleUndo,
  handleRedo,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  processCreatedPath,
  cleanupTimeouts
}: UseCanvasEventHandlersProps) => {
  
  // Set up all event handlers
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    const fabricCanvas = fabricCanvasRef.current;
    
    if (fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.width = lineThickness;
      fabricCanvas.freeDrawingBrush.color = lineColor;
    }
    
    const handlePathCreated = (e: {path: FabricPath}): void => {
      logger.info("Path created event triggered");
      
      // IMPORTANT: Save current state BEFORE making any changes
      // This ensures we can properly undo to previous state
      saveCurrentState();
      
      // Process the path based on the current tool
      processCreatedPath(e.path);
      handleMouseUp();
    };
    
    const handleObjectModified = () => {
      // Save state when objects are modified
      logger.info("Object modified, saving state");
      saveCurrentState();
    };
    
    const handleObjectRemoved = () => {
      // Save state when objects are removed
      logger.info("Object removed, saving state");
      saveCurrentState();
    };
    
    fabricCanvas.on('path:created', handlePathCreated);
    fabricCanvas.on('mouse:down', handleMouseDown);
    fabricCanvas.on('mouse:move', handleMouseMove);
    fabricCanvas.on('mouse:up', handleMouseUp);
    fabricCanvas.on('object:modified', handleObjectModified);
    fabricCanvas.on('object:removed', handleObjectRemoved);
    
    // Expose undo/redo handlers to the global canvas object for debugging
    // This helps with external access from CanvasController
    (fabricCanvas as any).handleUndo = handleUndo;
    (fabricCanvas as any).handleRedo = handleRedo;
    (fabricCanvas as any).saveCurrentState = saveCurrentState;
    
    return () => {
      cleanupTimeouts();
      
      if (fabricCanvas) {
        fabricCanvas.off('path:created', handlePathCreated);
        fabricCanvas.off('mouse:down', handleMouseDown);
        fabricCanvas.off('mouse:move', handleMouseMove);
        fabricCanvas.off('mouse:up', handleMouseUp);
        fabricCanvas.off('object:modified', handleObjectModified);
        fabricCanvas.off('object:removed', handleObjectRemoved);
        
        // Clean up custom handlers
        delete (fabricCanvas as any).handleUndo;
        delete (fabricCanvas as any).handleRedo;
        delete (fabricCanvas as any).saveCurrentState;
      }
    };
  }, [
    fabricCanvasRef, 
    processCreatedPath, 
    handleMouseDown, 
    handleMouseMove, 
    handleMouseUp,
    cleanupTimeouts,
    tool,
    lineThickness,
    lineColor,
    saveCurrentState,
    handleUndo,
    handleRedo
  ]);

  // Register zoom change tracking
  const registerZoomTracking = useCallback(() => {
    const updateZoomLevel = () => {
      if (fabricCanvasRef.current) {
        const zoom = fabricCanvasRef.current.getZoom();
        fabricCanvasRef.current.fire('custom:zoom-changed', { zoom });
      }
    };
    
    const fabricCanvas = fabricCanvasRef.current;
    if (fabricCanvas) {
      fabricCanvas.on('zoom:changed' as any, updateZoomLevel);
      
      return () => {
        fabricCanvas.off('zoom:changed' as any, updateZoomLevel);
      };
    }
  }, [fabricCanvasRef]);

  return {
    registerZoomTracking
  };
};
