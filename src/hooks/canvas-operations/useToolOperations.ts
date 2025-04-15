
/**
 * Hook for managing drawing tool operations
 * Provides tool change handling with error reporting
 * @module hooks/canvas-operations/useToolOperations
 */
import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import { DrawingMode } from "@/constants/drawingModes";
import { DrawingTool } from "@/types/core/DrawingTool";
import { captureMessage, captureError } from "@/utils/sentry";
import * as Sentry from '@sentry/react';
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
  // Set Sentry context for the component
  useEffect(() => {
    Sentry.setTag("component", "useToolOperations");
    Sentry.setTag("currentTool", tool);
    
    Sentry.setContext("toolState", {
      currentTool: tool
    });
    
    return () => {
      // Clear component-specific tags when unmounting
      Sentry.setTag("component", null);
    };
  }, [tool]);
  
  /**
   * Handle tool change with error reporting
   * Takes a new tool and updates the tool state
   * 
   * @param {DrawingTool} newTool - The new tool to set
   */
  const handleToolChange = useCallback((newTool: DrawingTool) => {
    logger.info("Tool change requested", { 
      previousTool: tool, 
      newTool 
    });
    
    // Update Sentry context for tool change
    Sentry.setTag("action", "toolChange");
    Sentry.setContext("toolChange", {
      previousTool: tool,
      newTool,
      timestamp: new Date().toISOString()
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
      
      // Set error context in Sentry
      Sentry.setTag("errorSource", "toolChange");
      Sentry.setContext("toolChangeError", {
        error: errorMsg,
        previousTool: tool,
        newTool,
        timestamp: new Date().toISOString()
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
