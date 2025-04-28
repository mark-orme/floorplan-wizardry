
/**
 * Hook for handling object events on canvas
 * @module canvas-events/useObjectEvents
 */
import { useCallback } from 'react';
import { EventHandlerResult, UseObjectEventsProps } from './types';
import { useCanvasHandlers } from './useCanvasHandlers';

/**
 * Hook for handling object events on canvas
 * @param {UseObjectEventsProps} props - Object events props
 * @returns {EventHandlerResult} Event handler result
 */
export const useObjectEvents = ({
  fabricCanvasRef,
  tool,
  onObjectAdded,
  onObjectModified,
  onObjectRemoved,
  saveCurrentState,
  lineColor = '#000000',
  lineThickness = 1
}: UseObjectEventsProps): EventHandlerResult => {
  // Create event handlers
  const handleObjectAdded = useCallback((e: any) => {
    if (onObjectAdded) {
      onObjectAdded(e);
    }
    
    // Save state if needed
    if (saveCurrentState) {
      saveCurrentState();
    }
  }, [onObjectAdded, saveCurrentState]);
  
  const handleObjectModified = useCallback((e: any) => {
    if (onObjectModified) {
      onObjectModified(e);
    }
    
    // Save state if needed
    if (saveCurrentState) {
      saveCurrentState();
    }
  }, [onObjectModified, saveCurrentState]);
  
  const handleObjectRemoved = useCallback((e: any) => {
    if (onObjectRemoved) {
      onObjectRemoved(e);
    }
    
    // Save state if needed
    if (saveCurrentState) {
      saveCurrentState();
    }
  }, [onObjectRemoved, saveCurrentState]);
  
  const eventTypes = ['object:added', 'object:modified', 'object:removed'];
  const handlers = {
    'object:added': handleObjectAdded,
    'object:modified': handleObjectModified,
    'object:removed': handleObjectRemoved
  };
  
  // Use common canvas handlers
  return useCanvasHandlers({
    fabricCanvasRef,
    tool,
    eventTypes,
    handlers,
    lineColor,
    lineThickness
  });
};
