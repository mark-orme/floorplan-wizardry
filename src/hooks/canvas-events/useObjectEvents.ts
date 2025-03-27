
/**
 * Hook for handling object events (modification, removal)
 * Provides tracking of object changes for history management
 * @module useObjectEvents
 */
import { useEffect } from "react";
import type { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import logger from "@/utils/logger";
import type { BaseEventHandlerProps, EventHandlerResult } from "./types";

/**
 * Constants for object event names
 * Used for registering and unregistering event handlers
 * @constant {Object}
 */
const OBJECT_EVENTS = {
  /**
   * Object modified event name - triggered when object properties change
   * @constant {string}
   */
  OBJECT_MODIFIED: 'object:modified',
  
  /**
   * Object removed event name - triggered when object is deleted
   * @constant {string}
   */
  OBJECT_REMOVED: 'object:removed'
};

/**
 * Interface for useObjectEvents props extending base handler props
 * @interface IUseObjectEventsProps
 */
interface IUseObjectEventsProps extends BaseEventHandlerProps {
  /** 
   * Function to save current state before making changes
   * Used to create history snapshot before objects are modified
   */
  saveCurrentState: () => void;
}

/**
 * Type for handling Fabric's event system
 * Fabric.js requires this type for event handlers
 */
type FabricEventHandler = (e: unknown) => void;

/**
 * Hook to handle object modification and removal events
 * Creates snapshots for undo/redo history when objects change
 * 
 * @param {IUseObjectEventsProps} props - Hook properties
 * @returns {EventHandlerResult} Cleanup function
 */
export const useObjectEvents = ({
  fabricCanvasRef,
  saveCurrentState
}: IUseObjectEventsProps): EventHandlerResult => {
  useEffect(() => {
    // Early return if canvas reference is not available
    if (!fabricCanvasRef.current) return;
    
    const fabricCanvas = fabricCanvasRef.current;
    
    /**
     * Handle object modified event
     * Creates history snapshot when object properties are modified
     * Triggers on resize, rotate, position changes, etc.
     */
    const handleObjectModified = (): void => {
      logger.info("Object modified, saving state");
      saveCurrentState();
    };
    
    /**
     * Handle object removed event
     * Creates history snapshot when object is deleted from canvas
     * Enables undo for object deletion operations
     */
    const handleObjectRemoved = (): void => {
      logger.info("Object removed, saving state");
      saveCurrentState();
    };
    
    // Register event handlers with proper typing
    fabricCanvas.on(OBJECT_EVENTS.OBJECT_MODIFIED as any, handleObjectModified as FabricEventHandler);
    fabricCanvas.on(OBJECT_EVENTS.OBJECT_REMOVED as any, handleObjectRemoved as FabricEventHandler);
    
    // Clean up event handlers when component unmounts
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
