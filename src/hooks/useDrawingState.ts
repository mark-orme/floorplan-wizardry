
import { useState, useCallback, useRef } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { Point, DrawingState } from "@/types/drawingTypes";
import { DrawingTool } from "./useCanvasState";
import { calculateMidpoint } from "@/utils/geometry";
import { snapToGrid, snapLineToStandardAngles } from "@/utils/grid/snapping";
import { straightenStroke } from "@/utils/geometry/straightening";
import { formatDistance } from "@/utils/geometry/lineOperations";
import { isTouchEvent } from "@/utils/fabric";

interface UseDrawingStateProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  tool: DrawingTool;
}

export const useDrawingState = ({ 
  fabricCanvasRef, 
  tool 
}: UseDrawingStateProps) => {
  // Drawing state
  const [drawingState, setDrawingState] = useState<DrawingState>({
    isDrawing: false,
    startPoint: null,
    currentPoint: null,
    cursorPosition: null,
    midPoint: null,
    selectionActive: false
  });
  
  // Timeouts reference for cleanup
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  
  // Process point with snapping based on current tool
  const processPointWithSnapping = useCallback((point: Point): Point => {
    if (!point) return point;
    
    // Apply grid snapping for wall and room tools
    if (tool === 'wall' || tool === 'room' || tool === 'straightLine') {
      return snapToGrid(point);
    }
    
    return point;
  }, [tool]);
  
  // Handle mouse down event - start drawing
  const handleMouseDown = useCallback((e: MouseEvent | TouchEvent) => {
    if (!fabricCanvasRef.current) return;
    
    // Convert event to appropriate type
    const canvas = fabricCanvasRef.current;
    
    // Get pointer position
    let pointer;
    
    if (isTouchEvent(e)) {
      if (e.touches && e.touches[0]) {
        pointer = canvas.getPointer({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY } as any);
      } else {
        return; // No valid touch data
      }
    } else {
      pointer = canvas.getPointer(e as any);
    }
    
    if (!pointer) return;
    
    // Create point from pointer
    const point = { x: pointer.x, y: pointer.y };
    
    // Apply grid snapping based on current tool
    const snappedPoint = processPointWithSnapping(point);
    
    // Start drawing with snapped point
    setDrawingState(prev => ({
      ...prev,
      isDrawing: true,
      startPoint: snappedPoint,
      currentPoint: snappedPoint,
      cursorPosition: point,
      midPoint: snappedPoint
    }));
    
  }, [fabricCanvasRef, processPointWithSnapping]);
  
  // Handle mouse move event - update current point
  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!fabricCanvasRef.current) return;
    
    // Always update cursor position for hover effects
    const canvas = fabricCanvasRef.current;
    
    // Get pointer position
    let pointer;
    
    if (isTouchEvent(e)) {
      if (e.touches && e.touches[0]) {
        pointer = canvas.getPointer({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY } as any);
      } else {
        return; // No valid touch data
      }
    } else {
      pointer = canvas.getPointer(e as any);
    }
    
    if (!pointer) return;
    
    // Create point from pointer
    const point = { x: pointer.x, y: pointer.y };
    
    // Just update cursor position if not drawing
    if (!drawingState.isDrawing) {
      setDrawingState(prev => ({
        ...prev,
        cursorPosition: point
      }));
      return;
    }
    
    // Only proceed if we're drawing and have a start point
    if (!drawingState.startPoint) return;
    
    // Apply appropriate snapping based on tool
    let processedPoint = point;
    
    if (tool === 'wall' || tool === 'room' || tool === 'straightLine') {
      // Apply angle snapping for walls and rooms
      processedPoint = snapLineToStandardAngles(drawingState.startPoint, point);
    } else {
      // Just apply basic grid snapping for other tools
      processedPoint = processPointWithSnapping(point);
    }
    
    // Calculate midpoint for tooltip
    const midPoint = calculateMidpoint(drawingState.startPoint, processedPoint);
    
    // Update drawing state with processed point
    setDrawingState(prev => ({
      ...prev,
      currentPoint: processedPoint,
      cursorPosition: point, // Keep original cursor position for reference
      midPoint: midPoint
    }));
    
  }, [fabricCanvasRef, drawingState.isDrawing, drawingState.startPoint, processPointWithSnapping, tool]);
  
  // Handle mouse up event - end drawing
  const handleMouseUp = useCallback((e?: MouseEvent | TouchEvent) => {
    if (!fabricCanvasRef.current || !drawingState.isDrawing) return;
    
    // Get final points
    const { startPoint, currentPoint } = drawingState;
    
    // Only process if we have both points
    if (startPoint && currentPoint) {
      // Apply stroke straightening if needed
      const processedPoints = straightenStroke([startPoint, currentPoint]);
      
      // Update with final processed points
      setDrawingState(prev => ({
        ...prev,
        isDrawing: false,
        startPoint: processedPoints[0],
        currentPoint: processedPoints[1]
      }));
      
      // Reset after a short delay
      const resetTimeout = setTimeout(() => {
        setDrawingState(prev => ({
          ...prev,
          startPoint: null,
          currentPoint: null,
          midPoint: null
        }));
      }, 200);
      
      timeoutsRef.current.push(resetTimeout);
    } else {
      // Simple reset if no valid points
      setDrawingState(prev => ({
        ...prev,
        isDrawing: false
      }));
    }
    
  }, [fabricCanvasRef, drawingState]);
  
  // Clean up timeouts on unmount
  const cleanupTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current = [];
  }, []);
  
  return {
    drawingState,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    cleanupTimeouts
  };
};
