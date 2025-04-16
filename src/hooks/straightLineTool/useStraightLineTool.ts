
/**
 * Hook for straight line drawing tools
 * @module hooks/straightLineTool/useStraightLineTool
 */
import { useCallback, useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { Point } from '@/types/core/Point';
import { useLineState, InputMethod } from './useLineState';
import { detectStylusFromEvent } from '@/types/input/InputMethod';
import logger from '@/utils/logger';

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
  
  useEffect(() => {
    if (enabled) {
      logger.info("Straight line tool activated in hook");
    }
  }, [enabled]);
  
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
    isDrawing,
    initializeTool
  } = lineState;

  // Initialize tool when enabled changes
  useEffect(() => {
    if (enabled && !isActive && fabricCanvasRef.current) {
      initializeTool();
      logger.info("Straight line tool initialized", { 
        tool: enabled ? 'straight_line' : 'disabled',
        lineColor,
        lineThickness
      });
    }
  }, [enabled, isActive, initializeTool, lineColor, lineThickness]);
  
  // Add custom event handlers for the canvas
  const handleMouseDown = useCallback((e: any) => {
    if (!fabricCanvasRef.current || !enabled) return;
    
    logger.info("Mouse down on canvas", e);
    
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
    
    logger.info("Pointer down in useStraightLineTool", point);
    
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
    
    logger.info("Mouse up on canvas", e);
    
    // Get pointer coordinates
    const pointer = fabricCanvasRef.current.getPointer(e.e);
    const point: Point = { x: pointer.x, y: pointer.y };
    
    logger.info("Pointer up in useStraightLineTool", point);
    
    // End drawing
    handlePointerUp(point);
  }, [fabricCanvasRef, enabled, isDrawing, handlePointerUp]);
  
  // Set up event handlers
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;
    
    // Only attach event handlers if enabled
    if (enabled) {
      // First, remove any existing handlers to prevent duplicates
      canvas.off('mouse:down');
      canvas.off('mouse:move');
      canvas.off('mouse:up');
      
      // Then attach our handlers
      canvas.on('mouse:down', handleMouseDown);
      canvas.on('mouse:move', handleMouseMove);
      canvas.on('mouse:up', handleMouseUp);
      
      logger.info("Attaching straight line event handlers to canvas", { 
        isActive,
        isToolInitialized: lineState.isToolInitialized
      });
      
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
              logger.info('Double tap undo triggered');
            }
          }
          lastTap = currentTime;
        }
      };
      
      canvas.upperCanvasEl.addEventListener('pointerdown', handleDoubleTap);
      
      return () => {
        logger.info("Removing straight line event handlers from canvas");
        canvas.off('mouse:down', handleMouseDown);
        canvas.off('mouse:move', handleMouseMove);
        canvas.off('mouse:up', handleMouseUp);
        canvas.upperCanvasEl.removeEventListener('pointerdown', handleDoubleTap);
        
        // Reset cursor
        canvas.defaultCursor = 'default';
        canvas.hoverCursor = 'move';
      };
    }
  }, [fabricCanvasRef, enabled, handleMouseDown, handleMouseMove, handleMouseUp, cancelDrawing, saveCurrentState, isActive, lineState.isToolInitialized]);
  
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
  
  // Let's add a log for created lines
  useEffect(() => {
    if (currentLine) {
      logger.info('Line created:', currentLine);
    }
  }, [currentLine]);
  
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
