
/**
 * Hook for handling path creation events
 * @module usePathEvents
 */
import { useEffect } from "react";
import type { Canvas as FabricCanvas, Path as FabricPath, TEvent } from "fabric";
import logger from "@/utils/logger";
import { BaseEventHandlerProps, EventHandlerResult } from "./types";

/**
 * Event interface with path created
 */
interface PathCreatedEvent extends TEvent {
  path: FabricPath;
}

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
 * Type for the Fabric event handler to satisfy Fabric.js API
 */
type FabricEventHandler = (e: PathCreatedEvent) => void;

/**
 * Hook to handle path creation events
 * @param {UsePathEventsProps} props - Hook properties
 * @returns {EventHandlerResult} Cleanup function
 */
export const usePathEvents = ({
  fabricCanvasRef,
  saveCurrentState,
  processCreatedPath,
  handleMouseUp
}: UsePathEventsProps): EventHandlerResult => {
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
    
    // Register the event handler
    fabricCanvas.on('path:created', handlePathCreated as FabricEventHandler);
    
    return () => {
      if (fabricCanvas) {
        fabricCanvas.off('path:created', handlePathCreated as FabricEventHandler);
      }
    };
  }, [fabricCanvasRef, processCreatedPath, handleMouseUp, saveCurrentState]);

  return {
    cleanup: () => {
      if (fabricCanvasRef.current) {
        logger.debug("Path events cleanup");
      }
    }
  };
};
