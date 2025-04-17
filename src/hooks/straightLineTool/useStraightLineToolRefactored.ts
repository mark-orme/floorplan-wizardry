
/**
 * Refactored straight line tool hook
 * Combines line initialization, interaction, and grid alignment
 * @module hooks/straightLineTool/useStraightLineToolRefactored
 */
import { useCallback, useEffect, useState, useRef } from 'react';
import { Canvas as FabricCanvas, Line } from 'fabric';
import { Point } from '@/types/core/Point';
import { DrawingMode } from '@/constants/drawingModes';
import { useLineInitialization } from './useLineInitialization';
import { useLineInteraction } from './useLineInteraction';
import { useGridAlignment, GridSnappingSettings } from './useGridAlignment';

export interface StraightLineToolOptions {
  color: string;
  thickness: number;
  dashed?: boolean;
  snapToGrid?: boolean;
  gridSettings?: GridSnappingSettings;
}

export interface StraightLineToolRefactoredResult {
  isActive: boolean;
  isDrawing: boolean;
  isToolInitialized: boolean;
  startDrawing: (canvas: FabricCanvas | null, pointer: Point) => void;
  continueDrawing: (canvas: FabricCanvas | null, pointer: Point) => void;
  endDrawing: (canvas: FabricCanvas | null) => void;
  cancelDrawing: (canvas: FabricCanvas | null) => void;
}

/**
 * Refactored hook for straight line tool functionality
 * @param tool Current drawing tool
 * @param options Tool options
 * @returns Straight line tool functions and state
 */
export const useStraightLineToolRefactored = (
  tool: DrawingMode,
  options: StraightLineToolOptions
): StraightLineToolRefactoredResult => {
  const [isToolInitialized, setIsToolInitialized] = useState(false);
  const lineRef = useRef<Line | null>(null);
  
  // Get line initialization functions
  const { isActive, setIsActive, initializeTool, initializeLine, cleanupLine } = useLineInitialization();
  
  // Get line interaction state and functions
  const { 
    isDrawing, 
    startDrawing: startLineDrawing,
    updateLine,
    completeDrawing,
    cancelDrawing: cancelLineDrawing
  } = useLineInteraction();
  
  // Get grid alignment functions
  const { snapToGrid, autoStraighten } = useGridAlignment({
    enabled: options.snapToGrid ?? true,
    gridSize: options.gridSettings?.gridSize ?? 20,
    threshold: options.gridSettings?.threshold ?? 10
  });
  
  // Initialize the tool
  useEffect(() => {
    setIsToolInitialized(tool === DrawingMode.STRAIGHT_LINE);
    setIsActive(tool === DrawingMode.STRAIGHT_LINE);
    
    // Cleanup on unmount
    return () => {
      setIsToolInitialized(false);
    };
  }, [tool, setIsActive]);
  
  /**
   * Start drawing a line
   * @param canvas Fabric canvas
   * @param pointer Starting point
   */
  const startDrawing = useCallback((
    canvas: FabricCanvas | null, 
    pointer: Point
  ): void => {
    if (!canvas || !isActive) return;
    
    // Snap to grid if enabled
    const snappedPoint = snapToGrid(pointer);
    
    // Start drawing state
    startLineDrawing(snappedPoint);
    
    // Initialize line on canvas
    const line = initializeLine(snappedPoint.x, snappedPoint.y, {
      color: options.color,
      thickness: options.thickness,
      dashed: options.dashed
    });
    
    canvas.add(line);
    canvas.renderAll();
    
    lineRef.current = line;
  }, [isActive, options, snapToGrid, startLineDrawing, initializeLine]);
  
  /**
   * Continue drawing a line
   * @param canvas Fabric canvas
   * @param pointer Current point
   */
  const continueDrawing = useCallback((
    canvas: FabricCanvas | null, 
    pointer: Point
  ): void => {
    if (!canvas || !isDrawing || !lineRef.current) return;
    
    // Apply grid snapping and auto-straightening
    const snappedPoint = snapToGrid(pointer);
    
    // Auto-straighten the line if close to horizontal or vertical
    const correctedPoint = lineRef.current && lineRef.current.x1 !== undefined
      ? autoStraighten(
          { x: lineRef.current.x1, y: lineRef.current.y1 },
          snappedPoint
        )
      : snappedPoint;
    
    // Update the line
    updateLine(canvas, lineRef.current, correctedPoint);
  }, [isDrawing, snapToGrid, autoStraighten, updateLine]);
  
  /**
   * End drawing a line
   * @param canvas Fabric canvas
   */
  const endDrawing = useCallback((
    canvas: FabricCanvas | null
  ): void => {
    if (!canvas || !isDrawing || !lineRef.current) return;
    
    // Complete the drawing
    completeDrawing();
    
    // Line is kept on canvas, but we clear our reference
    lineRef.current = null;
  }, [isDrawing, completeDrawing]);
  
  /**
   * Cancel drawing a line
   * @param canvas Fabric canvas
   */
  const cancelDrawing = useCallback((
    canvas: FabricCanvas | null
  ): void => {
    if (!canvas) return;
    
    // Cancel the drawing state
    cancelLineDrawing(canvas, lineRef.current);
    
    // Clean up the line
    if (lineRef.current && canvas.contains(lineRef.current)) {
      canvas.remove(lineRef.current);
      canvas.renderAll();
    }
    
    lineRef.current = null;
  }, [cancelLineDrawing]);
  
  return {
    isActive,
    isDrawing,
    isToolInitialized,
    startDrawing,
    continueDrawing,
    endDrawing,
    cancelDrawing
  };
};
