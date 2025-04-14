
import { useCallback, useEffect, useRef } from 'react';
import { Canvas as FabricCanvas, Point as FabricPoint, Line, Text } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { toast } from 'sonner';
import { useSnapToGrid } from '@/hooks/useSnapToGrid';
import type { Point } from '@/types/core/Point';
import { toFabricPoint } from '@/utils/fabricPointConverter';
import { GRID_CONSTANTS } from '@/constants/gridConstants';

interface UseCanvasEventHandlersProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  tool: DrawingMode;
  lineColor: string;
  lineThickness: number;
  saveCurrentState: () => void;
  handleUndo: () => void;
  handleRedo: () => void;
  deleteSelectedObjects?: () => void;
  updateZoomLevel?: () => void;
  processCreatedPath?: (path: any) => void;
  handleMouseDown?: (e: MouseEvent | TouchEvent) => void;
  handleMouseMove?: (e: MouseEvent | TouchEvent) => void;
  handleMouseUp?: (e: MouseEvent | TouchEvent) => void;
  cleanupTimeouts?: () => void;
}

export const useCanvasEventHandlers = ({
  fabricCanvasRef,
  tool,
  lineColor,
  lineThickness,
  saveCurrentState,
  handleUndo,
  handleRedo,
  deleteSelectedObjects,
  updateZoomLevel,
  processCreatedPath,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  cleanupTimeouts
}: UseCanvasEventHandlersProps) => {
  // Get snapping functionality
  const { snapPointToGrid, snapLineToGrid } = useSnapToGrid();
  
  // Use refs to track drawing state across events
  const isDrawingRef = useRef(false);
  const startPointRef = useRef<FabricPoint | null>(null);
  const currentLineRef = useRef<Line | null>(null);
  const distanceTooltipRef = useRef<Text | null>(null);
  
  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!fabricCanvasRef.current) return;
    
    // Undo: Ctrl/Cmd + Z
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      handleUndo();
    }
    
    // Redo: Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y
    if ((e.ctrlKey || e.metaKey) && ((e.key === 'z' && e.shiftKey) || e.key === 'y')) {
      e.preventDefault();
      handleRedo();
    }
    
    // Delete: Delete or Backspace key
    if ((e.key === 'Delete' || e.key === 'Backspace') && deleteSelectedObjects) {
      const canvas = fabricCanvasRef.current;
      const activeObjects = canvas.getActiveObjects();
      
      if (activeObjects.length > 0) {
        e.preventDefault();
        deleteSelectedObjects();
      }
    }
    
    // Escape: Cancel current operation
    if (e.key === 'Escape') {
      const canvas = fabricCanvasRef.current;
      
      // Cancel straight line drawing if active
      if (tool === DrawingMode.STRAIGHT_LINE && isDrawingRef.current && currentLineRef.current) {
        canvas.remove(currentLineRef.current);
        if (distanceTooltipRef.current) {
          canvas.remove(distanceTooltipRef.current);
          distanceTooltipRef.current = null;
        }
        canvas.requestRenderAll();
        isDrawingRef.current = false;
        startPointRef.current = null;
        currentLineRef.current = null;
      }
      
      // Clear selection
      canvas.discardActiveObject();
      canvas.requestRenderAll();
    }
  }, [fabricCanvasRef, tool, handleUndo, handleRedo, deleteSelectedObjects]);
  
  // Create or update distance tooltip
  const updateDistanceTooltip = useCallback((start: Point, end: Point, canvas: FabricCanvas) => {
    // Calculate distance
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Convert to meters (using the grid constant)
    const distanceInMeters = (distance / GRID_CONSTANTS.PIXELS_PER_METER).toFixed(2);
    
    // Calculate midpoint for tooltip position
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2 - 15; // Position above the line
    
    // Create or update tooltip
    if (!distanceTooltipRef.current) {
      distanceTooltipRef.current = new Text(`${distanceInMeters} m`, {
        left: midX,
        top: midY,
        fontSize: 14,
        fill: lineColor,
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
        text: `${distanceInMeters} m`,
        left: midX,
        top: midY,
        fill: lineColor
      });
    }
    
    return { distance, distanceInMeters };
  }, [lineColor]);
  
  // Handle canvas mouse down
  const onCanvasMouseDown = useCallback((e: any) => {
    if (!fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;
    
    // Call the external handler if provided
    if (handleMouseDown) {
      const nativeEvent = e.e as MouseEvent | TouchEvent;
      handleMouseDown(nativeEvent);
    }
    
    // Handle straight line tool
    if (tool === DrawingMode.STRAIGHT_LINE) {
      // Save current state before starting new drawing
      saveCurrentState();
      
      const pointer = canvas.getPointer(e.e);
      
      // Snap point to grid
      const snappedPoint = snapPointToGrid({ x: pointer.x, y: pointer.y });
      
      isDrawingRef.current = true;
      startPointRef.current = new FabricPoint(snappedPoint.x, snappedPoint.y);
      
      // Create a new line
      currentLineRef.current = new Line([
        snappedPoint.x, 
        snappedPoint.y, 
        snappedPoint.x, 
        snappedPoint.y
      ], {
        stroke: lineColor,
        strokeWidth: lineThickness,
        selectable: false,
        evented: false,
        objectType: 'straight-line'
      });
      
      canvas.add(currentLineRef.current);
      
      // Create initial tooltip
      updateDistanceTooltip(snappedPoint, snappedPoint, canvas);
      
      canvas.requestRenderAll();
    }
  }, [fabricCanvasRef, tool, lineColor, lineThickness, snapPointToGrid, updateDistanceTooltip, saveCurrentState, handleMouseDown]);
  
  // Handle canvas mouse move
  const onCanvasMouseMove = useCallback((e: any) => {
    if (!fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;
    
    // Call the external handler if provided
    if (handleMouseMove) {
      const nativeEvent = e.e as MouseEvent | TouchEvent;
      handleMouseMove(nativeEvent);
    }
    
    // Update straight line during drawing
    if (tool === DrawingMode.STRAIGHT_LINE && isDrawingRef.current && startPointRef.current && currentLineRef.current) {
      const pointer = canvas.getPointer(e.e);
      
      // Snap point to grid
      const snappedPoint = snapPointToGrid({ x: pointer.x, y: pointer.y });
      
      // Apply additional constraints (like straight horizontal/vertical lines if needed)
      const startPoint = { x: startPointRef.current.x, y: startPointRef.current.y };
      const { start, end } = snapLineToGrid(startPoint, snappedPoint);
      
      // Update the end point of the line
      currentLineRef.current.set({
        x2: end.x,
        y2: end.y
      });
      
      // Update measurement tooltip
      updateDistanceTooltip(start, end, canvas);
      
      canvas.requestRenderAll();
    }
  }, [fabricCanvasRef, tool, snapPointToGrid, snapLineToGrid, updateDistanceTooltip, handleMouseMove]);
  
  // Handle canvas mouse up
  const onCanvasMouseUp = useCallback((e: any) => {
    if (!fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;
    
    // Call the external handler if provided
    if (handleMouseUp) {
      const nativeEvent = e.e as MouseEvent | TouchEvent;
      handleMouseUp(nativeEvent);
    }
    
    // Complete straight line drawing
    if (tool === DrawingMode.STRAIGHT_LINE && isDrawingRef.current && startPointRef.current && currentLineRef.current) {
      const pointer = canvas.getPointer(e.e);
      
      // Snap point to grid
      const snappedPoint = snapPointToGrid({ x: pointer.x, y: pointer.y });
      
      // Apply additional constraints
      const startPoint = { x: startPointRef.current.x, y: startPointRef.current.y };
      const { start, end } = snapLineToGrid(startPoint, snappedPoint);
      
      // Calculate distance
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Only keep the line if it has a meaningful length
      if (distance > 5) {
        // Convert to meters
        const distanceInMeters = (distance / GRID_CONSTANTS.PIXELS_PER_METER).toFixed(2);
        
        // Update the line properties for final rendering
        currentLineRef.current.set({
          x2: end.x,
          y2: end.y,
          selectable: true,
          evented: true,
          measurement: `${distanceInMeters} m`
        });
        
        // Finalize the tooltip
        if (distanceTooltipRef.current) {
          distanceTooltipRef.current.set({
            selectable: false,
            evented: true,
            objectType: 'measurement',
            backgroundColor: 'rgba(255,255,255,0.9)',
          });
        }
        
        toast.success(`Line drawn: ${distanceInMeters} m`);
      } else {
        // Line too short, remove it
        canvas.remove(currentLineRef.current);
        if (distanceTooltipRef.current) {
          canvas.remove(distanceTooltipRef.current);
        }
      }
      
      // Reset state
      isDrawingRef.current = false;
      startPointRef.current = null;
      currentLineRef.current = null;
      distanceTooltipRef.current = null;
      
      canvas.requestRenderAll();
    }
  }, [fabricCanvasRef, tool, snapPointToGrid, snapLineToGrid, updateDistanceTooltip, handleMouseUp]);
  
  // Set up event listeners when component mounts or tool changes
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    
    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    canvas.on('mouse:down', onCanvasMouseDown);
    canvas.on('mouse:move', onCanvasMouseMove);
    canvas.on('mouse:up', onCanvasMouseUp);
    
    // Determine cursor based on the tool
    if (tool === DrawingMode.STRAIGHT_LINE || tool === DrawingMode.WALL) {
      canvas.defaultCursor = 'crosshair';
      canvas.hoverCursor = 'crosshair';
    } else if (tool === DrawingMode.SELECT) {
      canvas.defaultCursor = 'default';
      canvas.hoverCursor = 'move';
    } else if (tool === DrawingMode.ERASER) {
      canvas.defaultCursor = 'not-allowed';
      canvas.hoverCursor = 'not-allowed';
    } else {
      canvas.defaultCursor = 'default';
      canvas.hoverCursor = 'default';
    }
    
    // Clean up function
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (canvas) {
        canvas.off('mouse:down', onCanvasMouseDown);
        canvas.off('mouse:move', onCanvasMouseMove);
        canvas.off('mouse:up', onCanvasMouseUp);
      }
      
      // Clean up any other resources
      if (cleanupTimeouts) {
        cleanupTimeouts();
      }
    };
  }, [
    fabricCanvasRef, 
    tool, 
    handleKeyDown, 
    onCanvasMouseDown, 
    onCanvasMouseMove, 
    onCanvasMouseUp, 
    cleanupTimeouts
  ]);

  return {
    isDrawing: isDrawingRef.current,
    currentLine: currentLineRef.current,
    startPoint: startPointRef.current,
    handleKeyDown
  };
};
