
import { useCallback } from "react";
import { Canvas as FabricCanvas, Point } from "fabric";
import { toast } from "sonner";
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
      if (activeObject) {
        if (activeObject.type === 'activeSelection') {
          // Multiple objects selected
          activeObject.forEachObject((obj: any) => {
            if ((obj as any).objectType !== 'grid') {
              canvas.remove(obj);
            }
          });
          canvas.discardActiveObject();
        } else if ((activeObject as any).objectType !== 'grid') {
          // Single object selected
          canvas.remove(activeObject);
        }
        canvas.requestRenderAll();
        saveCurrentState();
        
        toast.success("Objects deleted");
      } else {
        toast.info("Nothing selected to delete");
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to delete objects", { error: errorMsg });
      captureError(
        error as Error,
        "delete-objects-error"
      );
      toast.error(`Failed to delete objects: ${errorMsg}`);
    }
  }, [canvas, saveCurrentState]);
  
  // Clear canvas (remove all non-grid objects)
  const clearCanvas = useCallback(() => {
    if (!canvas) return;
    
    try {
      // Get all objects that are not grid
      const nonGridObjects = canvas.getObjects().filter(obj => (obj as any).objectType !== 'grid');
      
      // Remove non-grid objects
      nonGridObjects.forEach(obj => {
        canvas.remove(obj);
      });
      
      // Force render
      canvas.requestRenderAll();
      saveCurrentState();
      
      toast.success("Canvas cleared");
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to clear canvas", { error: errorMsg });
      captureError(
        error as Error,
        "clear-canvas-error"
      );
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
      if (newZoom > 0.2 && newZoom < 5) {
        // Create a Point instance properly
        const center = new Point(canvas.width! / 2, canvas.height! / 2);
        canvas.zoomToPoint(center, newZoom);
        canvas.requestRenderAll();
        
        toast.info(`Zoomed ${direction}`);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error(`Failed to zoom ${direction}`, { error: errorMsg });
      captureError(
        error as Error,
        `zoom-${direction}-error`
      );
      toast.error(`Failed to zoom ${direction}: ${errorMsg}`);
    }
  }, [canvas]);
  
  // Save canvas to file
  const saveCanvas = useCallback(() => {
    if (!canvas) return;
    
    try {
      const json = canvas.toJSON(['objectType']);
      const blob = new Blob([JSON.stringify(json)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'canvas-drawing.json';
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success("Canvas saved to file");
      captureMessage(
        "Canvas saved to file",
        "save-canvas",
        {
          tags: { component: "CanvasApp", action: "saveCanvas" }
        }
      );
      return true;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to save canvas", { error: errorMsg });
      captureError(
        error as Error,
        "save-canvas-error"
      );
      toast.error(`Failed to save canvas: ${errorMsg}`);
      return false;
    }
  }, [canvas]);

  return {
    deleteSelectedObjects,
    clearCanvas,
    zoom,
    saveCanvas
  };
};
