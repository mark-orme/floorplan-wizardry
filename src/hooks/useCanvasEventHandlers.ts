
import { useCallback, useEffect } from 'react';
import { Canvas as FabricCanvas, Point as FabricPoint, Line, Text } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { toast } from 'sonner';
import { useSnapToGrid } from '@/hooks/useSnapToGrid';
import type { Point } from '@/types/core/Point';
import { toFabricPoint } from '@/utils/fabricPointConverter';

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
  
  // Variables for tracking straight line drawing
  let isDrawingStraightLine = false;
  let straightLineStartPoint: FabricPoint | null = null;
  let currentStraightLine: Line | null = null;
  let distanceTooltip: Text | null = null;
  
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
      if (tool === DrawingMode.STRAIGHT_LINE && isDrawingStraightLine && currentStraightLine) {
        canvas.remove(currentStraightLine);
        if (distanceTooltip) {
          canvas.remove(distanceTooltip);
          distanceTooltip = null;
        }
        canvas.requestRenderAll();
        isDrawingStraightLine = false;
        straightLineStartPoint = null;
        currentStraightLine = null;
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
    
    // Convert to meters (assuming 100 pixels = 1 meter, adjust as needed)
    const distanceInMeters = (distance / 100).toFixed(1);
    
    // Calculate midpoint for tooltip position
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2 - 10; // Position slightly above the line
    
    // Create or update tooltip
    if (!distanceTooltip) {
      distanceTooltip = new Text(`${distanceInMeters} m`, {
        left: midX,
        top: midY,
        fontSize: 14,
        fill: '#000000',
        backgroundColor: 'rgba(255,255,255,0.7)',
        padding: 2,
        objectType: 'measurement',
        selectable: false,
        originX: 'center',
        originY: 'bottom'
      });
      canvas.add(distanceTooltip);
    } else {
      distanceTooltip.set({
        text: `${distanceInMeters} m`,
        left: midX,
        top: midY
      });
    }
    
    return { distance, distanceInMeters };
  }, []);
  
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
      const pointer = canvas.getPointer(e.e);
      
      // Snap point to grid
      const snappedPoint = snapPointToGrid({ x: pointer.x, y: pointer.y });
      
      isDrawingStraightLine = true;
      // Convert our app Point to FabricPoint
      straightLineStartPoint = new FabricPoint(snappedPoint.x, snappedPoint.y);
      
      // Create a new line
      currentStraightLine = new Line([
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
      
      canvas.add(currentStraightLine);
      canvas.requestRenderAll();
    }
  }, [fabricCanvasRef, tool, lineColor, lineThickness, handleMouseDown, snapPointToGrid]);
  
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
    if (tool === DrawingMode.STRAIGHT_LINE && isDrawingStraightLine && straightLineStartPoint && currentStraightLine) {
      const pointer = canvas.getPointer(e.e);
      
      // Snap point to grid
      const snappedPoint = snapPointToGrid({ x: pointer.x, y: pointer.y });
      
      // Apply additional constraints (like straight horizontal/vertical lines if needed)
      const { start, end } = snapLineToGrid(
        { x: straightLineStartPoint.x, y: straightLineStartPoint.y },
        { x: snappedPoint.x, y: snappedPoint.y }
      );
      
      // Update the end point of the line
      currentStraightLine.set({
        x2: end.x,
        y2: end.y
      });
      
      // Update measurement tooltip
      updateDistanceTooltip(start, end, canvas);
      
      canvas.requestRenderAll();
    }
  }, [fabricCanvasRef, tool, handleMouseMove, snapPointToGrid, snapLineToGrid, updateDistanceTooltip]);
  
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
    if (tool === DrawingMode.STRAIGHT_LINE && isDrawingStraightLine && straightLineStartPoint && currentStraightLine) {
      const pointer = canvas.getPointer(e.e);
      
      // Snap point to grid
      const snappedPoint = snapPointToGrid({ x: pointer.x, y: pointer.y });
      
      // Apply additional constraints
      const { start, end } = snapLineToGrid(
        { x: straightLineStartPoint.x, y: straightLineStartPoint.y },
        { x: snappedPoint.x, y: snappedPoint.y }
      );
      
      // Calculate distance
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Only keep the line if it has a meaningful length
      if (distance > 5) {
        saveCurrentState();
        
        // Convert to meters (assuming 100 pixels = 1 meter, adjust as needed)
        const distanceInMeters = (distance / 100).toFixed(1);
        
        // Update the line properties for final rendering
        currentStraightLine.set({
          x2: end.x,
          y2: end.y,
          selectable: true,
          evented: true,
          measurement: `${distanceInMeters} m`
        });
        
        // Finalize the tooltip
        if (distanceTooltip) {
          distanceTooltip.set({
            selectable: false,
            evented: true,
            objectType: 'measurement'
          });
        } else {
          // Create a new measurement label if it doesn't exist
          const midX = (start.x + end.x) / 2;
          const midY = (start.y + end.y) / 2 - 10;
          
          const measurementText = new Text(`${distanceInMeters} m`, {
            left: midX,
            top: midY,
            fontSize: 14,
            fill: '#000000',
            backgroundColor: 'rgba(255,255,255,0.7)',
            padding: 2,
            objectType: 'measurement',
            selectable: false,
            originX: 'center',
            originY: 'bottom'
          });
          
          canvas.add(measurementText);
        }
        
        toast.success(`Line drawn: ${distanceInMeters} m`);
      } else {
        // Line too short, remove it
        canvas.remove(currentStraightLine);
        if (distanceTooltip) {
          canvas.remove(distanceTooltip);
        }
      }
      
      canvas.requestRenderAll();
    }
    
    // Reset straight line drawing state
    isDrawingStraightLine = false;
    straightLineStartPoint = null;
    currentStraightLine = null;
    distanceTooltip = null;
  }, [fabricCanvasRef, tool, saveCurrentState, handleMouseUp, snapPointToGrid, snapLineToGrid]);
  
  // Set up event listeners when component mounts
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    
    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    canvas.on('mouse:down', onCanvasMouseDown);
    canvas.on('mouse:move', onCanvasMouseMove);
    canvas.on('mouse:up', onCanvasMouseUp);
    
    // Determine cursor based on the tool
    if (tool === DrawingMode.STRAIGHT_LINE) {
      canvas.defaultCursor = 'crosshair';
      canvas.hoverCursor = 'crosshair';
    }
    
    // Clean up function
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (canvas) {
        canvas.off('mouse:down', onCanvasMouseDown);
        canvas.off('mouse:move', onCanvasMouseMove);
        canvas.off('mouse:up', onCanvasMouseUp);
      }
      
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
};
