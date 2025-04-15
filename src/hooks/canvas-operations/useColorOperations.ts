
/**
 * Hook for managing color and line thickness operations
 */
import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import { captureMessage, captureError } from "@/utils/sentry";
import * as Sentry from '@sentry/react';
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
  // Set Sentry context for the component
  useEffect(() => {
    Sentry.setTag("component", "useColorOperations");
    
    Sentry.setContext("drawingStyles", {
      lineThickness,
      lineColor
    });
    
    return () => {
      // Clear component-specific tags when unmounting
      Sentry.setTag("component", null);
    };
  }, [lineThickness, lineColor]);

  const handleLineThicknessChange = useCallback((thickness: number) => {
    logger.info("Line thickness change requested", { 
      previousThickness: lineThickness, 
      newThickness: thickness 
    });
    
    // Update Sentry context for thickness change
    Sentry.setTag("action", "thicknessChange");
    Sentry.setContext("thicknessChange", {
      previousThickness: lineThickness,
      newThickness: thickness,
      timestamp: new Date().toISOString()
    });
    
    try {
      setLineThickness(thickness);
      toast.success(`Changed line thickness to ${thickness}`);
      
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
      
      // Set error context in Sentry
      Sentry.setTag("errorSource", "thicknessChange");
      Sentry.setContext("thicknessChangeError", {
        error: errorMsg,
        previousThickness: lineThickness,
        newThickness: thickness,
        timestamp: new Date().toISOString()
      });
      
      captureError(error as Error, "thickness-change-error", {
        tags: { component: "CanvasApp", action: "thicknessChange" },
        extra: { previousThickness: lineThickness, newThickness: thickness }
      });
      
      toast.error(`Failed to change line thickness: ${errorMsg}`);
    }
  }, [lineThickness, setLineThickness]);

  const handleLineColorChange = useCallback((color: string) => {
    logger.info("Line color change requested", { 
      previousColor: lineColor, 
      newColor: color 
    });
    
    // Update Sentry context for color change
    Sentry.setTag("action", "colorChange");
    Sentry.setContext("colorChange", {
      previousColor: lineColor,
      newColor: color,
      timestamp: new Date().toISOString()
    });
    
    try {
      setLineColor(color);
      toast.success(`Changed line color`);
      
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
      
      // Set error context in Sentry
      Sentry.setTag("errorSource", "colorChange");
      Sentry.setContext("colorChangeError", {
        error: errorMsg,
        previousColor: lineColor,
        newColor: color,
        timestamp: new Date().toISOString()
      });
      
      captureError(error as Error, "color-change-error", {
        tags: { component: "CanvasApp", action: "colorChange" },
        extra: { previousColor: lineColor, newColor: color }
      });
      
      toast.error(`Failed to change line color: ${errorMsg}`);
    }
  }, [lineColor, setLineColor]);

  return {
    handleLineThicknessChange,
    handleLineColorChange
  };
};
