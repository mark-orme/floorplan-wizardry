
/**
 * Hook for straight line drawing tools
 * @module hooks/straightLineTool/useStraightLineTool
 */
import { useCallback, useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { Point } from '@/types/core/Point';
import { useLineState, InputMethod } from './useLineState';
import { detectStylusFromEvent } from '@/types/input/InputMethod';

interface UseStraightLineToolProps {
  canvas: FabricCanvas | null;
  enabled: boolean;
  lineColor: string;
  lineThickness: number;
  saveCurrentState: () => void;
}

/**
 * Hook for creating straight lines with the fabric canvas
 * Supports enhanced Apple Pencil and stylus features
 */
export const useStraightLineTool = ({
  canvas,
  enabled,
  lineColor,
  lineThickness,
  saveCurrentState
}: UseStraightLineToolProps) => {
  const fabricCanvasRef = useRef<FabricCanvas | null>(canvas);
  
  // Update canvas ref if it changes
  useEffect(() => {
    fabricCanvasRef.current = canvas;
  }, [canvas]);
  
  // Initialize line state
  const lineState = useLineState({
    fabricCanvasRef,
    lineColor,
    lineThickness,
    saveCurrentState
  });
  
  const {
    isActive,
    inputMethod,
    isPencilMode,
    snapEnabled,
    anglesEnabled,
    measurementData,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    cancelDrawing,
    toggleGridSnapping,
    toggleAngles,
    setInputMethod,
    currentLine,
    isDrawing
  } = lineState;
  
  // Add custom event handlers for the canvas
  const handleMouseDown = useCallback((e: any) => {
    if (!fabricCanvasRef.current || !enabled) return;
    
    // Extract event
    const nativeEvent = e.e as MouseEvent | TouchEvent;
    
    // Detect input method
    if ('pointerType' in nativeEvent) {
      if (nativeEvent.pointerType === 'pen') {
        setInputMethod(InputMethod.PENCIL);
      } else if (nativeEvent.pointerType === 'touch') {
        setInputMethod(InputMethod.TOUCH);
      } else {
        setInputMethod(InputMethod.MOUSE);
      }
    } else if ('touches' in nativeEvent) {
      // For TouchEvent
      const isStylusTouch = detectStylusFromEvent(nativeEvent);
      setInputMethod(isStylusTouch ? InputMethod.PENCIL : InputMethod.TOUCH);
    } else {
      setInputMethod(InputMethod.MOUSE);
    }
    
    // Get pointer coordinates
    const pointer = fabricCanvasRef.current.getPointer(e.e);
    const point: Point = { x: pointer.x, y: pointer.y };
    
    // Start drawing
    handlePointerDown(point);
  }, [fabricCanvasRef, enabled, handlePointerDown, setInputMethod]);
  
  const handleMouseMove = useCallback((e: any) => {
    if (!fabricCanvasRef.current || !enabled || !isDrawing) return;
    
    // Get pointer coordinates
    const pointer = fabricCanvasRef.current.getPointer(e.e);
    const point: Point = { x: pointer.x, y: pointer.y };
    
    // Continue drawing
    handlePointerMove(point);
  }, [fabricCanvasRef, enabled, isDrawing, handlePointerMove]);
  
  const handleMouseUp = useCallback((e: any) => {
    if (!fabricCanvasRef.current || !enabled || !isDrawing) return;
    
    // Get pointer coordinates
    const pointer = fabricCanvasRef.current.getPointer(e.e);
    const point: Point = { x: pointer.x, y: pointer.y };
    
    // End drawing
    handlePointerUp(point);
  }, [fabricCanvasRef, enabled, isDrawing, handlePointerUp]);
  
  // Set up event handlers
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;
    
    // Only attach event handlers if enabled
    if (enabled) {
      canvas.on('mouse:down', handleMouseDown);
      canvas.on('mouse:move', handleMouseMove);
      canvas.on('mouse:up', handleMouseUp);
      
      // Disable browser scrolling while drawing
      canvas.upperCanvasEl.style.touchAction = 'none';
      
      // Set cursor
      canvas.defaultCursor = 'crosshair';
      canvas.hoverCursor = 'crosshair';
      
      // Set up double tap for undo
      let lastTap = 0;
      const doubleTapDelay = 300; // ms
      
      const handleDoubleTap = (e: PointerEvent) => {
        if (e.pointerType === 'pen') {
          const currentTime = new Date().getTime();
          const tapLength = currentTime - lastTap;
          
          if (tapLength < doubleTapDelay && tapLength > 0) {
            // Double tap detected
            if (typeof saveCurrentState === 'function') {
              cancelDrawing();
              console.log('Double tap undo triggered');
            }
          }
          lastTap = currentTime;
        }
      };
      
      canvas.upperCanvasEl.addEventListener('pointerdown', handleDoubleTap);
      
      return () => {
        canvas.off('mouse:down', handleMouseDown);
        canvas.off('mouse:move', handleMouseMove);
        canvas.off('mouse:up', handleMouseUp);
        canvas.upperCanvasEl.removeEventListener('pointerdown', handleDoubleTap);
        
        // Reset cursor
        canvas.defaultCursor = 'default';
        canvas.hoverCursor = 'move';
      };
    }
  }, [fabricCanvasRef, enabled, handleMouseDown, handleMouseMove, handleMouseUp, cancelDrawing, saveCurrentState]);
  
  // When using Apple Pencil, provide smoother experience
  useEffect(() => {
    if (isPencilMode && fabricCanvasRef.current) {
      const canvas = fabricCanvasRef.current;
      
      // For Apple Pencil, use more precise snapping
      canvas.upperCanvasEl.style.touchAction = 'none';
      
      // Prevent iOS gestures
      document.body.style.overscrollBehavior = 'none';
      
      return () => {
        document.body.style.overscrollBehavior = 'auto';
      };
    }
  }, [isPencilMode]);
  
  return {
    ...lineState,
    isEnabled: enabled,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
};

// Re-export InputMethod and useLineState
export { InputMethod, useLineState };
