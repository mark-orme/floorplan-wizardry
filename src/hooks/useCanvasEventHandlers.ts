import { useCallback, useEffect, useRef } from 'react';
import { Canvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { Point } from '@/types/core/Point';
import { addCanvasEvent, removeCanvasEvent } from '@/utils/canvas/eventHandlers';
import { toStartEndFormat, getStartPoint, getEndPoint } from '@/utils/lineAdapter';
import { GRID_CONSTANTS } from '@/constants/gridConstants';

interface UseCanvasEventHandlersProps {
  canvas: Canvas | null;
  drawingMode: DrawingMode;
  lineColor: string;
  lineWidth: number;
  snapToGrid: boolean;
  snapLineToGrid?: (startPoint: Point, endPoint: Point) => { startPoint: Point; endPoint: Point };
  onObjectModified?: (obj: fabric.Object) => void;
  onPathCreated?: (path: fabric.Path) => void;
}

/**
 * Custom hook for managing Fabric.js canvas event handlers.
 * This hook encapsulates the logic for attaching and detaching event listeners
 * to a Fabric.js canvas instance, and provides a way to interact with the canvas
 * through a set of event handling functions.
 *
 * @param {UseCanvasEventHandlersProps} props - The properties for the hook.
 * @returns {object} - An object containing the event handling functions.
 */
export const useCanvasEventHandlers = ({
  canvas,
  drawingMode,
  lineColor,
  lineWidth,
  snapToGrid,
  snapLineToGrid,
  onObjectModified,
  onPathCreated
}: UseCanvasEventHandlersProps) => {
  const isDrawingRef = useRef(false);

  /**
   * Handle object modification events
   */
  const handleObjectModified = useCallback((event: any) => {
    if (event && event.target) {
      onObjectModified?.(event.target);
    }
  }, [onObjectModified]);

  /**
   * Initialize event handlers
   */
  useEffect(() => {
    if (!canvas) return;

    // Add event listeners
    addCanvasEvent(canvas, 'object:modified', handleObjectModified);

    // Cleanup event listeners on unmount
    return () => {
      removeCanvasEvent(canvas, 'object:modified', handleObjectModified);
    };
  }, [canvas, handleObjectModified]);

  /**
   * Handle drawing mode changes
   */
  useEffect(() => {
    if (!canvas) return;

    // Set drawing mode based on the selected tool
    canvas.isDrawingMode = drawingMode === DrawingMode.DRAW;

    // Update brush settings
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = lineColor;
      canvas.freeDrawingBrush.width = lineWidth;
    }
  }, [canvas, drawingMode, lineColor, lineWidth]);

  /**
   * Handle line drawing events
   */
  const {
    handleLineDrawingMouseDown,
    handleLineDrawingMouseMove,
    completeLine
  } = useLineDrawingEvents(canvas, {
    drawingMode,
    lineColor,
    lineWidth,
    snapToGrid,
    snapLineToGrid,
    onPathCreated,
    isDrawingRef
  });

  /**
   * Attach line drawing event handlers
   */
  useEffect(() => {
    if (!canvas) return;

    // Add event listeners for line drawing
    addCanvasEvent(canvas, 'mouse:down', handleLineDrawingMouseDown);
    addCanvasEvent(canvas, 'mouse:move', handleLineDrawingMouseMove);
    addCanvasEvent(canvas, 'mouse:up', completeLine);
    addCanvasEvent(canvas, 'mouse:out', completeLine);

    // Remove event listeners on unmount
    return () => {
      removeCanvasEvent(canvas, 'mouse:down', handleLineDrawingMouseDown);
      removeCanvasEvent(canvas, 'mouse:move', handleLineDrawingMouseMove);
      removeCanvasEvent(canvas, 'mouse:up', completeLine);
      removeCanvasEvent(canvas, 'mouse:out', completeLine);
    };
  }, [canvas, drawingMode, handleLineDrawingMouseDown, handleLineDrawingMouseMove, completeLine]);

  return {
    handleObjectModified
  };
};

interface UseLineDrawingEventsProps {
  drawingMode: DrawingMode;
  lineColor: string;
  lineWidth: number;
  snapToGrid: boolean;
  snapLineToGrid?: (startPoint: Point, endPoint: Point) => { startPoint: Point; endPoint: Point };
  onPathCreated?: (path: fabric.Path) => void;
  isDrawingRef: React.MutableRefObject<boolean>;
}

/**
 * Manages line drawing events on the canvas.
 * This hook is responsible for handling the mouse events that allow
 * the user to draw lines on the canvas.
 *
 * @param {Canvas | null} canvas - The Fabric.js canvas instance.
 * @param {UseLineDrawingEventsProps} options - Configuration options for line drawing.
 * @returns {object} - An object containing the event handling functions.
 */
