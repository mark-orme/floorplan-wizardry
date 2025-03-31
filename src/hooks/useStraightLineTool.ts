
import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, Line, Point as FabricPoint, Text } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { toast } from 'sonner';
import { useSnapToGrid } from './useSnapToGrid';
import logger from '@/utils/logger';

// Define a proper type for Fabric.js events
interface FabricPointerEvent {
  e: MouseEvent | TouchEvent;
  pointer?: { x: number; y: number };
  target?: any;
}

interface UseStraightLineToolProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  tool: DrawingMode;
  lineColor: string;
  lineThickness: number;
  saveCurrentState: () => void;
}

export const useStraightLineTool = ({
  fabricCanvasRef,
  tool,
  lineColor,
  lineThickness,
  saveCurrentState
}: UseStraightLineToolProps) => {
  // State for tracking drawing
  const [isDrawing, setIsDrawing] = useState(false);
  const [isToolInitialized, setIsToolInitialized] = useState(false);
  const startPointRef = useRef<FabricPoint | null>(null);
  const currentLineRef = useRef<Line | null>(null);
  const distanceTooltipRef = useRef<Text | null>(null);
  
  // Get the snap to grid functionality
  const { snapPointToGrid, snapLineToGrid } = useSnapToGrid();
  
  // Clean up any existing event handlers when unmounting or tool changes
  const cleanupEventHandlers = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Remove our specific event handlers
    canvas.off('mouse:down', handleMouseDown);
    canvas.off('mouse:move', handleMouseMove);
    canvas.off('mouse:up', handleMouseUp);
    
    logger.info("Straight line event handlers removed");
  }, [fabricCanvasRef]);
  
  // Handle mouse down to start drawing
  const handleMouseDown = useCallback((event: FabricPointerEvent) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || tool !== DrawingMode.STRAIGHT_LINE) return;
    
    // Get the pointer coordinates from the event
    const pointer = canvas.getPointer(event.e);
    logger.info("Mouse down in straight line tool", { x: pointer.x, y: pointer.y });
    
    // Snap to grid
    const snappedPoint = snapPointToGrid({
      x: pointer.x,
      y: pointer.y
    });
    
    // Store starting point and set drawing state
    startPointRef.current = new FabricPoint(snappedPoint.x, snappedPoint.y);
    setIsDrawing(true);
    
    // Create initial line
    const line = new Line(
      [snappedPoint.x, snappedPoint.y, snappedPoint.x, snappedPoint.y],
      {
        stroke: lineColor,
        strokeWidth: lineThickness,
        selectable: false,
        evented: false,
        objectType: 'straight-line'
      }
    );
    
    // Add to canvas and store reference
    canvas.add(line);
    currentLineRef.current = line;
    canvas.requestRenderAll();
    
    // Prevent event propagation
    if (event.e.stopPropagation) event.e.stopPropagation();
  }, [fabricCanvasRef, tool, lineColor, lineThickness, snapPointToGrid]);
  
  // Handle mouse move to update line
  const handleMouseMove = useCallback((event: FabricPointerEvent) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isDrawing || tool !== DrawingMode.STRAIGHT_LINE || !startPointRef.current || !currentLineRef.current) return;
    
    // Get pointer coordinates
    const pointer = canvas.getPointer(event.e);
    
    // Snap end point to grid
    const snappedPoint = snapPointToGrid({
      x: pointer.x,
      y: pointer.y
    });
    
    // Apply additional constraints (like straight horizontal/vertical lines)
    const { start, end } = snapLineToGrid(
      { x: startPointRef.current.x, y: startPointRef.current.y },
      { x: snappedPoint.x, y: snappedPoint.y }
    );
    
    // Update the line
    currentLineRef.current.set({
      x2: end.x,
      y2: end.y
    });
    
    // Calculate distance for tooltip
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const distanceInMeters = (distance / 100).toFixed(1); // 100px = 1m
    
    // Position for tooltip (midpoint of line)
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2 - 10; // Position slightly above the line
    
    // Create or update tooltip
    if (!distanceTooltipRef.current) {
      distanceTooltipRef.current = new Text(`${distanceInMeters}m`, {
        left: midX,
        top: midY,
        fontSize: 12,
        fill: '#000000',
        backgroundColor: 'rgba(255,255,255,0.7)',
        padding: 2,
        objectType: 'measurement',
        selectable: false,
        originX: 'center',
        originY: 'bottom'
      });
      canvas.add(distanceTooltipRef.current);
    } else {
      distanceTooltipRef.current.set({
        text: `${distanceInMeters}m`,
        left: midX,
        top: midY
      });
    }
    
    canvas.requestRenderAll();
  }, [fabricCanvasRef, isDrawing, tool, snapPointToGrid, snapLineToGrid]);
  
  // Handle mouse up to complete line drawing
  const handleMouseUp = useCallback((event: FabricPointerEvent) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isDrawing || tool !== DrawingMode.STRAIGHT_LINE || !startPointRef.current || !currentLineRef.current) return;
    
    // Get pointer coordinates
    const pointer = canvas.getPointer(event.e);
    
    // Snap end point to grid
    const snappedPoint = snapPointToGrid({
      x: pointer.x,
      y: pointer.y
    });
    
    // Apply additional constraints
    const { start, end } = snapLineToGrid(
      { x: startPointRef.current.x, y: startPointRef.current.y },
      { x: snappedPoint.x, y: snappedPoint.y }
    );
    
    // Calculate distance
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Only keep the line if it has a meaningful length
    if (distance > 5) {
      // Save current state for undo
      saveCurrentState();
      
      // Convert to meters (assuming 100 pixels = 1 meter)
      const distanceInMeters = (distance / 100).toFixed(1);
      
      // Update line properties
      currentLineRef.current.set({
        x2: end.x,
        y2: end.y,
        selectable: true,
        evented: true,
        objectType: 'straight-line',
        measurement: `${distanceInMeters}m`
      });
      
      // Keep tooltip
      if (distanceTooltipRef.current) {
        distanceTooltipRef.current.set({
          selectable: false,
          evented: true,
          objectType: 'measurement'
        });
      }
      
      toast.success(`Line created: ${distanceInMeters}m`);
    } else {
      // Line too short, remove it
      canvas.remove(currentLineRef.current);
      if (distanceTooltipRef.current) {
        canvas.remove(distanceTooltipRef.current);
      }
    }
    
    // Reset state
    setIsDrawing(false);
    startPointRef.current = null;
    currentLineRef.current = null;
    distanceTooltipRef.current = null;
    
    canvas.requestRenderAll();
  }, [fabricCanvasRef, isDrawing, tool, saveCurrentState, snapPointToGrid, snapLineToGrid]);
  
  // Cancel drawing (e.g., when pressing escape)
  const cancelDrawing = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isDrawing) return;
    
    // Remove the line being drawn
    if (currentLineRef.current) {
      canvas.remove(currentLineRef.current);
    }
    
    // Remove the tooltip
    if (distanceTooltipRef.current) {
      canvas.remove(distanceTooltipRef.current);
    }
    
    // Reset state
    setIsDrawing(false);
    startPointRef.current = null;
    currentLineRef.current = null;
    distanceTooltipRef.current = null;
    
    canvas.requestRenderAll();
    logger.info("Line drawing cancelled");
  }, [fabricCanvasRef, isDrawing]);
  
  // Initialize and clean up event handlers when tool changes
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    if (tool === DrawingMode.STRAIGHT_LINE) {
      // Configure canvas for straight line drawing
      canvas.isDrawingMode = false;
      canvas.selection = false;
      canvas.defaultCursor = 'crosshair';
      canvas.hoverCursor = 'crosshair';
      
      // Make objects non-selectable
      canvas.getObjects().forEach(obj => {
        if ((obj as any).objectType !== 'grid') {
          obj.selectable = false;
        }
      });
      
      // Add our specific event handlers
      canvas.on('mouse:down', handleMouseDown);
      canvas.on('mouse:move', handleMouseMove);
      canvas.on('mouse:up', handleMouseUp);
      
      setIsToolInitialized(true);
      logger.info("Straight line tool initialized with event handlers", {
        isDrawingMode: canvas.isDrawingMode,
        selection: canvas.selection,
        cursor: canvas.defaultCursor
      });
    } else {
      // Remove event handlers when switching to a different tool
      cleanupEventHandlers();
      setIsToolInitialized(false);
    }
    
    // Clean up on unmount
    return () => {
      cleanupEventHandlers();
    };
  }, [fabricCanvasRef, tool, handleMouseDown, handleMouseMove, handleMouseUp, cleanupEventHandlers]);
  
  // Handle keyboard events - Escape to cancel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && tool === DrawingMode.STRAIGHT_LINE && isDrawing) {
        cancelDrawing();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [tool, isDrawing, cancelDrawing]);
  
  return {
    isDrawing,
    cancelDrawing,
    isToolInitialized
  };
};
