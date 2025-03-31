
import { useCallback, useRef } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { toast } from "sonner";
import { DrawingMode } from "@/constants/drawingModes";
import { captureMessage, captureError } from "@/utils/sentry";
import logger from "@/utils/logger";

interface UseCanvasOperationsProps {
  canvas: FabricCanvas | null;
  saveCurrentState: () => void;
}

export const useCanvasOperations = ({
  canvas,
  saveCurrentState
}: UseCanvasOperationsProps) => {
  
  // Delete selected objects
  const deleteSelectedObjects = useCallback(() => {
    if (!canvas) return;
    
    try {
      const activeObject = canvas.getActiveObject();
      if (!activeObject) {
        logger.info("No active object to delete");
        return;
      }
      
      // Save current state before deleting
      saveCurrentState();
      
      if (activeObject.type === 'activeSelection') {
        // Delete multiple selected objects
        const activeSelection = activeObject as fabric.ActiveSelection;
        const objects = [...activeSelection.getObjects()];
        
        activeSelection.forEachObject((obj: fabric.Object) => {
          canvas.remove(obj);
        });
        
        canvas.discardActiveObject();
        logger.info(`Deleted ${objects.length} objects`);
        
        captureMessage("Objects deleted", {
          messageId: "objects-deleted",
          level: "info",
          tags: { component: "CanvasOperations", action: "deleteMultipleObjects" },
          extra: { count: objects.length }
        });
      } else {
        // Delete single object
        canvas.remove(activeObject);
        canvas.discardActiveObject();
        logger.info("Deleted single object");
        
        captureMessage("Object deleted", {
          messageId: "object-deleted",
          level: "info",
          tags: { component: "CanvasOperations", action: "deleteSingleObject" }
        });
      }
      
      canvas.requestRenderAll();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to delete objects", { error: errorMsg });
      captureError(error as Error, {
        errorId: "delete-objects-error"
      });
      toast.error(`Failed to delete objects: ${errorMsg}`);
    }
  }, [canvas, saveCurrentState]);
  
  // Clear canvas of all drawings
  const clearCanvas = useCallback(() => {
    if (!canvas) return;
    
    try {
      // Save current state before clearing
      saveCurrentState();
      
      // Remove all non-grid objects
      const objects = canvas.getObjects().filter(obj => (obj as any).objectType !== 'grid');
      canvas.remove(...objects);
      canvas.discardActiveObject();
      
      logger.info(`Cleared canvas (removed ${objects.length} objects)`);
      
      captureMessage("Canvas cleared", {
        messageId: "canvas-cleared",
        level: "info",
        tags: { component: "CanvasOperations", action: "clearCanvas" },
        extra: { count: objects.length }
      });
      
      canvas.requestRenderAll();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to clear canvas", { error: errorMsg });
      captureError(error as Error, {
        errorId: "clear-canvas-error" 
      });
      toast.error(`Failed to clear canvas: ${errorMsg}`);
    }
  }, [canvas, saveCurrentState]);
  
  // Zoom canvas
  const zoom = useCallback((direction: "in" | "out") => {
    if (!canvas) return;
    
    try {
      const currentZoom = canvas.getZoom();
      const zoomFactor = direction === "in" ? 1.1 : 0.9;
      const newZoom = currentZoom * zoomFactor;
      
      // Limit zoom range
      const limitedZoom = Math.min(Math.max(newZoom, 0.1), 10);
      
      // Get canvas center point
      const center = {
        x: canvas.width! / 2,
        y: canvas.height! / 2
      };
      
      canvas.zoomToPoint(center as fabric.Point, limitedZoom);
      canvas.requestRenderAll();
      
      logger.info(`Canvas zoomed ${direction}`, { 
        previousZoom: currentZoom, 
        newZoom: limitedZoom 
      });
      
      captureMessage(`Canvas zoomed ${direction}`, {
        messageId: "canvas-zoomed",
        level: "info",
        tags: { component: "CanvasOperations", action: "zoom" },
        extra: { direction, previousZoom: currentZoom, newZoom: limitedZoom }
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error(`Failed to zoom ${direction}`, { error: errorMsg });
      captureError(error as Error, {
        errorId: "zoom-error" 
      });
      toast.error(`Failed to zoom ${direction}: ${errorMsg}`);
    }
  }, [canvas]);
  
  // Save canvas to file
  const saveCanvas = useCallback(() => {
    if (!canvas) return;
    
    try {
      // Save as JSON
      const json = canvas.toJSON(['objectType']);
      const blob = new Blob([JSON.stringify(json)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const a = document.createElement('a');
      a.href = url;
      a.download = `canvas-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      
      // Cleanup
      URL.revokeObjectURL(url);
      
      logger.info("Canvas saved to JSON file");
      
      captureMessage("Canvas saved to file", {
        messageId: "canvas-saved",
        level: "info",
        tags: { component: "CanvasOperations", action: "saveCanvas" }
      });
      
      toast.success("Canvas saved to file");
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to save canvas", { error: errorMsg });
      captureError(error as Error, {
        errorId: "save-canvas-error"
      });
      toast.error(`Failed to save canvas: ${errorMsg}`);
    }
  }, [canvas]);

  return {
    deleteSelectedObjects,
    clearCanvas,
    zoom,
    saveCanvas
  };
};
