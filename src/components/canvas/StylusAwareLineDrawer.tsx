
/**
 * Stylus-aware line drawer component
 * @module components/canvas/StylusAwareLineDrawer
 */
import React, { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useStraightLineTool } from '@/hooks/straightLineTool/useStraightLineTool';
import { DrawingMode } from '@/constants/drawingModes';
import { Point } from '@/types/core/Point';
import { TouchGestureHandler } from './TouchGestureHandler';

interface StylusAwareLineDrawerProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  tool: DrawingMode;
  lineColor?: string;
  lineThickness?: number;
  saveCurrentState?: () => void;
  onLineCreated?: (line: any) => void;
}

/**
 * Component to handle line drawing with enhanced stylus and touch support
 */
export const StylusAwareLineDrawer: React.FC<StylusAwareLineDrawerProps> = ({
  fabricCanvasRef,
  tool,
  lineColor = '#000000',
  lineThickness = 2,
  saveCurrentState = () => {},
  onLineCreated
}) => {
  // Track initialized state
  const isInitializedRef = useRef(false);
  
  // Use our enhanced line drawing hook
  const {
    isActive,
    isDrawing,
    inputMethod,
    isPencilMode,
    snapEnabled,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    cancelDrawing,
    toggleGridSnapping
  } = useStraightLineTool({
    fabricCanvasRef,
    tool,
    lineColor,
    lineThickness,
    saveCurrentState
  });
  
  // Process canvas events
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Mark initialized
    isInitializedRef.current = true;
    
    // Set up event handlers for canvas
    const handleCanvasMouseDown = (e: any) => {
      if (!isActive) return;
      
      // Get position from fabric event
      const point: Point = e.pointer;
      handlePointerDown(point);
    };
    
    const handleCanvasMouseMove = (e: any) => {
      if (!isActive || !isDrawing) return;
      
      // Get position from fabric event
      const point: Point = e.pointer;
      handlePointerMove(point);
    };
    
    const handleCanvasMouseUp = (e: any) => {
      if (!isActive || !isDrawing) return;
      
      // Get position from fabric event
      const point: Point = e.pointer;
      handlePointerUp(point);
    };
    
    // Handle key press for grid snapping toggle
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle grid snapping with 'g' key
      if (e.key === 'g') {
        toggleGridSnapping();
      }
      
      // Cancel with escape key
      if (e.key === 'Escape') {
        cancelDrawing();
      }
    };
    
    // Add fabric canvas event listeners
    canvas.on('mouse:down', handleCanvasMouseDown);
    canvas.on('mouse:move', handleCanvasMouseMove);
    canvas.on('mouse:up', handleCanvasMouseUp);
    
    // Add keyboard event listener
    window.addEventListener('keydown', handleKeyDown);
    
    // Clean up
    return () => {
      if (!canvas) return;
      
      canvas.off('mouse:down', handleCanvasMouseDown);
      canvas.off('mouse:move', handleCanvasMouseMove);
      canvas.off('mouse:up', handleCanvasMouseUp);
      
      window.removeEventListener('keydown', handleKeyDown);
      
      // Cancel any active drawing when unmounting
      if (isDrawing) {
        cancelDrawing();
      }
    };
  }, [
    fabricCanvasRef, 
    isActive, 
    isDrawing, 
    handlePointerDown, 
    handlePointerMove, 
    handlePointerUp, 
    cancelDrawing,
    toggleGridSnapping
  ]);
  
  return (
    <>
      {/* Non-visual component for touch gesture handling */}
      <TouchGestureHandler 
        fabricCanvasRef={fabricCanvasRef}
        lineThickness={lineThickness}
      />
      
      {/* Optionally, you could display some UI indicator for touch mode or snap status */}
      {isActive && (
        <div className="fixed bottom-2 right-2 p-2 bg-black/70 text-white rounded text-xs" style={{ zIndex: 9999 }}>
          {inputMethod === 'stylus' ? '✏️ ' : inputMethod === 'touch' ? '👆 ' : '🖱️ '}
          {snapEnabled ? '📏' : ''}
          {isPencilMode && '✨'}
        </div>
      )}
    </>
  );
};
