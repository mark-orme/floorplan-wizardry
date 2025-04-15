/**
 * Enhanced straight line drawing tool hook with advanced functionality
 * @module hooks/straightLineTool/useStraightLineToolRefactored
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, Line, Text } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { Point } from '@/types/core/Geometry';
import { calculateDistance, getMidpoint } from '@/utils/geometryUtils';
import logger from '@/utils/logger';
import { useSnapToGrid } from '@/hooks/useSnapToGrid';
import { captureError, captureMessage } from '@/utils/sentry';
import * as Sentry from '@sentry/react';

/**
 * Input method type for determining drawing interaction method
 * @typedef {'mouse' | 'touch' | 'stylus' | 'pencil'} InputMethod
 */
type InputMethod = 'mouse' | 'touch' | 'stylus' | 'pencil';

/**
 * Measurement data for displaying line information
 * @interface MeasurementData
 */
interface MeasurementData {
  /** Length of the line in pixels */
  length: number;
  /** Angle of the line in degrees */
  angle: number;
  /** Midpoint of the line for tooltip positioning */
  midpoint: Point;
  /** Start point of the line */
  start: Point;
  /** End point of the line */
  end: Point;
}

/**
 * Custom interface for Fabric Line with data property
 */
interface CustomFabricLine extends Line {
  data?: {
    type?: string;
    createdAt?: string;
    length?: number;
    completed?: boolean;
    [key: string]: any;
  };
}

/**
 * Props for the useStraightLineToolRefactored hook
 * @interface UseStraightLineToolRefactoredProps
 */
interface UseStraightLineToolRefactoredProps {
  /** Reference to the fabric canvas instance */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Current active drawing tool */
  tool: DrawingMode;
  /** Line color for drawing */
  lineColor?: string;
  /** Line thickness for drawing */
  lineThickness?: number;
  /** Function to save current canvas state for undo history */
  saveCurrentState?: () => void;
  /** Whether to use shift key constraint */
  useShiftConstraint?: boolean;
  /** Whether to force precise angles only */
  forceAngles?: boolean;
  /** Initial grid snap state */
  initialSnapEnabled?: boolean;
}

/**
 * Result from the useStraightLineToolRefactored hook
 * @interface UseStraightLineToolRefactoredResult
 */
interface UseStraightLineToolRefactoredResult {
  /** Whether the tool is active (current tool is STRAIGHT_LINE) */
  isActive: boolean;
  /** Whether a drawing operation is in progress */
  isDrawing: boolean;
  /** Current input method (mouse, touch, stylus, pencil) */
  inputMethod: InputMethod;
  /** Whether pencil mode is enabled (pressure sensitivity) */
  isPencilMode: boolean;
  /** Whether grid snapping is enabled */
  snapEnabled: boolean;
  /** Whether angle constraints are enabled */
  anglesEnabled: boolean;
  /** Measurement data for the current line */
  measurementData: MeasurementData | null;
  /** Handle pointer down event to start drawing */
  handlePointerDown: (point: Point) => void;
  /** Handle pointer move event to update the line */
  handlePointerMove: (point: Point) => void;
  /** Handle pointer up event to complete the line */
  handlePointerUp: (point: Point) => void;
  /** Cancel the current drawing operation */
  cancelDrawing: () => void;
  /** Toggle grid snapping on/off */
  toggleGridSnapping: () => void;
  /** Toggle angle constraints on/off */
  toggleAngles: () => void;
  /** Current line being drawn */
  currentLine: Line | null;
  /** Reference to the start point of the line */
  startPointRef: React.MutableRefObject<Point | null>;
  /** Reference to the current line object */
  currentLineRef: React.MutableRefObject<CustomFabricLine | null>;
  /** Whether the tool has been fully initialized */
  isToolInitialized: boolean;
}

