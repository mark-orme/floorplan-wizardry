
/**
 * Hook for handling object events (modification, removal)
 * @module useObjectEvents
 */
import { useEffect } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import logger from "@/utils/logger";
import { BaseEventHandlerProps, EventHandlerResult } from "./types";

/**
 * Constants for object event names
 * @constant {Object}
 */
const OBJECT_EVENTS = {
  /**
   * Object modified event name
   * @constant {string}
   */
  OBJECT_MODIFIED: 'object:modified',
  
  /**
   * Object removed event name
   * @constant {string}
   */
  OBJECT_REMOVED: 'object:removed'
};

/**
 * Interface for useObjectEvents props extending base handler props
 * @interface UseObjectEventsProps
 */
interface UseObjectEventsProps extends BaseEventHandlerProps {
  /** Function to save current state before making changes */
  saveCurrentState: () => void;
}

/**
 * Hook to handle object modification and removal events
 * @param {UseObjectEventsProps} props - Hook properties
 * @returns {EventHandlerResult} Cleanup function
 */
export const useObjectEvents = ({
  fabricCanvasRef,
  saveCurrentState
}: UseObjectEventsProps): EventHandlerResult => {
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    const fabricCanvas = fabricCanvasRef.current;
    
    /**
     * Handle object modified event
     * Saves state when object is modified
     */
    const handleObjectModified = (): void => {
      // Save state when objects are modified
      logger.info("Object modified, saving state");
      saveCurrentState();
    };
    
    /**
     * Handle object removed event
     * Saves state when object is removed
     */
    const handleObjectRemoved = (): void => {
      // Save state when objects are removed
      logger.info("Object removed, saving state");
      saveCurrentState();
    };
    
    // Use a typed approach to handle fabric's event system
    // Type assertions needed due to fabric.js event system peculiarities
    type FabricEventHandler = (e: unknown) => void;
    
    // Register event handlers with proper typing
    fabricCanvas.on(OBJECT_EVENTS.OBJECT_MODIFIED as any, handleObjectModified as FabricEventHandler);
    fabricCanvas.on(OBJECT_EVENTS.OBJECT_REMOVED as any, handleObjectRemoved as FabricEventHandler);
    
    return () => {
      if (fabricCanvas) {
        fabricCanvas.off(OBJECT_EVENTS.OBJECT_MODIFIED as any, handleObjectModified as FabricEventHandler);
        fabricCanvas.off(OBJECT_EVENTS.OBJECT_REMOVED as any, handleObjectRemoved as FabricEventHandler);
      }
    };
  }, [fabricCanvasRef, saveCurrentState]);

  return {
    cleanup: () => {
      if (fabricCanvasRef.current) {
        logger.debug("Object events cleanup");
      }
    }
  };
};
