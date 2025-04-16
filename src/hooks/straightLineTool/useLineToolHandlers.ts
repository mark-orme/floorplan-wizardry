
/**
 * Line tool handlers
 * @module hooks/straightLineTool/useLineToolHandlers
 */
import { useCallback, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useLineState } from './useLineState';

/**
 * Props for the useLineToolHandlers hook
 */
interface UseLineToolHandlersProps {
  canvas: FabricCanvas | null;
  lineState: ReturnType<typeof useLineState>;
  onComplete?: () => void;
}

/**
 * Hook for line tool event handlers
 */
export const useLineToolHandlers = ({
  canvas,
  lineState,
  onComplete
}: UseLineToolHandlersProps) => {
  // Destructure all required properties from lineState
  const {
    isDrawing,
    inputMethod,
    snapEnabled,
    anglesEnabled,
    startPointRef,
    currentLineRef,
    distanceTooltipRef,
    resetDrawingState,
    toggleSnap,
    toggleAngles,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    cancelDrawing
  } = lineState;
  
  /**
   * Handle canvas clicks
   */
  const handleCanvasClick = useCallback((e: any) => {
    if (!canvas) return;
    
    // Get pointer coordinates
    const pointer = canvas.getPointer(e.e);
    const point = { x: pointer.x, y: pointer.y };
    
    // Handle pointer down
    handlePointerDown(point);
  }, [canvas, handlePointerDown]);
  
  /**
   * Handle mouse move on canvas
   */
  const handleCanvasMouseMove = useCallback((e: any) => {
    if (!canvas || !isDrawing) return;
    
    // Get pointer coordinates
    const pointer = canvas.getPointer(e.e);
    const point = { x: pointer.x, y: pointer.y };
    
    // Handle pointer move
    handlePointerMove(point);
  }, [canvas, isDrawing, handlePointerMove]);
  
  /**
   * Handle mouse up on canvas
   */
  const handleCanvasMouseUp = useCallback(() => {
    if (!canvas || !isDrawing) return;
    
    // Handle pointer up - we don't need coordinates for this
    handlePointerUp({ x: 0, y: 0 });
    
    // Call completion callback
    if (onComplete) {
      onComplete();
    }
  }, [canvas, isDrawing, handlePointerUp, onComplete]);
  
  /**
   * Handle keyboard shortcuts
   */
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      // Cancel drawing on Escape
      cancelDrawing();
    } else if (e.key === 'g' || e.key === 'G') {
      // Toggle grid snap on G
      toggleSnap();
    } else if (e.key === 'a' || e.key === 'A') {
      // Toggle angle snap on A
      toggleAngles();
    }
  }, [cancelDrawing, toggleSnap, toggleAngles]);
  
  // Set up event listeners
  useEffect(() => {
    if (!canvas) return;
    
    // Add event listeners
    canvas.on('mouse:down', handleCanvasClick);
    canvas.on('mouse:move', handleCanvasMouseMove);
    canvas.on('mouse:up', handleCanvasMouseUp);
    window.addEventListener('keydown', handleKeyDown);
    
    // Disable selection while drawing
    const originalSelectionState = canvas.selection;
    canvas.selection = false;
    
    // Clean up event listeners
    return () => {
      // Remove event listeners
      canvas.off('mouse:down', handleCanvasClick);
      canvas.off('mouse:move', handleCanvasMouseMove);
      canvas.off('mouse:up', handleCanvasMouseUp);
      window.removeEventListener('keydown', handleKeyDown);
      
      // Restore selection state
      canvas.selection = originalSelectionState;
      
      // Clean up any in-progress drawing
      if (isDrawing) {
        cancelDrawing();
      }
    };
  }, [canvas, handleCanvasClick, handleCanvasMouseMove, handleCanvasMouseUp, handleKeyDown, isDrawing, cancelDrawing]);
  
  return {
    toggleSnap,
    toggleAngles,
    handleKeyDown,
    inputMethod,
    snapEnabled,
    anglesEnabled
  };
};
