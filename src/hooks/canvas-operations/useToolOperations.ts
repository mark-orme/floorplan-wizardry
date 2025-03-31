
/**
 * Hook for managing drawing tool operations
 * Provides tool change handling with error reporting
 * @module hooks/canvas-operations/useToolOperations
 */
import { useCallback } from "react";
import { toast } from "sonner";
import { DrawingMode } from "@/constants/drawingModes";
import { DrawingTool } from "@/types/core/DrawingTool";
import { captureMessage, captureError } from "@/utils/sentry";
import logger from "@/utils/logger";

/**
 * Props for useToolOperations hook
 * 
 * @interface UseToolOperationsProps
 */
interface UseToolOperationsProps {
  /** Current drawing tool */
  tool: DrawingTool;
  /** Function to set the current tool */
  setTool: (tool: DrawingTool) => void;
}

/**
 * Result of useToolOperations hook
 * 
 * @interface UseToolOperationsResult
 */
interface UseToolOperationsResult {
  /** Handle tool change function */
  handleToolChange: (newTool: DrawingTool) => void;
}

/**
 * Hook for managing tool operations
 * Handles tool changes with error reporting
 * 
 * @param {UseToolOperationsProps} props - Hook props
 * @returns {UseToolOperationsResult} Tool operation handlers
 */
export const useToolOperations = ({
  tool,
  setTool
}: UseToolOperationsProps): UseToolOperationsResult => {
  const handleToolChange = useCallback((newTool: DrawingTool) => {
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
