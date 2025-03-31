
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
    logger.info("Undo action requested");
    
    try {
      if (canvasComponentRef.current && canvasComponentRef.current.undo) {
        canvasComponentRef.current.undo();
        captureMessage("Undo action triggered", "undo-action", {
          tags: { component: "CanvasApp", action: "undo" }
        });
      } else {
        logger.warn("Undo function not available on canvas component");
        toast.info("Undo (not implemented yet)");
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to perform undo", { error: errorMsg });
      captureError(error as Error, "undo-action-error");
      toast.error(`Failed to undo: ${errorMsg}`);
    }
  }, [canvasComponentRef, canUndo]);

  const handleRedo = useCallback(() => {
    logger.info("Redo action requested");
    
    try {
      if (canvasComponentRef.current && canvasComponentRef.current.redo) {
        canvasComponentRef.current.redo();
        captureMessage("Redo action triggered", "redo-action", {
          tags: { component: "CanvasApp", action: "redo" }
        });
      } else {
        logger.warn("Redo function not available on canvas component");
        toast.info("Redo (not implemented yet)");
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to perform redo", { error: errorMsg });
      captureError(error as Error, "redo-action-error");
      toast.error(`Failed to redo: ${errorMsg}`);
    }
  }, [canvasComponentRef, canRedo]);

  return {
    handleUndo,
    handleRedo
  };
};
