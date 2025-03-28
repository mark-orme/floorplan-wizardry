
/**
 * Hook for registering canvas event handlers
 * @module canvas-events/useCanvasHandlers
 */
import { useCallback, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { EventHandlerResult, UseCanvasHandlersProps } from './types';

// Define a type that allows string indexing for any event
type GenericEventMap = {
  [key: string]: any;
};

/**
 * Hook for managing generic canvas event handlers
 * 
 * @param {UseCanvasHandlersProps} props - Properties for the hook
 * @returns {EventHandlerResult} - Event handler result with register/unregister functions
 */
export const useCanvasHandlers = ({
  fabricCanvasRef,
  handlers
}: UseCanvasHandlersProps): EventHandlerResult => {
  
  /**
   * Register all event handlers
   */
  const register = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Register each handler
    Object.entries(handlers).forEach(([eventName, handler]) => {
      // Use type assertion with string index to allow any event name
      (canvas as unknown as { on: (event: string, handler: any) => void })
        .on(eventName, handler);
    });
  }, [fabricCanvasRef, handlers]);
  
  /**
   * Unregister all event handlers
   */
  const unregister = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Unregister each handler
    Object.entries(handlers).forEach(([eventName, handler]) => {
      // Use type assertion with string index to allow any event name
      (canvas as unknown as { off: (event: string, handler: any) => void })
        .off(eventName, handler);
    });
  }, [fabricCanvasRef, handlers]);
  
  /**
   * Clean up resources
   */
  const cleanup = useCallback(() => {
    unregister();
  }, [unregister]);
  
  // Register and cleanup on mount/unmount
  useEffect(() => {
    register();
    return cleanup;
  }, [register, cleanup]);
  
  return {
    register,
    unregister,
    cleanup
  };
};
