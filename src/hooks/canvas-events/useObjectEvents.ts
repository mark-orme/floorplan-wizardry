
/**
 * Hook for handling object events (modification, removal)
 * @module useObjectEvents
 */
import { useEffect } from "react";
import { Canvas as FabricCanvas } from "fabric";
import logger from "@/utils/logger";
import { BaseEventHandlerProps } from "./types";

interface UseObjectEventsProps extends BaseEventHandlerProps {
  /** Function to save current state before making changes */
  saveCurrentState: () => void;
}

/**
 * Hook to handle object modification and removal events
 */
export const useObjectEvents = ({
  fabricCanvasRef,
  saveCurrentState
}: UseObjectEventsProps) => {
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
    
    fabricCanvas.on('object:modified', handleObjectModified);
    fabricCanvas.on('object:removed', handleObjectRemoved);
    
    return () => {
      if (fabricCanvas) {
        fabricCanvas.off('object:modified', handleObjectModified);
        fabricCanvas.off('object:removed', handleObjectRemoved);
      }
    };
  }, [fabricCanvasRef, saveCurrentState]);
};