export function useLineDrawingEvents(
  canvas: Canvas | null,
  options: {
    drawingMode: DrawingMode;
    lineColor: string;
    lineWidth: number;
    snapToGrid: boolean;
    snapLineToGrid?: (startPoint: Point, endPoint: Point) => { startPoint: Point; endPoint: Point };
    onPathCreated?: (path: fabric.Path) => void;
    isDrawingRef: React.MutableRefObject<boolean>;
  }
) {
  const {
    drawingMode,
    lineColor,
    lineWidth,
    snapToGrid,
    snapLineToGrid,
    onPathCreated,
    isDrawingRef
  } = options;

  const startPointRef = useRef<Point | null>(null);
  const lineRef = useRef<fabric.Line | null>(null);

  /**
   * Handle mouse down event
   */
  const handleLineDrawingMouseDown = useCallback((event: any) => {
    if (drawingMode !== DrawingMode.LINE || !canvas) return;

    isDrawingRef.current = true;
    const pointer = canvas.getPointer(event.e);
    const x = pointer.x;
    const y = pointer.y;
    startPointRef.current = { x, y };

    const line = new fabric.Line([x, y, x, y], {
      stroke: lineColor,
      strokeWidth: lineWidth,
      selectable: false,
      evented: false,
      hasControls: false,
      hasBorders: false,
      originX: 'center',
      originY: 'center'
    });

    lineRef.current = line;
    canvas.add(line);
  }, [canvas, drawingMode, lineColor, lineWidth]);

  /**
   * Draw line
   */
  const drawLine = useCallback((startPoint: Point, currentPoint: Point) => {
    if (!canvas || !lineRef.current) return;

    lineRef.current.set({
      x1: startPoint.x,
      y1: startPoint.y,
      x2: currentPoint.x,
      y2: currentPoint.y
    });

    canvas.requestRenderAll();
  }, [canvas]);

  /**
   * Handle line drawing mouse move event
   */
  const handleLineDrawingMouseMove = useCallback((event: any) => {
    if (!isDrawingRef.current || !canvas || !startPointRef.current) return;

    const currentPoint = canvas.getPointer(event.e);
    const startPoint = startPointRef.current;

    if (snapToGrid && snapLineToGrid) {
      const snappedLine = snapLineToGrid(startPoint, currentPoint);
      
      // Convert to start/end format if needed for consistent access
      const lineWithStartEnd = toStartEndFormat({
        startPoint: snappedLine.startPoint,
        endPoint: snappedLine.endPoint
      });
      
      // Now we can safely use start and end properties
      drawLine(lineWithStartEnd.start, lineWithStartEnd.end);
    } else {
      drawLine(startPoint, currentPoint);
    }
  }, [canvas, drawLine, snapLineToGrid, snapToGrid]);

  /**
   * Finalize line
   */
  const finalizeLine = useCallback((startPoint: Point, currentPoint: Point) => {
    if (!canvas || !lineRef.current) return;

    isDrawingRef.current = false;
    lineRef.current.set({
      evented: true,
      selectable: true,
      hasControls: true,
      hasBorders: true
    });

    if (snapToGrid && snapLineToGrid) {
      const snappedLine = snapLineToGrid(startPoint, currentPoint);
      
      // Convert to start/end format for consistent access
      const lineWithStartEnd = toStartEndFormat({
        startPoint: snappedLine.startPoint,
        endPoint: snappedLine.endPoint
      });
      
      // Now we can safely use start and end properties
      finalizeLine(lineWithStartEnd.start, lineWithStartEnd.end);
    } else {
      finalizeLine(startPoint, currentPoint);
    }

    canvas.requestRenderAll();
    onPathCreated?.(lineRef.current);
    startPointRef.current = null;
    lineRef.current = null;
  }, [canvas, onPathCreated, snapLineToGrid, snapToGrid]);

  /**
   * Complete line
   */
  const completeLine = useCallback(() => {
    if (!isDrawingRef.current) return;

    if (startPointRef.current && lineRef.current) {
      const currentPoint = { x: lineRef.current.x2 || 0, y: lineRef.current.y2 || 0 };
      const startPoint = startPointRef.current;
      finalizeLine(startPoint, currentPoint);
    }

    isDrawingRef.current = false;
    startPointRef.current = null;
    lineRef.current = null;
  }, [finalizeLine]);

  return {
    handleLineDrawingMouseDown,
    handleLineDrawingMouseMove,
    completeLine
  };
}
