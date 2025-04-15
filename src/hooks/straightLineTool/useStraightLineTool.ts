import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, Line, Point as FabricPoint } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { Point } from '@/types/core/Point';
import { toast } from 'sonner';
import { useLineEvents } from './useLineEvents';
import { toFabricPoint } from '@/utils/fabricPointConverter';

interface UseStraightLineToolProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  tool: DrawingMode;
  lineColor?: string;
  lineThickness?: number;
  saveCurrentState?: () => void;
  useShiftConstraint?: boolean;
}

export const useStraightLineTool = ({
  fabricCanvasRef,
  tool,
  lineColor = '#000000',
  lineThickness = 2,
  saveCurrentState = () => {},
  useShiftConstraint = false
}: UseStraightLineToolProps) => {
  const isActive = tool === DrawingMode.STRAIGHT_LINE;
  const [isDrawing, setIsDrawing] = useState(false);
  const [inputMethod, setInputMethod] = useState<'mouse' | 'touch' | 'pencil' | 'stylus'>('mouse');
  const [isPencilMode, setIsPencilMode] = useState(false);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [anglesEnabled, setAnglesEnabled] = useState(true);
  const [isToolInitialized, setIsToolInitialized] = useState(false);
  const [currentLine, setCurrentLine] = useState<Line | null>(null);
  const [measurementData, setMeasurementData] = useState<{
    length: number;
    angle: number;
    start: Point;
    end: Point;
  } | null>(null);
  
  // Refs for tracking state across renders
  const startPointRef = useRef<Point | null>(null);
  const currentLineRef = useRef<Line | null>(null);
  const isActiveRef = useRef(false);
  
  // Update active ref whenever tool changes
  useEffect(() => {
    isActiveRef.current = isActive;
    
    // Debug logging
    if (isActive) {
      console.log("Straight line tool activated in hook");
      
      // Initialize tool after a delay to ensure canvas is ready
      const timer = setTimeout(() => {
        setIsToolInitialized(true);
        console.log("Straight line tool initialized", { 
          tool, 
          lineColor, 
          lineThickness 
        });
      }, 100);
      
      return () => clearTimeout(timer);
    } else {
      setIsToolInitialized(false);
    }
  }, [isActive, tool, lineColor, lineThickness]);
  
  // Definition of line state for hooks
  const lineState = {
    isDrawing,
    isToolInitialized,
    startPointRef,
    currentLineRef,
    distanceTooltipRef: useRef<any>(null),
    setStartPoint: (point: Point) => {
      startPointRef.current = point;
    },
    setCurrentLine: (line: Line) => {
      currentLineRef.current = line;
      setCurrentLine(line);
    },
    setDistanceTooltip: (tooltip: any) => {
      // Not used directly in this hook, but required for useLineEvents
    },
    initializeTool: () => {
      setIsToolInitialized(true);
    },
    resetDrawingState: () => {
      startPointRef.current = null;
      currentLineRef.current = null;
      setCurrentLine(null);
      setIsDrawing(false);
      setMeasurementData(null);
    },
    setIsDrawing
  };
  
  // Get line event handlers
  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    cancelDrawing,
    cleanupEventHandlers
  } = useLineEvents(
    fabricCanvasRef,
    tool,
    lineColor,
    lineThickness,
    saveCurrentState,
    lineState
  );
  
  // Custom handlers for external event integration
  const handlePointerDown = useCallback((point: Point) => {
    console.log("Pointer down in useStraightLineTool", point);
    if (!isActiveRef.current || !fabricCanvasRef.current) return;
    
    try {
      // Start drawing from this point
      startPointRef.current = point;
      setIsDrawing(true);
      
      // Create a new line
      const canvas = fabricCanvasRef.current;
      const line = new Line([point.x, point.y, point.x, point.y], {
        stroke: lineColor,
        strokeWidth: lineThickness,
        selectable: false,
        evented: false
      });
      
      canvas.add(line);
      currentLineRef.current = line;
      setCurrentLine(line);
      
      // Update measurement data
      setMeasurementData({
        length: 0,
        angle: 0,
        start: point,
        end: point
      });
      
      console.log("Line created:", line);
      
      // Force canvas render
      canvas.requestRenderAll();
    } catch (error) {
      console.error("Error in handlePointerDown:", error);
      toast.error("Failed to start drawing line");
    }
  }, [fabricCanvasRef, lineColor, lineThickness]);
  
  const handlePointerMove = useCallback((point: Point) => {
    if (!isActiveRef.current || !isDrawing || !startPointRef.current || !currentLineRef.current) return;
    
    try {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;
      
      // Update the line's end point
      currentLineRef.current.set({
        x2: point.x,
        y2: point.y
      });
      
      // Calculate measurements
      const dx = point.x - startPointRef.current.x;
      const dy = point.y - startPointRef.current.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      
      setMeasurementData({
        length,
        angle,
        start: startPointRef.current,
        end: point
      });
      
      // Force canvas render
      canvas.requestRenderAll();
    } catch (error) {
      console.error("Error in handlePointerMove:", error);
    }
  }, [isDrawing, fabricCanvasRef]);
  
  const handlePointerUp = useCallback((point: Point) => {
    console.log("Pointer up in useStraightLineTool", point);
    if (!isActiveRef.current || !isDrawing || !startPointRef.current || !currentLineRef.current) return;
    
    try {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;
      
      // Finalize the line
      currentLineRef.current.set({
        x2: point.x,
        y2: point.y,
        selectable: true,
        evented: true
      });
      
      // Calculate length
      const dx = point.x - startPointRef.current.x;
      const dy = point.y - startPointRef.current.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      
      console.log("Completing line with length:", length);
      
      // Only keep the line if it's long enough
      if (length > 1) {
        // Save to history
        saveCurrentState();
        
        // Indicate success
        toast.success(`Line drawn: ${Math.round(length)} px`);
      } else {
        // Line too short, remove it
        canvas.remove(currentLineRef.current);
        toast.info("Line too short, discarded");
      }
      
      // Reset state
      startPointRef.current = null;
      currentLineRef.current = null;
      setCurrentLine(null);
      setIsDrawing(false);
      setMeasurementData(null);
      
      // Force canvas render
      canvas.requestRenderAll();
    } catch (error) {
      console.error("Error in handlePointerUp:", error);
      toast.error("Failed to complete line");
      
      // Reset state on error
      setIsDrawing(false);
    }
  }, [isDrawing, fabricCanvasRef, saveCurrentState]);
  
  // Toggle functions
  const toggleGridSnapping = useCallback(() => {
    setSnapEnabled(prev => !prev);
    toast.info(snapEnabled ? "Grid snapping disabled" : "Grid snapping enabled");
  }, [snapEnabled]);
  
  const toggleAngles = useCallback(() => {
    setAnglesEnabled(prev => !prev);
    toast.info(anglesEnabled ? "Angle constraints disabled" : "Angle constraints enabled");
  }, [anglesEnabled]);
  
  // Attach event handlers directly to canvas when tool is active
  useEffect(() => {
    // Only run this effect when the tool is active and canvas is available
    if (!isActive || !fabricCanvasRef.current || !isToolInitialized) return;
    
    const canvas = fabricCanvasRef.current;
    
    console.log("Attaching straight line event handlers to canvas", {
      isActive,
      isToolInitialized
    });
    
    // Create bound handlers
    const mouseDownHandler = (e: any) => {
      if (!isActive) return;
      console.log("Mouse down on canvas", e);
      const pointer = canvas.getPointer(e.e);
      handlePointerDown({ x: pointer.x, y: pointer.y });
    };
    
    const mouseMoveHandler = (e: any) => {
      if (!isActive || !isDrawing) return;
      const pointer = canvas.getPointer(e.e);
      handlePointerMove({ x: pointer.x, y: pointer.y });
    };
    
    const mouseUpHandler = (e: any) => {
      if (!isActive || !isDrawing) return;
      console.log("Mouse up on canvas", e);
      const pointer = canvas.getPointer(e.e);
      handlePointerUp({ x: pointer.x, y: pointer.y });
    };
    
    // Attach handlers
    canvas.on('mouse:down', mouseDownHandler);
    canvas.on('mouse:move', mouseMoveHandler);
    canvas.on('mouse:up', mouseUpHandler);
    
    // Clean up on unmount or tool change
    return () => {
      canvas.off('mouse:down', mouseDownHandler);
      canvas.off('mouse:move', mouseMoveHandler);
      canvas.off('mouse:up', mouseUpHandler);
      
      // Cancel any active drawing
      if (isDrawing && currentLineRef.current) {
        canvas.remove(currentLineRef.current);
      }
      
      // Reset state
      setIsDrawing(false);
      startPointRef.current = null;
      currentLineRef.current = null;
      setCurrentLine(null);
    };
  }, [
    isActive, 
    fabricCanvasRef,
    isToolInitialized,
    isDrawing,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp
  ]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (isDrawing && currentLineRef.current && fabricCanvasRef.current) {
        fabricCanvasRef.current.remove(currentLineRef.current);
      }
    };
  }, [isDrawing, fabricCanvasRef]);
  
  return {
    isActive,
    isDrawing,
    inputMethod,
    isPencilMode,
    snapEnabled,
    anglesEnabled,
    measurementData,
    isToolInitialized,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    cancelDrawing,
    toggleGridSnapping,
    toggleAngles,
    currentLine,
    startPointRef,
    currentLineRef
  };
};
