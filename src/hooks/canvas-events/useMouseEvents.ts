
/**
 * Hook for canvas mouse events
 * @module canvas-events/useMouseEvents
 */
import { useCallback, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { EventHandlerResult, UseMouseEventsProps } from './types';

/**
 * Hook for handling mouse events on the canvas
 * 
 * @param {UseMouseEventsProps} props - Properties for the hook
 * @returns {EventHandlerResult} - Event handler result with register/unregister functions
 */
export const useMouseEvents = ({
  fabricCanvasRef,
  tool,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp
}: UseMouseEventsProps): EventHandlerResult => {
  
  /**
   * Convert fabric event to browser event
   * @param {any} e - Fabric event object
   * @returns {MouseEvent | TouchEvent | undefined} Browser event
   */
  const extractNativeEvent = useCallback((e: any): MouseEvent | TouchEvent | undefined => {
    if (!e) return undefined;
    
    // Handle both mouse and touch events
    return e.e as (MouseEvent | TouchEvent);
  }, []);
  
  /**
   * Handle mouse down event
   * @param {any} e - Fabric event object
   */
  const onMouseDown = useCallback((e: any) => {
    const nativeEvent = extractNativeEvent(e);
    if (nativeEvent) {
      handleMouseDown(nativeEvent);
    }
  }, [extractNativeEvent, handleMouseDown]);
  
  /**
   * Handle mouse move event
   * @param {any} e - Fabric event object
   */
  const onMouseMove = useCallback((e: any) => {
    const nativeEvent = extractNativeEvent(e);
    if (nativeEvent) {
      handleMouseMove(nativeEvent);
    }
  }, [extractNativeEvent, handleMouseMove]);
  
  /**
   * Handle mouse up event
   * @param {any} e - Fabric event object
   */
  const onMouseUp = useCallback((e: any) => {
    const nativeEvent = extractNativeEvent(e);
    if (nativeEvent) {
      handleMouseUp(nativeEvent);
    }
  }, [extractNativeEvent, handleMouseUp]);
  
  /**
   * Register event handlers
   */
  const register = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    canvas.on('mouse:down', onMouseDown);
    canvas.on('mouse:move', onMouseMove);
    canvas.on('mouse:up', onMouseUp);
  }, [fabricCanvasRef, onMouseDown, onMouseMove, onMouseUp]);
  
  /**
   * Unregister event handlers
   */
  const unregister = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    canvas.off('mouse:down', onMouseDown);
    canvas.off('mouse:move', onMouseMove);
    canvas.off('mouse:up', onMouseUp);
  }, [fabricCanvasRef, onMouseDown, onMouseMove, onMouseUp]);
  
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
