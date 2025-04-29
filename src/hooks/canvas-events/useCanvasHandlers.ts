
/**
 * Hook for registering multiple canvas event handlers
 * @module canvas-events/useCanvasHandlers
 */
import { useCallback, useEffect, useRef } from 'react';
import { EventHandlerResult, UseCanvasHandlersProps } from './types';

/**
 * Hook for registering multiple canvas event handlers
 * @param {UseCanvasHandlersProps} props Canvas handlers props
 * @returns {EventHandlerResult} Event handler result
 */
export const useCanvasHandlers = ({
  fabricCanvasRef,
  tool,
  eventTypes = [],
  handlers = {}
}: UseCanvasHandlersProps): EventHandlerResult => {
  // Use a ref to track registered handlers to prevent unnecessary re-registrations
  const registeredHandlersRef = useRef<Record<string, boolean>>({});
  
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
        // Skip if handler is already registered for this event type
        if (registeredHandlersRef.current[eventType]) {
          return;
        }
        
        // Register the handler
        canvas.on(eventType as any, handler);
        
        // Mark as registered
        registeredHandlersRef.current[eventType] = true;
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
      if (handler && registeredHandlersRef.current[eventType]) {
        // Unregister the handler
        canvas.off(eventType as any, handler);
        
        // Mark as unregistered
        registeredHandlersRef.current[eventType] = false;
      }
    });
  }, [fabricCanvasRef, eventTypes, handlers]);
  
  // Register events when component mounts or dependencies change
  useEffect(() => {
    register();
    return () => unregister();
  }, [register, unregister, tool]); // Added tool as dependency to re-register on tool change
  
  return {
    register,
    unregister
  };
};
