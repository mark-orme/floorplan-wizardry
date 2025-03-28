
/**
 * Hook for registering canvas event handlers
 * @module canvas-events/useCanvasHandlers
 */
import { useCallback, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { EventHandlerResult, UseCanvasHandlersProps, EventHandlerMap, CanvasEvents } from './types';

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
      // Type assertion to satisfy TypeScript
      canvas.on(eventName as keyof CanvasEvents, handler);
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
      // Type assertion to satisfy TypeScript
      canvas.off(eventName as keyof CanvasEvents, handler);
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
