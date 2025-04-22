
/**
 * Hook for managing canvas zoom operations
 */
import { useCallback } from "react";
import { toast } from "sonner";
import { captureMessage, captureError } from "@/utils/sentry";
import logger from "@/utils/logger";

interface UseZoomOperationsProps {
  canvasComponentRef: React.MutableRefObject<any>;
}

export const useZoomOperations = ({
  canvasComponentRef
}: UseZoomOperationsProps) => {
  const handleZoom = useCallback((direction: "in" | "out") => {
    logger.info("Zoom action requested", { direction });
    
    try {
      if (canvasComponentRef.current && canvasComponentRef.current.zoom) {
        canvasComponentRef.current.zoom(direction);
        captureMessage("Zoom action triggered", "zoom-action", {
          tags: { component: "CanvasApp", action: "zoom" },
          extra: { direction }
        });
      } else {
        logger.warn("Zoom function not available on canvas component");
        toast.info(`Zoom ${direction} (not implemented yet)`);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to perform zoom", { error: errorMsg, direction });
      captureError(error as Error, {
        extra: { direction }
      });
      toast.error(`Failed to zoom ${direction}: ${errorMsg}`);
    }
  }, [canvasComponentRef]);

  return {
    handleZoom
  };
};
