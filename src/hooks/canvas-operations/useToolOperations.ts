
/**
 * Hook for managing drawing tool operations
 */
import { useCallback } from "react";
import { toast } from "sonner";
import { DrawingMode } from "@/constants/drawingModes";
import { captureMessage, captureError } from "@/utils/sentry";
import logger from "@/utils/logger";

interface UseToolOperationsProps {
  tool: DrawingMode;
  setTool: (tool: DrawingMode) => void;
}

export const useToolOperations = ({
  tool,
  setTool
}: UseToolOperationsProps) => {
  const handleToolChange = useCallback((newTool: DrawingMode) => {
    logger.info("Tool change requested", { 
      previousTool: tool, 
      newTool 
    });
    
    try {
      setTool(newTool);
      toast.success(`Changed to ${newTool} tool`);
      
      captureMessage("Drawing tool changed", "tool-change", {
        tags: { component: "CanvasApp", action: "toolChange" },
        extra: { previousTool: tool, newTool }
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to change drawing tool", { 
        error: errorMsg, 
        previousTool: tool, 
        newTool 
      });
      
      captureError(error as Error, "tool-change-error", {
        tags: { component: "CanvasApp", action: "toolChange" },
        extra: { previousTool: tool, newTool }
      });
      
      toast.error(`Failed to change tool: ${errorMsg}`);
    }
  }, [tool, setTool]);

  return {
    handleToolChange
  };
};
