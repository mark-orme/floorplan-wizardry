
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
   * This fires after scaling, rotating, moving, or other property changes
   * @constant {string}
   */
  OBJECT_MODIFIED: 'object:modified',
  
  /**
   * Object removed event name - triggered when object is deleted
   * This fires when an object is removed from the canvas
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
   * Creates a point that can be returned to with undo
   */
  saveCurrentState: () => void;
}

/**
 * Type for handling Fabric's event system
 * Fabric.js requires this type for event handlers
 * This helps with type safety when adding/removing event listeners
 */
type FabricEventHandler = (e: unknown) => void;

/**
 * Hook to handle object modification and removal events
 * Creates snapshots for undo/redo history when objects change
 * 
 * This is crucial for history tracking as it determines when to
 * create snapshots that can be used for undo/redo operations
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
    // This prevents errors when trying to access properties of null
    if (!fabricCanvasRef.current) return;
    
    const fabricCanvas = fabricCanvasRef.current;
    
    /**
     * Handle object modified event
     * Creates history snapshot when object properties are modified
     * 
     * This is triggered by:
     * - Moving objects
     * - Resizing objects
     * - Rotating objects
     * - Changing object properties (color, opacity, etc.)
     */
    const handleObjectModified = (): void => {
      logger.info("Object modified, saving state");
      saveCurrentState();
    };
    
    /**
     * Handle object removed event
     * Creates history snapshot when object is deleted from canvas
     * 
     * This is triggered by:
     * - Deleting objects with Delete/Backspace
     * - Programmatically removing objects
     * - Cut operations
     * 
     * Enables undo for object deletion operations, allowing
     * users to recover accidentally deleted objects
     */
    const handleObjectRemoved = (): void => {
      logger.info("Object removed, saving state");
      saveCurrentState();
    };
    
    // Register event handlers with proper typing
    // We need to use 'any' casting here due to Fabric.js event system limitations
    // The 'as any' is necessary because Fabric's TypeScript definitions don't
    // perfectly match the actual event system implementation
    fabricCanvas.on(OBJECT_EVENTS.OBJECT_MODIFIED as any, handleObjectModified as FabricEventHandler);
    fabricCanvas.on(OBJECT_EVENTS.OBJECT_REMOVED as any, handleObjectRemoved as FabricEventHandler);
    
    // Clean up event handlers when component unmounts
    // This is crucial to prevent memory leaks and duplicate handlers
    return () => {
      if (fabricCanvas) {
        fabricCanvas.off(OBJECT_EVENTS.OBJECT_MODIFIED as any, handleObjectModified as FabricEventHandler);
        fabricCanvas.off(OBJECT_EVENTS.OBJECT_REMOVED as any, handleObjectRemoved as FabricEventHandler);
      }
    };
  }, [fabricCanvasRef, saveCurrentState]);

  // Return cleanup function for external use if needed
  return {
    cleanup: () => {
      if (fabricCanvasRef.current) {
        logger.debug("Object events cleanup");
      }
    }
  };
};
