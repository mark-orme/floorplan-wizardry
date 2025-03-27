
/**
 * Hook for handling object events (modification, removal)
 * @module useObjectEvents
 */
import { useEffect } from "react";
import { Canvas as FabricCanvas, Object as FabricObject, TPointerEventInfo } from "fabric";
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

interface UseObjectEventsProps extends BaseEventHandlerProps {
  /** Function to save current state before making changes */
  saveCurrentState: () => void;
}

/**
 * Hook to handle object modification and removal events
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
     */
    const handleObjectModified = (): void => {
      // Save state when objects are modified
      logger.info("Object modified, saving state");
      saveCurrentState();
    };
    
    /**
     * Handle object removed event
     */
    const handleObjectRemoved = (): void => {
      // Save state when objects are removed
      logger.info("Object removed, saving state");
      saveCurrentState();
    };
    
    // Type the event string for canvas with "as string", this masks the event string
    // to be treated as a valid event key for the canvas's event system
    fabricCanvas.on(OBJECT_EVENTS.OBJECT_MODIFIED as string, handleObjectModified);
    fabricCanvas.on(OBJECT_EVENTS.OBJECT_REMOVED as string, handleObjectRemoved);
    
    return () => {
      if (fabricCanvas) {
        fabricCanvas.off(OBJECT_EVENTS.OBJECT_MODIFIED as string, handleObjectModified);
        fabricCanvas.off(OBJECT_EVENTS.OBJECT_REMOVED as string, handleObjectRemoved);
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
