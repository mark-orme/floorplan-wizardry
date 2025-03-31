
/**
 * Hook for managing canvas history operations (undo/redo)
 */
import { useCallback } from "react";
import { toast } from "sonner";
import { captureMessage, captureError } from "@/utils/sentry";
import logger from "@/utils/logger";

interface UseHistoryOperationsProps {
  canvasComponentRef: React.MutableRefObject<any>;
  canUndo: boolean;
  canRedo: boolean;
}

export const useHistoryOperations = ({
  canvasComponentRef,
  canUndo,
  canRedo
}: UseHistoryOperationsProps) => {
  const handleUndo = useCallback(() => {
    logger.info("Undo action requested", { canUndo });
    
    if (!canUndo) {
      logger.warn("Undo requested but canUndo is false");
      toast.info("Nothing to undo");
      return;
    }
    
    try {
      if (canvasComponentRef.current && canvasComponentRef.current.undo) {
        canvasComponentRef.current.undo();
        captureMessage("Undo action triggered", "undo-action", {
          tags: { component: "CanvasApp", action: "undo" }
        });
      } else {
        logger.warn("Undo function not available on canvas component");
        toast.error("Undo functionality not available");
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to perform undo", { error: errorMsg });
      captureError(error as Error, "undo-action-error");
      toast.error(`Failed to undo: ${errorMsg}`);
    }
  }, [canUndo, canvasComponentRef]);
  
  const handleRedo = useCallback(() => {
    logger.info("Redo action requested", { canRedo });
    
    if (!canRedo) {
      logger.warn("Redo requested but canRedo is false");
      toast.info("Nothing to redo");
      return;
    }
    
    try {
      if (canvasComponentRef.current && canvasComponentRef.current.redo) {
        canvasComponentRef.current.redo();
        captureMessage("Redo action triggered", "redo-action", {
          tags: { component: "CanvasApp", action: "redo" }
        });
      } else {
        logger.warn("Redo function not available on canvas component");
        toast.error("Redo functionality not available");
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to perform redo", { error: errorMsg });
      captureError(error as Error, "redo-action-error");
      toast.error(`Failed to redo: ${errorMsg}`);
    }
  }, [canRedo, canvasComponentRef]);

  return {
    handleUndo,
    handleRedo
  };
};
