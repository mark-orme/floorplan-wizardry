
/**
 * Hook for managing canvas color and thickness operations
 */
import { useCallback } from "react";
import { toast } from "sonner";
import { captureMessage, captureError } from "@/utils/sentry";
import logger from "@/utils/logger";

interface UseColorOperationsProps {
  lineThickness: number;
  setLineThickness: (thickness: number) => void;
  lineColor: string;
  setLineColor: (color: string) => void;
}

export const useColorOperations = ({
  lineThickness,
  setLineThickness,
  lineColor,
  setLineColor
}: UseColorOperationsProps) => {
  const handleLineThicknessChange = useCallback((thickness: number) => {
    logger.info("Line thickness change requested", { 
      previousThickness: lineThickness, 
      newThickness: thickness 
    });
    
    try {
      setLineThickness(thickness);
      toast.info(`Line thickness set to ${thickness}`);
      captureMessage("Line thickness changed", "thickness-change", {
        tags: { component: "CanvasApp", action: "thicknessChange" },
        extra: { previousThickness: lineThickness, newThickness: thickness }
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to change line thickness", { 
        error: errorMsg, 
        previousThickness: lineThickness, 
        newThickness: thickness 
      });
      captureError(error as Error, "thickness-change-error", {
        extra: { previousThickness: lineThickness, newThickness: thickness }
      });
      toast.error(`Failed to set line thickness: ${errorMsg}`);
    }
  }, [lineThickness, setLineThickness]);
  
  const handleLineColorChange = useCallback((color: string) => {
    logger.info("Line color change requested", { 
      previousColor: lineColor, 
      newColor: color 
    });
    
    try {
      setLineColor(color);
      toast.info(`Line color set to ${color}`);
      captureMessage("Line color changed", "color-change", {
        tags: { component: "CanvasApp", action: "colorChange" },
        extra: { previousColor: lineColor, newColor: color }
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to change line color", { 
        error: errorMsg, 
        previousColor: lineColor, 
        newColor: color 
      });
      captureError(error as Error, "color-change-error", {
        extra: { previousColor: lineColor, newColor: color }
      });
      toast.error(`Failed to set line color: ${errorMsg}`);
    }
  }, [lineColor, setLineColor]);

  return {
    handleLineThicknessChange,
    handleLineColorChange
  };
};
