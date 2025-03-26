
/**
 * Hook for handling path creation events
 * @module usePathEvents
 */
import { useEffect } from "react";
import { Canvas as FabricCanvas, Path as FabricPath } from "fabric";
import logger from "@/utils/logger";
import { PathCreatedEvent, BaseEventHandlerProps } from "./types";

/**
 * Props for the usePathEvents hook
 */
interface UsePathEventsProps extends BaseEventHandlerProps {
  /** Function to save current state before making changes */
  saveCurrentState: () => void;
  /** Function to process created path */
  processCreatedPath: (path: FabricPath) => void;
  /** Function to handle mouse up event */
  handleMouseUp: (e?: MouseEvent | TouchEvent) => void;
}

/**
 * Hook to handle path creation events
 * @param {UsePathEventsProps} props - Hook properties
 */
export const usePathEvents = ({
  fabricCanvasRef,
  saveCurrentState,
  processCreatedPath,
  handleMouseUp
}: UsePathEventsProps): void => {
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
      
      // Call handleMouseUp with no arguments
      handleMouseUp();
    };
    
    // Cast to fabric event handler type
    const fabricPathCreated = handlePathCreated as (e: unknown) => void;
    
    fabricCanvas.on('path:created', fabricPathCreated);
    
    return () => {
      if (fabricCanvas) {
        fabricCanvas.off('path:created', fabricPathCreated);
      }
    };
  }, [fabricCanvasRef, processCreatedPath, handleMouseUp, saveCurrentState]);
};
