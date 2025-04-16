
/**
 * Hook for managing line state in drawing tools
 * @module hooks/straightLineTool/useLineState
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, Line } from 'fabric';
import { Point } from '@/types/core/Point';
import { InputMethod } from '@/types/input/InputMethod';
import { toast } from 'sonner';

export type LinePoint = Point | null;

interface LineOptions {
  color: string;
  thickness: number;
  snap?: boolean;
  detectAngles?: boolean;
}

interface MeasurementData {
  distance: number | null;
  angle: number | null;
  snapped: boolean;
}

interface UseLineStateProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  lineColor: string;
  lineThickness: number;
  saveCurrentState: () => void;
}

/**
 * Hook that manages line drawing state
 */
export const useLineState = ({
  fabricCanvasRef,
  lineColor,
  lineThickness,
  saveCurrentState
}: UseLineStateProps) => {
  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [isToolInitialized, setIsToolInitialized] = useState(false);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [anglesEnabled, setAnglesEnabled] = useState(true);
  const [inputMethod, setInputMethod] = useState<InputMethod>(InputMethod.MOUSE);
  const [isPencilMode, setIsPencilMode] = useState(false);
  
  // Line references
  const startPointRef = useRef<LinePoint>(null);
  const currentLineRef = useRef<Line | null>(null);
  
  // Measurement data for feedback
  const [measurementData, setMeasurementData] = useState<MeasurementData>({
    distance: null,
    angle: null,
    snapped: false
  });
  
  // Current line for external access
  const [currentLine, setCurrentLine] = useState<Line | null>(null);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (currentLineRef.current && fabricCanvasRef.current) {
        fabricCanvasRef.current.remove(currentLineRef.current);
      }
    };
  }, [fabricCanvasRef]);
  
  // Initialize tool
  useEffect(() => {
    setIsToolInitialized(true);
    
    // Show toast when tool is activated
    toast.info("Line tool ready. Stylus features enabled.", {
      id: "line-tool-ready"
    });
    
    return () => {
      setIsToolInitialized(false);
    };
  }, []);
  
  /**
   * Toggle grid snapping
   */
  const toggleGridSnapping = useCallback(() => {
    setSnapEnabled(prev => !prev);
    toast.info(
      snapEnabled ? "Grid snapping disabled" : "Grid snapping enabled", 
      { id: "grid-snap-toggle" }
    );
  }, [snapEnabled]);
  
  /**
   * Toggle angle snapping (orthogonal lines)
   */
  const toggleAngles = useCallback(() => {
    setAnglesEnabled(prev => !prev);
    toast.info(
      anglesEnabled ? "Angle snapping disabled" : "Angle snapping enabled", 
      { id: "angle-snap-toggle" }
    );
  }, [anglesEnabled]);
  
  /**
   * Set input method (mouse, touch, pencil)
   */
  const setInputMethodHandler = useCallback((method: InputMethod) => {
    setInputMethod(method);
    setIsPencilMode(method === InputMethod.PENCIL || method === InputMethod.STYLUS);
  }, []);
  
  /**
   * Handle starting a new line
   */
  const handlePointerDown = useCallback((point: Point): void => {
    if (!fabricCanvasRef.current) return;
    
    startPointRef.current = point;
    setIsDrawing(true);
    
    // Create new line
    const line = new Line([point.x, point.y, point.x, point.y], {
      stroke: lineColor,
      strokeWidth: lineThickness,
      strokeLineCap: 'round',
      strokeLineJoin: 'round',
      selectable: false,
      evented: false,
      objectCaching: false
    });
    
    // Add to canvas
    fabricCanvasRef.current.add(line);
    currentLineRef.current = line;
    setCurrentLine(line);
    
    // Update measurement data
    setMeasurementData({
      distance: 0,
      angle: 0,
      snapped: false
    });
  }, [fabricCanvasRef, lineColor, lineThickness]);
  
  /**
   * Handle continuing a line
   */
  const handlePointerMove = useCallback((point: Point): void => {
    if (!isDrawing || !startPointRef.current || !currentLineRef.current || !fabricCanvasRef.current) return;
    
    // Update line end point
    const startPoint = startPointRef.current;
    
    // Apply snapping if enabled
    let endPoint = point;
    let snapped = false;
    
    if (snapEnabled) {
      endPoint = snapPointToGrid(point);
      snapped = true;
    }
    
    if (anglesEnabled) {
      // Angle snapping (0, 45, 90 degrees)
      const deltaX = endPoint.x - startPoint.x;
      const deltaY = endPoint.y - startPoint.y;
      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
      
      // Snap to common angles
      const snapAngles = [0, 45, 90, 135, 180, 225, 270, 315];
      const closestAngle = snapAngles.reduce((prev, curr) => {
        return (Math.abs(curr - angle) < Math.abs(prev - angle)) ? curr : prev;
      });
      
      if (Math.abs(closestAngle - angle) < 10) {
        // Convert back to radians
        const radians = closestAngle * (Math.PI / 180);
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        endPoint = {
          x: startPoint.x + distance * Math.cos(radians),
          y: startPoint.y + distance * Math.sin(radians)
        };
        
        snapped = true;
      }
    }
    
    // Update line coordinates
    currentLineRef.current.set({
      x1: startPoint.x,
      y1: startPoint.y,
      x2: endPoint.x,
      y2: endPoint.y
    });
    
    // Calculate measurements
    const deltaX = endPoint.x - startPoint.x;
    const deltaY = endPoint.y - startPoint.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    
    setMeasurementData({
      distance: Math.round(distance),
      angle: Math.round(angle),
      snapped
    });
    
    // Render
    fabricCanvasRef.current.renderAll();
  }, [isDrawing, fabricCanvasRef, snapEnabled, anglesEnabled]);
  
  /**
   * Handle completing a line
   */
  const handlePointerUp = useCallback((point: Point): void => {
    if (!isDrawing || !startPointRef.current || !currentLineRef.current || !fabricCanvasRef.current) return;
    
    // Complete the line with final position
    const startPoint = startPointRef.current;
    
    // Apply final snapping
    let endPoint = point;
    
    if (snapEnabled) {
      endPoint = snapPointToGrid(point);
    }
    
    // Only complete line if it's long enough
    const deltaX = endPoint.x - startPoint.x;
    const deltaY = endPoint.y - startPoint.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (distance >= 5) {
      // Set final position
      currentLineRef.current.set({
        x1: startPoint.x,
        y1: startPoint.y,
        x2: endPoint.x,
        y2: endPoint.y
      });
      
      // Make line selectable
      currentLineRef.current.set({
        selectable: true,
        evented: true
      });
      
      // Save state for undo/redo
      saveCurrentState();
      
      // Reset current line reference
      setCurrentLine(null);
      fabricCanvasRef.current.renderAll();
      
      // Show completion toast for long lines
      if (distance > 50) {
        toast.success("Line created", { id: "line-created" });
      }
    } else {
      // Line too short, remove it
      if (currentLineRef.current) {
        fabricCanvasRef.current.remove(currentLineRef.current);
      }
    }
    
    // Reset state
    setIsDrawing(false);
    startPointRef.current = null;
    currentLineRef.current = null;
    
    // Clear measurements
    setMeasurementData({
      distance: null,
      angle: null,
      snapped: false
    });
  }, [isDrawing, fabricCanvasRef, snapEnabled, saveCurrentState]);
  
  /**
   * Cancel the current drawing operation
   */
  const cancelDrawing = useCallback((): void => {
    if (!isDrawing || !currentLineRef.current || !fabricCanvasRef.current) return;
    
    // Remove line from canvas
    fabricCanvasRef.current.remove(currentLineRef.current);
    fabricCanvasRef.current.renderAll();
    
    // Reset state
    setIsDrawing(false);
    startPointRef.current = null;
    currentLineRef.current = null;
    setCurrentLine(null);
    
    // Clear measurements
    setMeasurementData({
      distance: null,
      angle: null,
      snapped: false
    });
  }, [isDrawing, fabricCanvasRef]);
  
  /**
   * Snap a point to the grid
   */
  const snapPointToGrid = useCallback((point: Point): Point => {
    const gridSize = 10; // Base grid size
    
    // For pencil, use finer grid
    const effectiveGridSize = isPencilMode ? gridSize / 2 : gridSize;
    
    return {
      x: Math.round(point.x / effectiveGridSize) * effectiveGridSize,
      y: Math.round(point.y / effectiveGridSize) * effectiveGridSize
    };
  }, [isPencilMode]);
  
  return {
    isDrawing,
    isActive,
    isToolInitialized,
    startPointRef,
    currentLineRef,
    snapEnabled,
    anglesEnabled,
    inputMethod,
    isPencilMode,
    setInputMethod: setInputMethodHandler,
    setIsPencilMode,
    toggleGridSnapping,
    toggleAngles,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    cancelDrawing,
    snapPointToGrid,
    measurementData,
    currentLine
  };
};

// Re-export InputMethod for convenience
export { InputMethod };
