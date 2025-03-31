
/**
 * Hook for managing canvas file operations
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
      if (canvasComponentRef.current && canvasComponentRef.current.clear) {
        canvasComponentRef.current.clear();
        captureMessage("Canvas cleared", "clear-canvas", {
          tags: { component: "CanvasApp", action: "clear" }
        });
        toast.success("Canvas cleared");
      } else {
        logger.warn("Clear function not available on canvas component");
        toast.info("Clear (not implemented yet)");
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
      if (canvasComponentRef.current && canvasComponentRef.current.save) {
        canvasComponentRef.current.save();
        captureMessage("Canvas saved", "save-canvas", {
          tags: { component: "CanvasApp", action: "save" }
        });
        toast.success("Canvas saved");
      } else {
        logger.warn("Save function not available on canvas component");
        toast.info("Save (not implemented yet)");
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
      if (canvasComponentRef.current && canvasComponentRef.current.deleteSelected) {
        canvasComponentRef.current.deleteSelected();
        captureMessage("Objects deleted", "delete-objects", {
          tags: { component: "CanvasApp", action: "delete" }
        });
      } else {
        logger.warn("Delete function not available on canvas component");
        toast.info("Delete (not implemented yet)");
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
