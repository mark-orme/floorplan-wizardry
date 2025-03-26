
/**
 * Hook for handling path creation events
 * @module usePathEvents
 */
import { useEffect } from "react";
import { Canvas as FabricCanvas, Path as FabricPath } from "fabric";
import logger from "@/utils/logger";
import { PathCreatedEvent, BaseEventHandlerProps } from "./types";

interface UsePathEventsProps extends BaseEventHandlerProps {
  /** Function to save current state before making changes */
  saveCurrentState: () => void;
  /** Function to process created path */
  processCreatedPath: (path: FabricPath) => void;
  /** Function to handle mouse up event */
  handleMouseUp: () => void;
}

/**
 * Hook to handle path creation events
 */
export const usePathEvents = ({
  fabricCanvasRef,
  saveCurrentState,
  processCreatedPath,
  handleMouseUp
}: UsePathEventsProps) => {
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    const fabricCanvas = fabricCanvasRef.current;
    
    /**
     * Handle path created event
     * @param {PathCreatedEvent} e - Event object containing the created path
     */
    const handlePathCreated = (e: PathCreatedEvent): void => {
      logger.info("Path created event triggered");
      
      // IMPORTANT: Save current state BEFORE making any changes
      // This ensures we can properly undo to previous state
      saveCurrentState();
      
      // Process the path based on the current tool
      processCreatedPath(e.path);
      handleMouseUp();
    };
    
    fabricCanvas.on('path:created', handlePathCreated as any);
    
    return () => {
      if (fabricCanvas) {
        fabricCanvas.off('path:created', handlePathCreated as any);
      }
    };
  }, [fabricCanvasRef, processCreatedPath, handleMouseUp, saveCurrentState]);
};
