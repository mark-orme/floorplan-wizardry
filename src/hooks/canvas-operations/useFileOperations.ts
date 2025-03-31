
/**
 * Hook for managing canvas file operations (clear, save, delete)
 */
import { useCallback } from "react";
import { toast } from "sonner";
import { captureMessage, captureError } from "@/utils/sentry";
import logger from "@/utils/logger";

interface UseFileOperationsProps {
  canvasComponentRef: React.MutableRefObject<any>;
}

export const useFileOperations = ({
  canvasComponentRef
}: UseFileOperationsProps) => {
  const handleClear = useCallback(() => {
    logger.info("Clear canvas requested");
    
    try {
      if (canvasComponentRef.current && canvasComponentRef.current.clearCanvas) {
        canvasComponentRef.current.clearCanvas();
        captureMessage("Clear canvas action triggered", "clear-canvas", {
          tags: { component: "CanvasApp", action: "clear" }
        });
      } else {
        logger.warn("Clear function not available on canvas component");
        toast.info("Clear canvas (not implemented yet)");
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to clear canvas", { error: errorMsg });
      captureError(error as Error, "clear-canvas-error");
      toast.error(`Failed to clear canvas: ${errorMsg}`);
    }
  }, [canvasComponentRef]);
  
  const handleSave = useCallback(() => {
    logger.info("Save canvas requested");
    
    try {
      if (canvasComponentRef.current && canvasComponentRef.current.saveCanvas) {
        canvasComponentRef.current.saveCanvas();
        captureMessage("Save canvas action triggered", "save-canvas", {
          tags: { component: "CanvasApp", action: "save" }
        });
      } else {
        // Fallback to basic JSON serialization
        if (canvasComponentRef.current && canvasComponentRef.current.getCanvas) {
          const canvas = canvasComponentRef.current.getCanvas();
          if (canvas) {
            const json = canvas.toJSON();
            const blob = new Blob([JSON.stringify(json)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'canvas-drawing.json';
            a.click();
            URL.revokeObjectURL(url);
            toast.success("Canvas saved to file");
          }
        } else {
          logger.warn("Save function not available on canvas component");
          toast.info("Save canvas (not implemented yet)");
        }
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to save canvas", { error: errorMsg });
      captureError(error as Error, "save-canvas-error");
      toast.error(`Failed to save canvas: ${errorMsg}`);
    }
  }, [canvasComponentRef]);
  
  const handleDelete = useCallback(() => {
    logger.info("Delete selected objects requested");
    
    try {
      if (canvasComponentRef.current && canvasComponentRef.current.deleteSelectedObjects) {
        canvasComponentRef.current.deleteSelectedObjects();
        captureMessage("Delete objects action triggered", "delete-objects", {
          tags: { component: "CanvasApp", action: "delete" }
        });
      } else {
        logger.warn("Delete function not available on canvas component");
        toast.info("Delete selected objects (not implemented yet)");
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to delete objects", { error: errorMsg });
      captureError(error as Error, "delete-objects-error");
      toast.error(`Failed to delete objects: ${errorMsg}`);
    }
  }, [canvasComponentRef]);

  return {
    handleClear,
    handleSave,
    handleDelete
  };
};
