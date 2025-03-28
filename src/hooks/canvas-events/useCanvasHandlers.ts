
/**
 * Hook for registering multiple canvas event handlers
 * @module canvas-events/useCanvasHandlers
 */
import { useCallback, useEffect } from 'react';
import { EventHandlerResult, UseCanvasHandlersProps } from './types';

/**
 * Hook for registering multiple canvas event handlers
 * @param {UseCanvasHandlersProps} props Canvas handlers props
 * @returns {EventHandlerResult} Event handler result
 */
export const useCanvasHandlers = ({
  fabricCanvasRef,
  tool,
  eventTypes,
  handlers
}: UseCanvasHandlersProps): EventHandlerResult => {
  /**
   * Register event handlers
   */
  const register = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    
    // Register each event handler
    eventTypes.forEach(eventType => {
      const handler = handlers[eventType];
      if (handler) {
        // Use type assertion to handle string event types
        canvas.on(eventType as any, handler);
      }
    });
  }, [fabricCanvasRef, eventTypes, handlers]);
  
  /**
   * Unregister event handlers
   */
  const unregister = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    
    // Unregister each event handler
    eventTypes.forEach(eventType => {
      const handler = handlers[eventType];
      if (handler) {
        // Use type assertion to handle string event types
        canvas.off(eventType as any, handler);
      }
    });
  }, [fabricCanvasRef, eventTypes, handlers]);
  
  /**
   * Clean up resources
   */
  const cleanup = useCallback(() => {
    unregister();
  }, [unregister]);
  
  // Register events when component mounts
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
