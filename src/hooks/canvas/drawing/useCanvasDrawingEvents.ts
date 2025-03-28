
/**
 * Custom hook for handling canvas drawing events
 * @module canvas/drawing/useCanvasDrawingEvents
 */
import { useCallback, useRef } from 'react';
import { Canvas as FabricCanvas, Path as FabricPath } from 'fabric';
import { DrawingState, Point } from '@/types';

/**
 * Constants for drawing events
 */
const DRAWING_EVENT_CONSTANTS = {
  /** Timeout for cleanup operations in ms */
  CLEANUP_TIMEOUT: 500,
  
  /** Default tolerance value for path operations */
  DEFAULT_TOLERANCE: 10,
  
  /** Delay for starting drag operations in ms */
  DRAG_START_DELAY: 150
};

/**
 * Props for the drawing events hook
 */
interface UseCanvasDrawingEventsProps {
  /** Reference to the fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Current drawing state */
  drawingState: DrawingState;
  /** Function to update drawing state */
  setDrawingState: React.Dispatch<React.SetStateAction<DrawingState>>;
  /** Current drawing tool */
  tool: string;
  /** Function to process created path */
  processCreatedPath: (path: FabricPath) => void;
}

/**
 * Return type for the drawing events hook
 */
interface UseCanvasDrawingEventsReturn {
  /** Mouse down event handler */
  handleMouseDown: (e: MouseEvent | TouchEvent) => void;
  /** Mouse move event handler */
  handleMouseMove: (e: MouseEvent | TouchEvent) => void;
  /** Mouse up event handler */
  handleMouseUp: (e?: MouseEvent | TouchEvent) => void;
  /** Clean up timeouts and event state */
  cleanupTimeouts: () => void;
}

/**
 * Hook for handling canvas drawing events
 * 
 * @param props - Hook properties
 * @returns Event handlers for drawing operations
 */
export const useCanvasDrawingEvents = ({
  fabricCanvasRef,
  drawingState,
  setDrawingState,
  tool,
  processCreatedPath
}: UseCanvasDrawingEventsProps): UseCanvasDrawingEventsReturn => {
  // Timeout references
  const timeoutsRef = useRef<number[]>([]);
  
  /**
   * Clean up timeouts
   */
  const cleanupTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(timeout => window.clearTimeout(timeout));
    timeoutsRef.current = [];
  }, []);
  
  /**
   * Handle mouse down event
   */
  const handleMouseDown = useCallback((e: MouseEvent | TouchEvent) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Get coordinates based on event type
    let clientX: number, clientY: number;
    
    if ('touches' in e) {
      // Touch event
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    // Convert client coordinates to canvas coordinates
    const canvasElement = canvas.getElement();
    const rect = canvasElement.getBoundingClientRect();
    const x = (clientX - rect.left) / canvas.getZoom();
    const y = (clientY - rect.top) / canvas.getZoom();
    
    // Update drawing state
    setDrawingState(prev => ({
      ...prev,
      isDrawing: true,
      lastX: x,
      lastY: y,
      startX: x,
      startY: y,
      startPoint: { x, y },
      currentPoint: { x, y }
    }));
    
    // Handle different tools
    if (tool === 'draw') {
      // For freehand drawing, let fabric.js handle it
      // The path:created event will be triggered
    } else if (tool === 'straightLine' || tool === 'wall' || tool === 'room') {
      // For straight lines and shapes, we'll handle the drawing manually
      // Start a new path
      const newPath = new FabricPath(`M ${x} ${y}`, {
        stroke: drawingState.color || '#000000',
        strokeWidth: drawingState.width || 2,
        fill: 'transparent',
        selectable: false
      });
      
      canvas.add(newPath);
      
      // Store the path in state
      setDrawingState(prev => ({
        ...prev,
        currentPath: newPath
      }));
    }
  }, [fabricCanvasRef, setDrawingState, tool, drawingState.color, drawingState.width]);
  
  /**
   * Handle mouse move event
   */
  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !drawingState.isDrawing) return;
    
    // Get coordinates based on event type
    let clientX: number, clientY: number;
    
    if ('touches' in e) {
      // Touch event
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    // Convert client coordinates to canvas coordinates
    const canvasElement = canvas.getElement();
    const rect = canvasElement.getBoundingClientRect();
    const x = (clientX - rect.left) / canvas.getZoom();
    const y = (clientY - rect.top) / canvas.getZoom();
    
    // Handle different tools
    if (tool === 'draw') {
      // For freehand drawing, let fabric.js handle it
    } else if (tool === 'straightLine' || tool === 'wall' || tool === 'room') {
      // For straight lines and shapes, update the path
      if (drawingState.currentPath) {
        const path = drawingState.currentPath as FabricPath;
        
        // Update the path data for a straight line
        if (tool === 'straightLine') {
          path.set({
            path: [`M ${drawingState.startX} ${drawingState.startY}`, `L ${x} ${y}`]
          });
        } else if (tool === 'wall') {
          // For walls, we might want to snap to angles
          path.set({
            path: [`M ${drawingState.startX} ${drawingState.startY}`, `L ${x} ${y}`],
            strokeWidth: 4 // Walls are thicker
          });
        } else if (tool === 'room') {
          // For rooms, we might want to create a polygon
          // This is a simplified version - in reality, you'd track multiple points
          path.set({
            path: [
              `M ${drawingState.startX} ${drawingState.startY}`,
              `L ${x} ${drawingState.startY}`,
              `L ${x} ${y}`,
              `L ${drawingState.startX} ${y}`,
              `L ${drawingState.startX} ${drawingState.startY}`
            ],
            fill: 'rgba(200, 200, 255, 0.2)'
          });
        }
        
        canvas.renderAll();
      }
    }
    
    // Update points for distance calculation
    const currentPoint: Point = { x, y };
    const midPoint: Point | null = drawingState.startPoint 
      ? { 
          x: (drawingState.startPoint.x + x) / 2, 
          y: (drawingState.startPoint.y + y) / 2 
        } 
      : null;
    
    // Calculate distance between points
    let distance = null;
    if (drawingState.startPoint) {
      const dx = x - drawingState.startPoint.x;
      const dy = y - drawingState.startPoint.y;
      distance = Math.sqrt(dx * dx + dy * dy);
    }
    
    // Update last position and points
    setDrawingState(prev => ({
      ...prev,
      lastX: x,
      lastY: y,
      currentPoint,
      midPoint,
      distance,
      cursorPosition: { x, y }
    }));
  }, [fabricCanvasRef, drawingState, setDrawingState, tool]);
  
  /**
   * Handle mouse up event
   */
  const handleMouseUp = useCallback((e?: MouseEvent | TouchEvent) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Process the path if we have one
    if (drawingState.currentPath) {
      processCreatedPath(drawingState.currentPath as FabricPath);
    }
    
    // Reset drawing state
    setDrawingState(prev => ({
      ...prev,
      isDrawing: false,
      currentPath: null
    }));
    
    // Schedule cleanup
    const timeoutId = window.setTimeout(() => {
      // Perform any additional cleanup
      if (canvas && tool !== 'draw') {
        canvas.renderAll();
      }
    }, DRAWING_EVENT_CONSTANTS.CLEANUP_TIMEOUT);
    
    timeoutsRef.current.push(timeoutId);
  }, [fabricCanvasRef, drawingState.currentPath, processCreatedPath, setDrawingState, tool]);
  
  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    cleanupTimeouts
  };
};
