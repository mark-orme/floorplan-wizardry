
/**
 * Hook for handling object-related canvas events
 * @module useObjectEvents
 */
import { useEffect } from "react";
import { Canvas as FabricCanvas, Object as FabricObject, TPointerEvent, TEvent } from "fabric";
import logger from "@/utils/logger";
import { BaseEventHandlerProps, EventHandlerResult } from "./types";

// Imported from the fabric definitions
interface SelectionEvent extends Partial<TEvent<TPointerEvent>> {
  selected?: FabricObject[];
  deselected?: FabricObject[];
  target?: FabricObject;
}

interface ModifiedEvent extends Partial<TEvent<TPointerEvent>> {
  target?: FabricObject;
}

interface ObjectEvent extends Partial<TEvent<TPointerEvent>> {
  target?: FabricObject;
}

/**
 * Props for the useObjectEvents hook
 */
interface UseObjectEventsProps extends BaseEventHandlerProps {
  /** Flag to enable/disable selection */
  selectionEnabled?: boolean;
  /** Callback for object selection */
  onObjectSelected?: (objects: FabricObject[]) => void;
  /** Callback for object modification */
  onObjectModified?: (object: FabricObject) => void;
  /** Callback for object addition */
  onObjectAdded?: (object: FabricObject) => void;
  /** Callback for object removal */
  onObjectRemoved?: (object: FabricObject) => void;
  /** Function to save current state before making changes (optional) */
  saveCurrentState?: () => void;
}

/**
 * Hook to handle object-related events
 * @param {UseObjectEventsProps} props - Hook properties
 * @returns {EventHandlerResult} Cleanup function
 */
export const useObjectEvents = ({
  fabricCanvasRef,
  selectionEnabled = true,
  onObjectSelected,
  onObjectModified,
  onObjectAdded,
  onObjectRemoved,
  saveCurrentState
}: UseObjectEventsProps): EventHandlerResult => {
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    const fabricCanvas = fabricCanvasRef.current;
    
    // Update selection capability based on props
    fabricCanvas.selection = selectionEnabled;
    
    /**
     * Handle selection events
     * Calls provided callback with selected objects
     * @param {SelectionEvent} e - Selection event
     */
    const handleSelectionEvent = (e: SelectionEvent): void => {
      if (!onObjectSelected) return;
      
      try {
        // Access the selected objects differently based on event type
        if (e.selected && Array.isArray(e.selected)) {
          onObjectSelected(e.selected);
        } else if (e.target) {
          onObjectSelected([e.target]);
        } else {
          onObjectSelected([]);
        }
      } catch (err) {
        logger.error("Error handling selection event:", err);
      }
    };
    
    /**
     * Handle object modification
     * Calls provided callback with modified object
     * @param {ModifiedEvent} e - Modification event
     */
    const handleObjectModified = (e: ModifiedEvent): void => {
      if (!onObjectModified || !e.target) return;
      onObjectModified(e.target);
    };
    
    /**
     * Handle object added
     * Calls provided callback with added object
     * @param {ObjectEvent} e - Object added event
     */
    const handleObjectAdded = (e: ObjectEvent): void => {
      if (!onObjectAdded || !e.target) return;
      onObjectAdded(e.target);
    };
    
    /**
     * Handle object removed
     * Calls provided callback with removed object
     * @param {ObjectEvent} e - Object removed event
     */
    const handleObjectRemoved = (e: ObjectEvent): void => {
      if (!onObjectRemoved || !e.target) return;
      onObjectRemoved(e.target);
    };
    
    // Register event handlers - using proper type casting
    fabricCanvas.on('selection:created', handleSelectionEvent as any);
    fabricCanvas.on('selection:updated', handleSelectionEvent as any);
    fabricCanvas.on('selection:cleared', handleSelectionEvent as any);
    
    if (onObjectModified) {
      fabricCanvas.on('object:modified', handleObjectModified as any);
    }
    
    if (onObjectAdded) {
      fabricCanvas.on('object:added', handleObjectAdded as any);
    }
    
    if (onObjectRemoved) {
      fabricCanvas.on('object:removed', handleObjectRemoved as any);
    }
    
    // Cleanup: Remove event handlers
    return () => {
      if (fabricCanvas) {
        fabricCanvas.off('selection:created', handleSelectionEvent as any);
        fabricCanvas.off('selection:updated', handleSelectionEvent as any);
        fabricCanvas.off('selection:cleared', handleSelectionEvent as any);
        
        if (onObjectModified) {
          fabricCanvas.off('object:modified', handleObjectModified as any);
        }
        
        if (onObjectAdded) {
          fabricCanvas.off('object:added', handleObjectAdded as any);
        }
        
        if (onObjectRemoved) {
          fabricCanvas.off('object:removed', handleObjectRemoved as any);
        }
      }
    };
  }, [
    fabricCanvasRef,
    selectionEnabled,
    onObjectSelected,
    onObjectModified,
    onObjectAdded,
    onObjectRemoved,
    saveCurrentState
  ]);
  
  return {
    cleanup: () => {
      logger.debug("Object events cleanup");
    }
  };
};
