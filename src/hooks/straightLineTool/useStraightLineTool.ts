
/**
 * Hook for drawing straight lines on canvas
 * @module hooks/straightLineTool/useStraightLineTool
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, Line, Point } from 'fabric';
import { convertToFabricPoint } from '@/utils/fabric';
import { toast } from 'sonner';
import { DrawingMode } from '@/constants/drawingModes';

/**
 * Props for the useStraightLineTool hook
 */
export interface UseStraightLineToolProps {
  fabricCanvasRef: { current: FabricCanvas | null };
  enabled: boolean;
  lineColor: string;
  lineThickness: number;
  saveCurrentState: () => void;
  snapToGrid?: boolean;
  tool?: DrawingMode;
}

/**
 * Hook for drawing straight lines on a Fabric.js canvas
 */
export const useStraightLineTool = ({
  fabricCanvasRef,
  enabled,
  lineColor,
  lineThickness,
  saveCurrentState,
  snapToGrid = true,
  tool = DrawingMode.STRAIGHT_LINE
}: UseStraightLineToolProps) => {
  // Line drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState<Line | null>(null);
  const startPointRef = useRef<Point | null>(null);
  const currentLineRef = useRef<Line | null>(null);
  const isActive = enabled;
  
  // Add additional state properties for compatibility with the enhanced version
  const [inputMethod] = useState<'mouse' | 'touch' | 'stylus' | 'pencil'>('mouse');
  const [isPencilMode] = useState<boolean>(false);
  const [snapEnabled] = useState<boolean>(snapToGrid);
  const [anglesEnabled] = useState<boolean>(false);
  const [measurementData, setMeasurementData] = useState<any>(null);
  const [isToolInitialized] = useState<boolean>(true);
  
  /**
   * Handle mouse down event
   */
  const handleMouseDown = useCallback((e: any) => {
    if (!enabled || !fabricCanvasRef.current) return;
    
    // Prevent default handling
    e.e.preventDefault();
    
    // Save current state before starting new line
    saveCurrentState();
    
    // Get pointer position
    const canvas = fabricCanvasRef.current;
    const pointer = canvas.getPointer(e.e);
    
    // Create start point
    startPointRef.current = new Point(pointer.x, pointer.y);
    
    // Create new line
    const newLine = new Line([pointer.x, pointer.y, pointer.x, pointer.y], {
      stroke: lineColor,
      strokeWidth: lineThickness,
      selectable: false,
      evented: false
    });
    
    // Add line to canvas
    canvas.add(newLine);
    setCurrentLine(newLine);
    currentLineRef.current = newLine;
    setIsDrawing(true);
  }, [enabled, fabricCanvasRef, lineColor, lineThickness, saveCurrentState]);
  
  /**
   * Handle mouse move event
   */
  const handleMouseMove = useCallback((e: any) => {
    if (!isDrawing || !startPointRef.current || !currentLine || !fabricCanvasRef.current) return;
    
    // Get pointer position
    const canvas = fabricCanvasRef.current;
    const pointer = canvas.getPointer(e.e);
    
    // Update line end point
    currentLine.set({
      x2: pointer.x,
      y2: pointer.y
    });
    
    canvas.requestRenderAll();
  }, [isDrawing, currentLine, fabricCanvasRef]);
  
  /**
   * Handle mouse up event
   */
  const handleMouseUp = useCallback((e: any) => {
    if (!isDrawing || !startPointRef.current || !currentLine || !fabricCanvasRef.current) return;
    
    // Get pointer position
    const canvas = fabricCanvasRef.current;
    const pointer = canvas.getPointer(e.e);
    
    // Update line properties
    currentLine.set({
      selectable: true,
      evented: true
    });
    
    // Reset drawing state
    setIsDrawing(false);
    setCurrentLine(null);
    startPointRef.current = null;
    currentLineRef.current = null;
    
    // Render canvas
    canvas.requestRenderAll();
    
    // Show toast message
    toast.success('Line drawn successfully');
  }, [isDrawing, currentLine, fabricCanvasRef]);

  /**
   * Pointer event handlers for external use
   */
  const handlePointerDown = useCallback((point: any) => {
    // Implementation for compatibility
    console.log('Pointer down at', point);
  }, []);

  const handlePointerMove = useCallback((point: any) => {
    // Implementation for compatibility
    console.log('Pointer move at', point);
  }, []);

  const handlePointerUp = useCallback((point: any) => {
    // Implementation for compatibility
    console.log('Pointer up at', point);
  }, []);

  /**
   * Cancel the current drawing operation
   */
  const cancelDrawing = useCallback(() => {
    if (!isDrawing || !fabricCanvasRef.current || !currentLine) return;
    
    const canvas = fabricCanvasRef.current;
    
    // Remove the line from canvas
    canvas.remove(currentLine);
    canvas.requestRenderAll();
    
    // Reset drawing state
    setIsDrawing(false);
    setCurrentLine(null);
    startPointRef.current = null;
    currentLineRef.current = null;
    
    console.log('Drawing canceled');
  }, [isDrawing, currentLine, fabricCanvasRef]);

  /**
   * Toggle grid snapping on/off
   */
  const toggleGridSnapping = useCallback(() => {
    // Implementation for compatibility
    console.log('Toggle grid snapping');
  }, []);

  /**
   * Toggle angle constraints on/off
   */
  const toggleAngles = useCallback(() => {
    // Implementation for compatibility
    console.log('Toggle angles');
  }, []);
  
  /**
   * Set up event handlers
   */
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    if (enabled) {
      // Set cursor for line tool
      canvas.defaultCursor = 'crosshair';
      canvas.hoverCursor = 'crosshair';
      
      // Attach event handlers
      canvas.on('mouse:down', handleMouseDown);
      canvas.on('mouse:move', handleMouseMove);
      canvas.on('mouse:up', handleMouseUp);
    } else {
      // Reset cursor
      canvas.defaultCursor = 'default';
      canvas.hoverCursor = 'move';
      
      // If switching away while drawing, finalize any current line
      if (isDrawing && currentLine) {
        currentLine.set({
          selectable: true,
          evented: true
        });
        canvas.requestRenderAll();
        
        setIsDrawing(false);
        setCurrentLine(null);
        startPointRef.current = null;
      }
    }
    
    // Clean up event handlers
    return () => {
      if (canvas) {
        canvas.off('mouse:down', handleMouseDown);
        canvas.off('mouse:move', handleMouseMove);
        canvas.off('mouse:up', handleMouseUp);
      }
    };
  }, [
    enabled, 
    fabricCanvasRef, 
    handleMouseDown, 
    handleMouseMove, 
    handleMouseUp, 
    isDrawing, 
    currentLine
  ]);
  
  return {
    isDrawing,
    currentLine,
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
    isToolInitialized
  };
};
