
/**
 * Hook for handling object-related canvas events
 * @module useObjectEvents
 */
import { useEffect } from "react";
import type { Canvas as FabricCanvas, TEvent, Object as FabricObject } from "fabric";
import logger from "@/utils/logger";
import { BaseEventHandlerProps, EventHandlerResult } from "./types";

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
}

/**
 * Interface mapping event names to their handlers
 */
interface CanvasEvents {
  'selection:created': (e: TEvent) => void;
  'selection:updated': (e: TEvent) => void;
  'selection:cleared': (e: TEvent) => void;
  'object:modified': (e: TEvent) => void;
  'object:added': (e: TEvent) => void;
  'object:removed': (e: TEvent) => void;
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
  onObjectRemoved
}: UseObjectEventsProps): EventHandlerResult => {
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    const fabricCanvas = fabricCanvasRef.current;
    
    // Update selection capability based on props
    fabricCanvas.selection = selectionEnabled;
    
    /**
     * Handle selection events
     * Calls provided callback with selected objects
     * @param {TEvent} e - Selection event
     */
    const handleSelectionEvent = (e: TEvent): void => {
      if (!onObjectSelected) return;
      
      try {
        // Access the selected objects differently based on event type
        if (e.selected && Array.isArray(e.selected)) {
          onObjectSelected(e.selected);
        } else if (e.target) {
          onObjectSelected([e.target as FabricObject]);
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
     * @param {TEvent} e - Modification event
     */
    const handleObjectModified = (e: TEvent): void => {
      if (!onObjectModified || !e.target) return;
      onObjectModified(e.target as FabricObject);
    };
    
    /**
     * Handle object added
     * Calls provided callback with added object
     * @param {TEvent} e - Object added event
     */
    const handleObjectAdded = (e: TEvent): void => {
      if (!onObjectAdded || !e.target) return;
      onObjectAdded(e.target as FabricObject);
    };
    
    /**
     * Handle object removed
     * Calls provided callback with removed object
     * @param {TEvent} e - Object removed event
     */
    const handleObjectRemoved = (e: TEvent): void => {
      if (!onObjectRemoved || !e.target) return;
      onObjectRemoved(e.target as FabricObject);
    };
    
    // Register event handlers
    fabricCanvas.on('selection:created', handleSelectionEvent as CanvasEvents['selection:created']);
    fabricCanvas.on('selection:updated', handleSelectionEvent as CanvasEvents['selection:updated']);
    fabricCanvas.on('selection:cleared', handleSelectionEvent as CanvasEvents['selection:cleared']);
    
    if (onObjectModified) {
      fabricCanvas.on('object:modified', handleObjectModified as CanvasEvents['object:modified']);
    }
    
    if (onObjectAdded) {
      fabricCanvas.on('object:added', handleObjectAdded as CanvasEvents['object:added']);
    }
    
    if (onObjectRemoved) {
      fabricCanvas.on('object:removed', handleObjectRemoved as CanvasEvents['object:removed']);
    }
    
    // Cleanup: Remove event handlers
    return () => {
      if (fabricCanvas) {
        fabricCanvas.off('selection:created', handleSelectionEvent as CanvasEvents['selection:created']);
        fabricCanvas.off('selection:updated', handleSelectionEvent as CanvasEvents['selection:updated']);
        fabricCanvas.off('selection:cleared', handleSelectionEvent as CanvasEvents['selection:cleared']);
        
        if (onObjectModified) {
          fabricCanvas.off('object:modified', handleObjectModified as CanvasEvents['object:modified']);
        }
        
        if (onObjectAdded) {
          fabricCanvas.off('object:added', handleObjectAdded as CanvasEvents['object:added']);
        }
        
        if (onObjectRemoved) {
          fabricCanvas.off('object:removed', handleObjectRemoved as CanvasEvents['object:removed']);
        }
      }
    };
  }, [
    fabricCanvasRef,
    selectionEnabled,
    onObjectSelected,
    onObjectModified,
    onObjectAdded,
    onObjectRemoved
  ]);
  
  return {
    cleanup: () => {
      logger.debug("Object events cleanup");
    }
  };
};
