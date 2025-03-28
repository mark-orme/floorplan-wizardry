/**
 * Hook for handling path creation events
 * @module canvas-events/usePathEvents
 */
import { useCallback } from 'react';
import { useCanvasHandlers } from './useCanvasHandlers';
import { UsePathEventsProps, EventHandlerResult } from './types';

/**
 * Hook for handling path-related canvas events
 * 
 * @param {UsePathEventsProps} props - Properties for the hook
 * @returns {EventHandlerResult} - Event handler result
 */
export const usePathEvents = ({
  fabricCanvasRef,
  saveCurrentState,
  processCreatedPath,
  handleMouseUp
}: UsePathEventsProps): EventHandlerResult => {
  
  /**
   * Handle path created event
   */
  const handlePathCreated = useCallback((e: any) => {
    const path = e.path;
    if (path) {
      processCreatedPath(path);
    }
    
    // Save state after path is created and processed
    saveCurrentState();
  }, [processCreatedPath, saveCurrentState]);
  
  /**
   * Handle mouse down event
   */
  const handleMouseDown = useCallback((e: any) => {
    // Custom mouse down handling for path creation
  }, []);
  
  /**
   * Handle mouse move event
   */
  const handleMouseMove = useCallback((e: any) => {
    // Custom mouse move handling for path creation
  }, []);
  
  /**
   * Handle mouse up event
   */
  const onMouseUp = useCallback((e: any) => {
    if (handleMouseUp) {
      handleMouseUp(e);
    }
  }, [handleMouseUp]);
  
  // Set up handlers with useCanvasHandlers
  return useCanvasHandlers({
    fabricCanvasRef,
    handlers: {
      'path:created': handlePathCreated,
      'mouse:down': handleMouseDown,
      'mouse:move': handleMouseMove,
      'mouse:up': onMouseUp
    }
  });
};
