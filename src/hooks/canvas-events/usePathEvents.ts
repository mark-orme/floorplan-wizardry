
/**
 * Hook for canvas path events
 * @module canvas-events/usePathEvents
 */
import { useCallback, useEffect } from 'react';
import { EventHandlerResult, UsePathEventsProps } from './types';

/**
 * Hook for handling path creation events in the canvas
 * 
 * @param {UsePathEventsProps} props - Properties for the hook
 * @returns {EventHandlerResult} - Event handler result with cleanup function
 */
export const usePathEvents = ({ 
  fabricCanvasRef, 
  tool,
  saveCurrentState,
  processCreatedPath,
  handleMouseUp
}: UsePathEventsProps): EventHandlerResult => {
  
  /**
   * Handle path created event
   */
  const handlePathCreated = useCallback((e: any) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    try {
      const path = e.path;
      if (path) {
        path.set({
          objectType: 'path',
          id: `path-${Date.now()}`
        });
        
        // Save state before processing the path if function provided
        if (saveCurrentState) {
          saveCurrentState();
        }
        
        // Process the created path if function provided
        if (processCreatedPath) {
          processCreatedPath(path);
        }
        
        // Handle mouse up if function provided (completes drawing operation)
        if (handleMouseUp) {
          handleMouseUp();
        }
        
        // Make sure the canvas renders the updated path
        canvas.renderAll();
      }
    } catch (error) {
      console.error('Error in path created handler:', error);
    }
  }, [fabricCanvasRef, saveCurrentState, processCreatedPath, handleMouseUp]);

  /**
   * Set up path events
   */
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Only attach path events when in drawing mode
    if (tool === 'free' || tool === 'draw') {
      canvas.on('path:created', handlePathCreated);
    }

    return () => {
      if (canvas) {
        canvas.off('path:created', handlePathCreated);
      }
    };
  }, [fabricCanvasRef, tool, handlePathCreated]);

  /**
   * Register event handlers
   */
  const register = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    canvas.on('path:created', handlePathCreated);
  }, [fabricCanvasRef, handlePathCreated]);

  /**
   * Unregister event handlers
   */
  const unregister = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    canvas.off('path:created', handlePathCreated);
  }, [fabricCanvasRef, handlePathCreated]);

  /**
   * Clean up resources
   */
  const cleanup = useCallback(() => {
    unregister();
  }, [unregister]);

  return {
    register,
    unregister,
    cleanup
  };
};
