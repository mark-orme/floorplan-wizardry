
import { useCallback, useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { FabricEventTypes } from '@/types/fabric-events';
import logger from '@/utils/logger';

interface UseCanvasRestoreCheckProps {
  canvas: FabricCanvas | null;
  saveCurrentState: () => void;
}

/**
 * Hook for managing the check if canvas needs a state save after operations
 */
export const useCanvasRestoreCheck = ({
  canvas,
  saveCurrentState
}: UseCanvasRestoreCheckProps) => {
  // Track if events are being registered to prevent duplicate snapshots
  const isPerformingUndoRedoRef = useRef(false);
  
  /**
   * Set the performing undo/redo flag
   */
  const setIsPerformingUndoRedo = useCallback((value: boolean) => {
    isPerformingUndoRedoRef.current = value;
  }, []);

  /**
   * Check if we're currently performing undo/redo
   */
  const isPerformingUndoRedo = useCallback(() => {
    return isPerformingUndoRedoRef.current;
  }, []);

  /**
   * Register event handlers for tracking canvas changes
   */
  const registerCanvasChangeHandlers = useCallback(() => {
    if (!canvas) return () => {};
    
    const handleCanvasChange = () => {
      // Don't create snapshot if we're in the middle of undo/redo
      if (isPerformingUndoRedoRef.current) return;
      
      saveCurrentState();
    };
    
    // Track relevant canvas events
    const trackableEvents = [
      FabricEventTypes.OBJECT_ADDED, 
      FabricEventTypes.OBJECT_REMOVED, 
      FabricEventTypes.OBJECT_MODIFIED, 
      FabricEventTypes.PATH_CREATED
    ];
    
    // Add event listeners
    trackableEvents.forEach(event => {
      canvas.on(event, handleCanvasChange);
    });
    
    logger.debug("Registered canvas change handlers");
    
    // Return cleanup function
    return () => {
      trackableEvents.forEach(event => {
        canvas.off(event, handleCanvasChange);
      });
      logger.debug("Cleaned up canvas change handlers");
    };
  }, [canvas, saveCurrentState]);

  return {
    setIsPerformingUndoRedo,
    isPerformingUndoRedo,
    registerCanvasChangeHandlers
  };
};
