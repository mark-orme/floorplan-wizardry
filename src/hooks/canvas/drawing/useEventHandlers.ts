
/**
 * Canvas event handlers hook
 * Handles mouse and touch events for canvas drawing
 * @module hooks/canvas/drawing/useEventHandlers
 */
import { useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { Point } from '@/types/core/Point';
import { DrawingMode } from '@/constants/drawingModes';

/**
 * Event handler context
 */
export interface EventHandlerContext {
  canvas: FabricCanvas | null;
  activeTool: DrawingMode;
  isDrawing: boolean;
  onStartDrawing: (point: Point) => void;
  onContinueDrawing: (point: Point) => void;
  onEndDrawing: () => void;
}

/**
 * Hook for canvas event handlers
 * @param context Event handler context
 * @returns Event handler functions
 */
export const useEventHandlers = (context: EventHandlerContext) => {
  const { 
    canvas, 
    activeTool, 
    isDrawing,
    onStartDrawing,
    onContinueDrawing,
    onEndDrawing
  } = context;
  
  /**
   * Get pointer coordinates from event
   * @param event Mouse or touch event
   * @returns Point coordinates
   */
  const getPointerFromEvent = useCallback((event: any): Point | null => {
    if (!canvas) return null;
    
    return canvas.getPointer(event.e);
  }, [canvas]);
  
  /**
   * Handle mouse down event
   * @param event Mouse down event
   */
  const handleMouseDown = useCallback((event: any): void => {
    if (!canvas || activeTool === DrawingMode.SELECT) return;
    
    // Get pointer coordinates
    const pointer = getPointerFromEvent(event);
    if (!pointer) return;
    
    // Start drawing
    onStartDrawing(pointer);
  }, [canvas, activeTool, getPointerFromEvent, onStartDrawing]);
  
  /**
   * Handle mouse move event
   * @param event Mouse move event
   */
  const handleMouseMove = useCallback((event: any): void => {
    if (!canvas || !isDrawing) return;
    
    // Get pointer coordinates
    const pointer = getPointerFromEvent(event);
    if (!pointer) return;
    
    // Continue drawing
    onContinueDrawing(pointer);
  }, [canvas, isDrawing, getPointerFromEvent, onContinueDrawing]);
  
  /**
   * Handle mouse up event
   * @param event Mouse up event
   */
  const handleMouseUp = useCallback((): void => {
    if (!canvas || !isDrawing) return;
    
    // End drawing
    onEndDrawing();
  }, [canvas, isDrawing, onEndDrawing]);
  
  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    getPointerFromEvent
  };
};
