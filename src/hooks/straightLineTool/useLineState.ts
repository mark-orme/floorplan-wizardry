/**
 * Hook for managing line drawing state
 * @module hooks/straightLineTool/useLineState
 */
import { useCallback, useRef, useState } from 'react';
import { Canvas as FabricCanvas, Line } from 'fabric';
import { Point } from '@/types/core/Point';
import { useApplePencilSupport } from './useApplePencilSupport';
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import { toast } from 'sonner';

// Input method for drawing
export type InputMethod = 'mouse' | 'touch' | 'stylus' | 'keyboard';

interface UseLineStateProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  lineThickness: number;
  lineColor: string;
}

export const useLineState = ({
  fabricCanvasRef,
  lineThickness,
  lineColor
}: UseLineStateProps) => {
  // State for drawing
  const [isDrawing, setIsDrawing] = useState(false);
  const [isToolInitialized, setIsToolInitialized] = useState(false);
  const [inputMethod, setInputMethod] = useState<InputMethod>('mouse');
  const [snapEnabled, setSnapEnabled] = useState(true);
  
  // Refs for current drawing objects
  const startPointRef = useRef<Point | null>(null);
  const currentLineRef = useRef<Line | null>(null);
  const distanceTooltipRef = useRef<HTMLDivElement | null>(null);
  
  // Use Apple Pencil support
  const { 
    isPencilMode, 
    isApplePencil, 
    snapPencilPointToGrid 
  } = useApplePencilSupport({
    fabricCanvasRef,
    lineThickness
  });
  
  // Function to set start point
  const setStartPoint = useCallback((point: Point | null) => {
    startPointRef.current = point;
  }, []);
  
  // Function to set current line
  const setCurrentLine = useCallback((line: Line | null) => {
    currentLineRef.current = line;
  }, []);
  
  // Function to set distance tooltip
  const setDistanceTooltip = useCallback((tooltip: HTMLDivElement | null) => {
    distanceTooltipRef.current = tooltip;
  }, []);
  
  // Function to initialize the tool
  const initializeTool = useCallback(() => {
    setIsToolInitialized(true);
    console.log('Line tool initialized');
    
    // Check for touch/stylus support
    if (navigator.maxTouchPoints > 0) {
      setInputMethod('touch');
      console.log('Touch input detected, optimizing for touch');
    }
    
    toast.info(snapEnabled ? 'Grid snapping enabled (press G to toggle)' : 'Grid snapping disabled (press G to toggle)', {
      id: 'grid-snap-status',
      duration: 3000
    });
  }, [snapEnabled]);
  
  // Function to reset drawing state
  const resetDrawingState = useCallback(() => {
    // Keep start point for reference
    currentLineRef.current = null;
    
    // Clean up tooltip if exists
    if (distanceTooltipRef.current) {
      const parent = distanceTooltipRef.current.parentElement;
      if (parent) {
        parent.removeChild(distanceTooltipRef.current);
      }
      distanceTooltipRef.current = null;
    }
  }, []);
  
  // Toggle snap to grid
  const toggleSnap = useCallback(() => {
    setSnapEnabled(prev => !prev);
    
    // Show feedback to user
    toast.info(!snapEnabled ? 'Grid snapping enabled' : 'Grid snapping disabled', {
      id: 'grid-snap-toggle'
    });
  }, [snapEnabled]);
  
  // Function to snap point to grid
  const snapPointToGrid = useCallback((point: Point): Point => {
    if (!snapEnabled) return { ...point };
    
    // For Apple Pencil, use specialized snap function
    if (isPencilMode) {
      return snapPencilPointToGrid(point);
    }
    
    // Regular grid snap
    const gridSize = GRID_CONSTANTS.GRID_SIZE;
    
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    };
  }, [snapEnabled, isPencilMode, snapPencilPointToGrid]);
  
  // Function to snap line to grid
  const snapLineToGrid = useCallback((start: Point, end: Point) => {
    if (!snapEnabled) return { start: { ...start }, end: { ...end } };
    
    return {
      start: snapPointToGrid(start),
      end: snapPointToGrid(end)
    };
  }, [snapEnabled, snapPointToGrid]);
  
  return {
    // State
    isDrawing,
    isToolInitialized,
    snapEnabled,
    inputMethod,
    isPencilMode,
    
    // Setters
    setIsDrawing,
    setStartPoint,
    setCurrentLine,
    setDistanceTooltip,
    
    // Refs
    startPointRef,
    currentLineRef,
    distanceTooltipRef,
    
    // Methods
    initializeTool,
    resetDrawingState,
    snapPointToGrid,
    snapLineToGrid,
    toggleSnap
  };
};
