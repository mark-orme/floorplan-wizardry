
/**
 * Stylus-aware line drawer component
 * @module components/canvas/StylusAwareLineDrawer
 */
import React, { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useStraightLineTool } from '@/hooks/straightLineTool/useStraightLineTool';
import { DrawingMode } from '@/constants/drawingModes';
import { Point } from '@/types/core/Geometry';
import { toast } from 'sonner';
import { InputMethod } from '@/hooks/straightLineTool/useLineState';

interface StylusAwareLineDrawerProps {
  canvas: FabricCanvas | null;
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
  canvas,
  tool,
  lineColor = '#000000',
  lineThickness = 2,
  saveCurrentState = () => {},
  onLineCreated
}) => {
  // Track initialized state
  const isInitializedRef = useRef(false);
  const [shiftPressed, setShiftPressed] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<{start: Point, end: Point} | null>(null);
  
  // Use our straight line drawing hook
  const {
    isDrawing,
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
    startPointRef,
    currentLineRef,
    currentLine
  } = useStraightLineTool({
    canvas,
    enabled: tool === DrawingMode.STRAIGHT_LINE,
    lineColor,
    lineThickness,
    saveCurrentState
  });
  
  // Update tooltip position when drawing
  useEffect(() => {
    if (isDrawing && startPointRef.current && currentLineRef.current) {
      try {
        // @ts-ignore - calcLinePoints might not be defined on the Line type
        const points = currentLineRef.current.calcLinePoints();
        if (points) {
          const start = { x: points.x1, y: points.y1 };
          const end = { x: points.x2, y: points.y2 };
          setActiveTooltip({ start, end });
        }
      } catch (error) {
        console.error('Error calculating line points:', error);
      }
    } else if (!isDrawing) {
      setActiveTooltip(null);
    }
  }, [isDrawing, currentLineRef, startPointRef]);
  
  // Monitor shift key state for angle constraints
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setShiftPressed(true);
        
        if (isDrawing) {
          toast.info("Angle constraint active", { id: "shift-constraint" });
        }
      }
      
      // Toggle grid snapping with 'g' key
      if (e.key === 'g' || e.key === 'G') {
        toggleGridSnapping();
      }
      
      // Toggle angle snapping with 'a' key
      if (e.key === 'a' || e.key === 'A') {
        toggleAngles();
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setShiftPressed(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isDrawing, toggleGridSnapping, toggleAngles]);
  
  // Process canvas events
  useEffect(() => {
    if (!canvas) return;
    
    // Mark initialized
    isInitializedRef.current = true;
    
    // Set up event handlers for canvas
    const handleCanvasMouseDown = (e: any) => {
      if (!isActive) return;
      
      // Get position from fabric event
      const point = e.pointer;
      handlePointerDown(point);
    };
    
    const handleCanvasMouseMove = (e: any) => {
      if (!isActive || !isDrawing) return;
      
      // Get position from fabric event
      const point = e.pointer;
      handlePointerMove(point);
    };
    
    const handleCanvasMouseUp = (e: any) => {
      if (!isActive || !isDrawing) return;
      
      // Get position from fabric event
      const point = e.pointer;
      handlePointerUp(point);
      
      // Call onLineCreated callback if provided
      if (onLineCreated && currentLine) {
        onLineCreated(currentLine);
      }
    };
    
    // Handle key press for grid snapping toggle and cancellation
    const handleKeyDown = (e: KeyboardEvent) => {
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
    canvas, 
    isActive, 
    isDrawing, 
    handlePointerDown, 
    handlePointerMove, 
    handlePointerUp, 
    cancelDrawing,
    currentLine,
    onLineCreated
  ]);
  
  return (
    <>
      {/* Status indicator for drawing mode */}
      {isActive && (
        <div className="fixed bottom-2 right-2 p-2 bg-black/70 text-white rounded text-xs" style={{ zIndex: 9999 }}>
          {inputMethod === InputMethod.PENCIL || inputMethod === InputMethod.STYLUS ? '✏️ ' : inputMethod === InputMethod.TOUCH ? '👆 ' : '🖱️ '}
          {snapEnabled ? '📏' : ''}
          {anglesEnabled ? '📐' : ''}
          {isPencilMode && '✨'}
          {shiftPressed && '📏📐'}
        </div>
      )}
    </>
  );
};