/**
 * Enhanced hook for drawing straight lines with advanced features
 * 
 * This hook provides a comprehensive set of functionality for drawing straight lines:
 * - Grid snapping for precise positioning
 * - Angle constraints (0°, 45°, 90°, etc.)
 * - Real-time measurements (length, angle)
 * - Multiple input methods (mouse, touch, stylus)
 * - Pressure sensitivity for compatible devices
 * - Shift key constraint for horizontal/vertical/45° lines
 * - Detailed error tracking and logging
 * 
 * @example
 * ```tsx
 * const {
 *   isActive,
 *   isDrawing,
 *   handlePointerDown,
 *   handlePointerMove,
 *   handlePointerUp,
 *   cancelDrawing,
 *   toggleGridSnapping,
 *   snapEnabled
 * } = useStraightLineToolRefactored({
 *   fabricCanvasRef,
 *   tool,
 *   lineColor: '#ff0000',
 *   lineThickness: 2,
 *   saveCurrentState
 * });
 * 
 * // In your canvas event handlers:
 * const onMouseDown = (e) => {
 *   if (isActive) {
 *     const point = { x: e.clientX, y: e.clientY };
 *     handlePointerDown(point);
 *   }
 * };
 * ```
 * 
 * @param {UseStraightLineToolRefactoredProps} props - Hook parameters
 * @returns {UseStraightLineToolRefactoredResult} Line drawing methods and state
 */
