
/**
 * Hook for handling canvas object events
 * @module canvas-events/useObjectEvents
 */
import { useCallback } from 'react';
import { useCanvasHandlers } from './useCanvasHandlers';
import { UseObjectEventsProps, EventHandlerResult } from './types';

/**
 * Hook for handling object-related canvas events
 * 
 * @param {UseObjectEventsProps} props - Properties for the hook
 * @returns {EventHandlerResult} - Event handler result
 */
export const useObjectEvents = ({
  fabricCanvasRef,
  tool,
  saveCurrentState
}: UseObjectEventsProps): EventHandlerResult => {
  /**
   * Handle object modified event
   */
  const handleObjectModified = useCallback(() => {
    saveCurrentState();
  }, [saveCurrentState]);
  
  /**
   * Handle object added event
   */
  const handleObjectAdded = useCallback(() => {
    // Only save state for non-drawing tools
    if (tool !== 'draw' && tool !== 'line') {
      saveCurrentState();
    }
  }, [tool, saveCurrentState]);
  
  /**
   * Handle object removed event
   */
  const handleObjectRemoved = useCallback(() => {
    saveCurrentState();
  }, [saveCurrentState]);
  
  /**
   * Handle object selected event
   */
  const handleObjectSelected = useCallback(() => {
    // Handle selection if needed
  }, []);
  
  /**
   * Handle selection cleared event
   */
  const handleSelectionCleared = useCallback(() => {
    // Handle selection clearing if needed
  }, []);
  
  // Set up handlers with useCanvasHandlers
  return useCanvasHandlers({
    fabricCanvasRef,
    handlers: {
      'object:modified': handleObjectModified,
      'object:added': handleObjectAdded,
      'object:removed': handleObjectRemoved,
      'object:selected': handleObjectSelected,
      'selection:cleared': handleSelectionCleared
    }
  });
};
