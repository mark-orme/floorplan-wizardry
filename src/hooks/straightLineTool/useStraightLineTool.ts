/**
 * Enhanced straight line drawing tool with snapping and measurements
 * @module hooks/straightLineTool/useStraightLineTool
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, Line, Text, Point as FabricPoint } from 'fabric';
import { toast } from 'sonner';
import { Point } from '@/types/core/Point';
import { snapPointToGrid, snapLineToGrid, constrainToMajorAngles } from '@/utils/grid/snapping';
import logger from '@/utils/logger';
import { GRID_CONSTANTS } from '@/constants/gridConstants';

export enum InputMethod {
  MOUSE = 'mouse',
  TOUCH = 'touch',
  STYLUS = 'stylus',
  PENCIL = 'pencil'
}

interface MeasurementData {
  distance: number;
  distanceText: string;
  angle: number;
  angleText: string;
}

interface UseStraightLineToolProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  enabled: boolean;
  lineColor?: string;
  lineThickness?: number;
  saveCurrentState?: () => void;
  initialSnapEnabled?: boolean;
  initialAnglesEnabled?: boolean;
}

/**
 * Hook for drawing straight lines with snapping and measurements
 */
export const useStraightLineTool = ({
  fabricCanvasRef,
  enabled,
  lineColor = '#000000',
  lineThickness = 2,
  saveCurrentState = () => {},
  initialSnapEnabled = true,
  initialAnglesEnabled = true
}: UseStraightLineToolProps) => {
  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [snapEnabled, setSnapEnabled] = useState(initialSnapEnabled);
  const [anglesEnabled, setAnglesEnabled] = useState(initialAnglesEnabled);
  const [inputMethod, setInputMethod] = useState<InputMethod>(InputMethod.MOUSE);
  const [isPencilMode, setIsPencilMode] = useState(false);
  const [isActive, setIsActive] = useState(enabled);
  const [isToolInitialized, setIsToolInitialized] = useState(false);
  const [currentLine, setCurrentLine] = useState<Line | null>(null);
  const [measurementData, setMeasurementData] = useState<MeasurementData | null>(null);
  
  // Refs for tracking across renders
  const startPointRef = useRef<Point | null>(null);
  const currentLineRef = useRef<Line | null>(null);
  const distanceTooltipRef = useRef<Text | null>(null);
  
  // Toggle grid snapping
  const toggleGridSnapping = useCallback(() => {
    setSnapEnabled(prev => {
      const newValue = !prev;
      toast.info(newValue ? 'Grid snapping enabled' : 'Grid snapping disabled');
      return newValue;
    });
  }, []);
  
  // Toggle angle snapping
  const toggleAngles = useCallback(() => {
    setAnglesEnabled(prev => {
      const newValue = !prev;
      toast.info(newValue ? 'Angle snapping enabled' : 'Angle snapping disabled');
      return newValue;
    });
  }, []);
  
  // Process point through snapping if enabled
  const processPoint = useCallback((point: Point): Point => {
    if (!snapEnabled) return { ...point };
    return snapPointToGrid(point);
  }, [snapEnabled]);
  
  // =========== DRAWING HANDLERS ===========
  
  // Start drawing a line
  const handlePointerDown = useCallback((point: Point) => {
    if (!isActive || !fabricCanvasRef.current) return;
    
    logger.info('Pointer down in useStraightLineTool', point);
    
    // Save the canvas state before starting a new line
    saveCurrentState();
    
    // Process the point (snap to grid if enabled)
    const processedPoint = processPoint(point);
    
    // Set drawing state
    setIsDrawing(true);
    startPointRef.current = processedPoint;
    
    // Create a new line
    const newLine = new Line(
      [processedPoint.x, processedPoint.y, processedPoint.x, processedPoint.y],
      {
        stroke: lineColor,
        strokeWidth: lineThickness,
        selectable: false,
        evented: false,
        objectType: 'straight-line'
      }
    );
    
    // Add to canvas
    const canvas = fabricCanvasRef.current;
    canvas.add(newLine);
    
    // Store in state and ref
    setCurrentLine(newLine);
    currentLineRef.current = newLine;
    
    logger.info('Line created:', newLine);
    
    // Create initial measurement tooltip
    const initialMeasurement = createOrUpdateMeasurement(processedPoint, processedPoint);
    setMeasurementData(initialMeasurement);
    
    canvas.requestRenderAll();
  }, [isActive, fabricCanvasRef, processPoint, lineColor, lineThickness, saveCurrentState]);
  
  // Continue drawing (update line while moving)
  const handlePointerMove = useCallback((point: Point) => {
    if (!isDrawing || !startPointRef.current || !currentLineRef.current || !fabricCanvasRef.current) return;
    
    // Process the point (snap to grid if enabled)
    let processedPoint = processPoint(point);
    
    // Apply angle constraints if enabled
    if (anglesEnabled) {
      const start = startPointRef.current;
      const { end } = constrainToMajorAngles(start, processedPoint);
      processedPoint = end;
    }
    
    // Update the line
    const line = currentLineRef.current;
    line.set({
      x2: processedPoint.x,
      y2: processedPoint.y
    });
    
    // Update measurement data
    const measurementInfo = createOrUpdateMeasurement(startPointRef.current, processedPoint);
    setMeasurementData(measurementInfo);
    
    // Render canvas
    fabricCanvasRef.current.requestRenderAll();
  }, [isDrawing, processPoint, anglesEnabled, fabricCanvasRef]);
  
  // Complete drawing (finish the line)
  const handlePointerUp = useCallback((point: Point) => {
    if (!isDrawing || !startPointRef.current || !currentLineRef.current || !fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    
    // Process the point (snap to grid if enabled)
    let processedPoint = processPoint(point);
    
    // Apply angle constraints if enabled
    if (anglesEnabled) {
      const start = startPointRef.current;
      const { end } = constrainToMajorAngles(start, processedPoint);
      processedPoint = end;
    }
    
    // Update the line one last time
    const line = currentLineRef.current;
    line.set({
      x2: processedPoint.x,
      y2: processedPoint.y
    });
    
    // Clean up distance tooltip
    if (distanceTooltipRef.current) {
      canvas.remove(distanceTooltipRef.current);
      distanceTooltipRef.current = null;
    }
    
    // Calculate distance
    const dx = processedPoint.x - startPointRef.current.x;
    const dy = processedPoint.y - startPointRef.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Only keep the line if it has a meaningful length
    if (distance > 5) {
      // Set final line properties
      line.set({
        selectable: true,
        evented: true,
        objectType: 'straight-line',
        metadata: {
          startPoint: { ...startPointRef.current },
          endPoint: { ...processedPoint },
          length: distance,
          angle: Math.atan2(dy, dx) * (180 / Math.PI)
        }
      });
      
      // Create permanent measurement label
      const distInMeters = (distance / GRID_CONSTANTS.PIXELS_PER_METER).toFixed(2);
      createPermanentMeasurementLabel(startPointRef.current, processedPoint, `${distInMeters}m`);
      
      // Notify success
      toast.success(`Line created: ${distInMeters}m`);
    } else {
      // Line too short, remove it
      canvas.remove(line);
      toast.info('Line discarded (too short)');
    }
    
    // Reset drawing state
    setIsDrawing(false);
    startPointRef.current = null;
    currentLineRef.current = null;
    setCurrentLine(null);
    setMeasurementData(null);
    
    // Render canvas
    canvas.requestRenderAll();
  }, [isDrawing, processPoint, anglesEnabled, fabricCanvasRef]);
  
  // Cancel drawing (e.g., when pressing Escape)
  const cancelDrawing = useCallback(() => {
    if (!isDrawing || !fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    
    // Remove the line being drawn
    if (currentLineRef.current) {
      canvas.remove(currentLineRef.current);
    }
    
    // Remove the measurement tooltip
    if (distanceTooltipRef.current) {
      canvas.remove(distanceTooltipRef.current);
    }
    
    // Reset drawing state
    setIsDrawing(false);
    startPointRef.current = null;
    currentLineRef.current = null;
    setCurrentLine(null);
    setMeasurementData(null);
    
    // Render canvas
    canvas.requestRenderAll();
    
    toast.info('Drawing canceled');
  }, [isDrawing, fabricCanvasRef]);
  
  // =========== HELPER FUNCTIONS ===========
  
  // Create or update measurement tooltip and data
  const createOrUpdateMeasurement = useCallback((start: Point, end: Point): MeasurementData => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return { distance: 0, distanceText: '0m', angle: 0, angleText: '0°' };
    
    // Calculate distance and angle
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const distanceInMeters = (distance / GRID_CONSTANTS.PIXELS_PER_METER).toFixed(2);
    
    // Calculate angle in degrees
    const angleDeg = Math.atan2(dy, dx) * (180 / Math.PI);
    const angleText = `${Math.round(angleDeg)}°`;
    
    // Position for tooltip (midpoint of line)
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2 - 15; // Position above the line
    
    // Create or update tooltip
    if (!distanceTooltipRef.current) {
      // Create new tooltip
      distanceTooltipRef.current = new Text(`${distanceInMeters}m ${angleText}`, {
        left: midX,
        top: midY,
        fontSize: 14,
        fill: lineColor,
        backgroundColor: 'rgba(255,255,255,0.7)',
        padding: 5,
        objectType: 'measurement',
        selectable: false,
        originX: 'center',
        originY: 'bottom'
      });
      
      canvas.add(distanceTooltipRef.current);
    } else {
      // Update existing tooltip
      distanceTooltipRef.current.set({
        text: `${distanceInMeters}m ${angleText}`,
        left: midX,
        top: midY
      });
    }
    
    // Return measurement data
    return {
      distance,
      distanceText: `${distanceInMeters}m`,
      angle: angleDeg,
      angleText
    };
  }, [fabricCanvasRef, lineColor]);
  
  // Create permanent measurement label
  const createPermanentMeasurementLabel = useCallback((start: Point, end: Point, label: string) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return null;
    
    // Position for label (midpoint of line)
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2 - 10;
    
    // Create permanent label
    const measurementLabel = new Text(label, {
      left: midX,
      top: midY,
      fontSize: 12,
      fill: lineColor,
      backgroundColor: 'rgba(255,255,255,0.5)',
      padding: 3,
      objectType: 'measurement-label',
      selectable: true,
      originX: 'center',
      originY: 'bottom'
    });
    
    canvas.add(measurementLabel);
    return measurementLabel;
  }, [fabricCanvasRef, lineColor]);
  
  // Set up event handlers and tool state
  useEffect(() => {
    // Update active state based on 'enabled' prop
    setIsActive(enabled);
    
    if (enabled && !isToolInitialized) {
      setIsToolInitialized(true);
    }
    
    // Clean up drawing state when tool is disabled
    if (!enabled && isDrawing) {
      cancelDrawing();
    }
  }, [enabled, isToolInitialized, isDrawing, cancelDrawing]);
  
  // Attach canvas event handlers
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isActive) return;
    
    logger.info('Attaching straight line event handlers to canvas', { isActive, isToolInitialized });
    
    // Configure canvas for line drawing
    canvas.isDrawingMode = false;
    canvas.selection = false;
    canvas.defaultCursor = 'crosshair';
    
    return () => {
      // Clean up if drawing is still in progress when component unmounts
      if (isDrawing) {
        cancelDrawing();
      }
    };
  }, [fabricCanvasRef, isActive, isDrawing, cancelDrawing]);
  
  return {
    isDrawing,
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
    currentLine
  };
};