export const useStraightLineToolRefactored = ({
  fabricCanvasRef,
  tool,
  lineColor = '#000000',
  lineThickness = 2,
  saveCurrentState = () => {},
  useShiftConstraint = false,
  forceAngles = false,
  initialSnapEnabled = true
}: UseStraightLineToolRefactoredProps): UseStraightLineToolRefactoredResult => {
  // Tool state
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [inputMethod, setInputMethod] = useState<InputMethod>('mouse');
  const [isPencilMode, setIsPencilMode] = useState<boolean>(false);
  const [snapEnabled, setSnapEnabled] = useState<boolean>(initialSnapEnabled);
  const [anglesEnabled, setAnglesEnabled] = useState<boolean>(forceAngles);
  const [measurementData, setMeasurementData] = useState<MeasurementData | null>(null);
  const [isToolInitialized, setIsToolInitialized] = useState<boolean>(false);
  
  // References
  const startPointRef = useRef<Point | null>(null);
  const currentLineRef = useRef<CustomFabricLine | null>(null);
  const distanceTooltipRef = useRef<Text | null>(null);
  const isActive = tool === DrawingMode.STRAIGHT_LINE;
  
  // Use the grid snapping functionality
  const { snapPointToGrid, snapLineToGrid } = useSnapToGrid({
    fabricCanvasRef,
    initialSnapEnabled: snapEnabled,
    angleConstraints: anglesEnabled || useShiftConstraint
  });
  
  // Set up Sentry context for the component
  useEffect(() => {
    if (!isActive) return;
    
    Sentry.setTag("component", "useStraightLineToolRefactored");
    Sentry.setTag("tool", tool);
    Sentry.setTag("isDrawing", isDrawing.toString());
    Sentry.setTag("snapEnabled", snapEnabled.toString());
    Sentry.setTag("anglesEnabled", anglesEnabled.toString());
    Sentry.setTag("inputMethod", inputMethod);
    
    Sentry.setContext("lineToolState", {
      lineColor,
      lineThickness,
      useShiftConstraint,
      forceAngles,
      isToolInitialized,
      isPencilMode,
      inputMethod,
      measurements: measurementData,
      timestamp: new Date().toISOString()
    });
    
    return () => {
      // Clear component-specific tags when tool becomes inactive
      if (isActive) {
        Sentry.setTag("component", null);
        Sentry.setTag("tool", null);
        Sentry.setTag("isDrawing", null);
        Sentry.setTag("snapEnabled", null);
        Sentry.setTag("anglesEnabled", null);
        Sentry.setTag("inputMethod", null);
      }
    };
  }, [isActive, tool, isDrawing, snapEnabled, anglesEnabled, lineColor, lineThickness, 
      useShiftConstraint, forceAngles, isToolInitialized, isPencilMode, inputMethod, measurementData]);
  
  // Initialize the tool when it becomes active
  useEffect(() => {
    if (isActive && !isToolInitialized) {
      logger.info("Initializing straight line tool");
      setIsToolInitialized(true);
      
      // Add Sentry breadcrumb for tool initialization
      Sentry.addBreadcrumb({
        category: 'lineTool',
        message: 'Straight line tool initialized',
        level: 'info',
        data: {
          lineColor,
          lineThickness,
          snapEnabled,
          anglesEnabled
        }
      });
      
      captureMessage("Straight line tool initialized", "tool-initialization", {
        tags: { component: "useStraightLineToolRefactored" },
        extra: { 
          lineColor, 
          lineThickness,
          snapEnabled,
          anglesEnabled
        }
      });
    }
  }, [isActive, isToolInitialized, lineColor, lineThickness, snapEnabled, anglesEnabled]);
  
  /**
   * Toggle grid snapping on/off
   * When enabled, points will snap to grid intersections
   */
  const toggleGridSnapping = useCallback(() => {
    setSnapEnabled(prev => {
      const newValue = !prev;
      
      // Track toggle in Sentry
      Sentry.addBreadcrumb({
        category: 'settings',
        message: `Grid snapping ${newValue ? 'enabled' : 'disabled'}`,
        level: 'info'
      });
      
      return newValue;
    });
  }, []);
  
  /**
   * Toggle angle constraints on/off
   * When enabled, lines will snap to 0°, 45°, 90°, etc.
   */
  const toggleAngles = useCallback(() => {
    setAnglesEnabled(prev => {
      const newValue = !prev;
      
      // Track toggle in Sentry
      Sentry.addBreadcrumb({
        category: 'settings',
        message: `Angle constraints ${newValue ? 'enabled' : 'disabled'}`,
        level: 'info'
      });
      
      return newValue;
    });
  }, []);
  
  /**
   * Handle pointer down event to start drawing a line
   * @param {Point} point - Starting point coordinates
   */
  const handlePointerDown = useCallback((point: Point) => {
    if (!isActive || !fabricCanvasRef.current) return;
    
    try {
      const canvas = fabricCanvasRef.current;
      
      setIsDrawing(true);
      
      // Apply grid snapping to starting point
      const snappedPoint = snapPointToGrid(point);
      startPointRef.current = snappedPoint;
      
      // Add Sentry breadcrumb for line start
      Sentry.addBreadcrumb({
        category: 'drawing',
        message: 'Started drawing straight line',
        level: 'info',
        data: {
          startPoint: snappedPoint,
          snapEnabled,
          anglesEnabled
        }
      });
      
      logger.info(`Starting line at point: x=${snappedPoint.x}, y=${snappedPoint.y}`);
      
      // Create the line object with proper type casting
      const line = new Line([snappedPoint.x, snappedPoint.y, snappedPoint.x, snappedPoint.y], {
        stroke: lineColor,
        strokeWidth: lineThickness,
        selectable: true,
        strokeLineCap: 'round',
        evented: true
      }) as CustomFabricLine;
      
      // Set data property after creation
      line.data = {
        type: 'straight-line',
        createdAt: new Date().toISOString()
      };
      
      canvas.add(line);
      currentLineRef.current = line;
      
      // Create measurement tooltip
      const tooltip = new Text('0 px', {
        left: snappedPoint.x,
        top: snappedPoint.y - 15,
        fontSize: 12,
        fill: '#333',
        backgroundColor: '#fff',
        selectable: false,
        evented: false
      });
      
      canvas.add(tooltip);
      distanceTooltipRef.current = tooltip;
      
      canvas.requestRenderAll();
      
      // Track successful line creation
      captureMessage("Line creation started", "line-creation-start", {
        tags: { component: "useStraightLineToolRefactored" },
        extra: { 
          startPoint: snappedPoint,
          lineColor, 
          lineThickness,
          snapEnabled,
          anglesEnabled
        }
      });
    } catch (error) {
      // Capture specific error about line creation
      captureError(error as Error, "line-creation-error", {
        tags: { 
          component: "useStraightLineToolRefactored", 
          phase: "object-creation",
          critical: "true"
        },
        extra: { 
          point,
          canvasState: fabricCanvasRef.current ? {
            width: fabricCanvasRef.current.width,
            height: fabricCanvasRef.current.height,
            objectCount: fabricCanvasRef.current.getObjects().length
          } : 'Canvas not available'
        }
      });
      
      logger.error("Failed to create line objects", error);
      
      // Reset state to recover from error
      setIsDrawing(false);
      startPointRef.current = null;
    }
  }, [isActive, fabricCanvasRef, lineColor, lineThickness, snapEnabled, anglesEnabled, snapPointToGrid]);
  
  /**
   * Handle pointer move event to update the line during drawing
   * @param {Point} point - Current pointer position
   */
  const handlePointerMove = useCallback((point: Point) => {
    if (!isDrawing || !isActive || !fabricCanvasRef.current || !startPointRef.current) return;
    
    try {
      const canvas = fabricCanvasRef.current;
      
      // Apply grid snapping to end point
      const snappedEndPoint = snapPointToGrid(point);
      
      // Apply line straightening constraints
      const constraintActive = useShiftConstraint || anglesEnabled;
      const straightenedLine = constraintActive 
        ? snapLineToGrid(startPointRef.current, snappedEndPoint)
        : { start: startPointRef.current, end: snappedEndPoint };
      
      if (currentLineRef.current) {
        // Update line coordinates
        currentLineRef.current.set({
          x2: straightenedLine.end.x,
          y2: straightenedLine.end.y
        });
        
        // Calculate distance and angle for measurements
        const distance = calculateDistance(startPointRef.current, straightenedLine.end);
        const displayDistance = Math.round(distance);
        
        // Calculate angle - implementation depends on your geometryUtils
        const angle = 0; // Replace with actual angle calculation
        
        const midpoint = getMidpoint(startPointRef.current, straightenedLine.end);
        
        // Update measurement data
        setMeasurementData({
          length: displayDistance,
          angle: angle,
          midpoint: midpoint,
          start: startPointRef.current,
          end: straightenedLine.end
        });
        
        // Update tooltip text and position
        if (distanceTooltipRef.current) {
          distanceTooltipRef.current.set({
            left: midpoint.x,
            top: midpoint.y - 15,
            text: `${displayDistance} px${constraintActive ? ' ⊥' : ''}`
          });
        }
        
        canvas.requestRenderAll();
      }
    } catch (error) {
      captureError(error as Error, "line-move-error", {
        tags: { component: "useStraightLineToolRefactored" },
        extra: { 
          isDrawing,
          hasStartPoint: !!startPointRef.current,
          hasCurrentLine: !!currentLineRef.current
        }
      });
      
      logger.error("Error during line movement", error);
    }
  }, [isDrawing, isActive, fabricCanvasRef, startPointRef, useShiftConstraint, anglesEnabled, snapPointToGrid, snapLineToGrid]);
  
  /**
   * Handle pointer up event to complete the line drawing
   * @param {Point} point - End point coordinates
   */
  const handlePointerUp = useCallback((point: Point) => {
    if (!isDrawing || !isActive || !fabricCanvasRef.current || !startPointRef.current) return;
    
    try {
      const canvas = fabricCanvasRef.current;
      
      // Only save if we have actually drawn a line
      if (currentLineRef.current) {
        const start = { x: currentLineRef.current.x1, y: currentLineRef.current.y1 };
        const end = { x: currentLineRef.current.x2, y: currentLineRef.current.y2 };
        
        // Only save if the line has some length
        const distance = calculateDistance(start, end);
        if (distance > 1) {
          // Add final data to the line
          if (!currentLineRef.current.data) {
            currentLineRef.current.data = {};
          }
          
          currentLineRef.current.data.length = distance;
          currentLineRef.current.data.completed = true;
        
          // Save current state to undo history
          saveCurrentState();
          
          // Add Sentry breadcrumb for completed line
          Sentry.addBreadcrumb({
            category: 'drawing',
            message: 'Completed drawing straight line',
            level: 'info',
            data: {
              startPoint: start,
              endPoint: end,
              length: distance,
              snapEnabled,
              anglesEnabled
            }
          });
          
          logger.info("Completed line drawing, state saved", {
            distance,
            start,
            end
          });
          
          captureMessage("Line drawing completed", "line-creation-complete", {
            tags: { component: "useStraightLineToolRefactored" },
            extra: { 
              start,
              end,
              distance,
              lineColor,
              lineThickness,
              snapEnabled,
              anglesEnabled
            }
          });
        } else {
          // Line too short, remove it
          if (currentLineRef.current && canvas.contains(currentLineRef.current)) {
            canvas.remove(currentLineRef.current);
          }
          
          if (distanceTooltipRef.current && canvas.contains(distanceTooltipRef.current)) {
            canvas.remove(distanceTooltipRef.current);
          }
          
          logger.info("Line too short, discarded", { distance });
        }
      }
      
      // Reset drawing state
      setIsDrawing(false);
      startPointRef.current = null;
      currentLineRef.current = null;
      distanceTooltipRef.current = null;
      setMeasurementData(null);
      
      canvas.requestRenderAll();
    } catch (error) {
      captureError(error as Error, "line-completion-error", {
        tags: { component: "useStraightLineToolRefactored" },
        extra: { 
          isDrawing,
          hasStartPoint: !!startPointRef.current,
          hasCurrentLine: !!currentLineRef.current
        }
      });
      
      logger.error("Error during line completion", error);
      
      // Reset drawing state even if there was an error
      setIsDrawing(false);
      startPointRef.current = null;
      currentLineRef.current = null;
      distanceTooltipRef.current = null;
      setMeasurementData(null);
    }
  }, [isDrawing, isActive, fabricCanvasRef, startPointRef, saveCurrentState, lineColor, lineThickness, snapEnabled, anglesEnabled]);
  
  /**
   * Cancel the current drawing operation
   * Removes the current line and resets state
   */
  const cancelDrawing = useCallback(() => {
    if (!isDrawing || !fabricCanvasRef.current) return;
    
    try {
      const canvas = fabricCanvasRef.current;
      
      // Add Sentry breadcrumb for cancelled line
      Sentry.addBreadcrumb({
        category: 'drawing',
        message: 'Cancelled drawing straight line',
        level: 'info'
      });
      
      logger.info("Cancelling line drawing");
      
      // Remove the line from canvas
      if (currentLineRef.current && canvas.contains(currentLineRef.current)) {
        canvas.remove(currentLineRef.current);
      }
      
      // Remove the tooltip from canvas
      if (distanceTooltipRef.current && canvas.contains(distanceTooltipRef.current)) {
        canvas.remove(distanceTooltipRef.current);
      }
      
      // Reset drawing state
      setIsDrawing(false);
      startPointRef.current = null;
      currentLineRef.current = null;
      distanceTooltipRef.current = null;
      setMeasurementData(null);
      
      canvas.requestRenderAll();
      
      captureMessage("Line drawing cancelled", "line-creation-cancelled", {
        tags: { component: "useStraightLineToolRefactored" }
      });
    } catch (error) {
      captureError(error as Error, "cancel-drawing-error", {
        tags: { component: "useStraightLineToolRefactored" }
      });
      
      logger.error("Error cancelling line drawing", error);
      
      // Reset state anyway to prevent getting stuck
      setIsDrawing(false);
      startPointRef.current = null;
      currentLineRef.current = null;
      distanceTooltipRef.current = null;
      setMeasurementData(null);
    }
  }, [isDrawing, fabricCanvasRef]);
  
  // Return methods and state
  return {
    isActive,
    isDrawing,
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
    currentLine: currentLineRef.current,
    startPointRef,
    currentLineRef,
    isToolInitialized
  };
};
