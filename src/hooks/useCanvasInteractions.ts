/**
 * Custom hook for handling canvas interactions
 * Manages drawing events, path creation, and shape processing
 * @module useCanvasInteractions
 */
import { useState, useCallback, useEffect } from "react";
import { Canvas as FabricCanvas, Object as FabricObject, Path as FabricPath, Polyline } from "fabric";
import { DrawingTool } from "./useCanvasState";
import { Point } from '@/types/geometryTypes';
import { GRID_SPACING } from "@/constants/numerics";
import { isExactGridMultiple } from "@/utils/geometry/pointOperations";

/**
 * Props for the useCanvasInteractions hook
 * @interface UseCanvasInteractionsProps
 */
interface UseCanvasInteractionsProps {
  /** Reference to the Fabric canvas instance */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Current active drawing tool */
  tool: DrawingTool;
  /** Current line thickness */
  lineThickness?: number;
  /** Current line color */
  lineColor?: string;
}

/**
 * Result type for the useCanvasInteractions hook
 * @interface UseCanvasInteractionsResult
 */
interface UseCanvasInteractionsResult {
  /** Current drawing state */
  drawingState: any;
  /** Current zoom level */
  currentZoom: number;
  /** Function to toggle snap to grid */
  toggleSnap: () => void;
  /** Whether snap to grid is enabled */
  snapEnabled: boolean;
}

/**
 * Hook for managing canvas interactions like drawing, selecting, and grid snapping
 * 
 * @param {UseCanvasInteractionsProps} props - Hook properties
 * @returns {UseCanvasInteractionsResult} Drawing state and handlers
 */
export const useCanvasInteractions = (props: UseCanvasInteractionsProps): UseCanvasInteractionsResult => {
  const {
    fabricCanvasRef,
    tool,
    lineThickness = 2,
    lineColor = '#000000'
  } = props;

  const [snapEnabled, setSnapEnabled] = useState(true);
  const [currentZoom, setCurrentZoom] = useState(1);
  const [drawingState, setDrawingState] = useState({
    isDrawing: false,
    points: [],
    currentPath: null,
    startX: 0,
    startY: 0
  });

  /**
   * Toggle snap to grid
   */
  const toggleSnap = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);

  /**
   * Snap a coordinate to the grid
   * @param {number} value - The coordinate value
   * @returns {number} Snapped coordinate value
   */
  const snapToGrid = useCallback((value: number): number => {
    if (!snapEnabled) return value;

    const gridSize = GRID_SPACING;
    const snappedValue = Math.round(value / gridSize) * gridSize;
    return snappedValue;
  }, [snapEnabled]);

  /**
   * Snap a point to the grid
   * @param {Point} point - The point to snap
   * @returns {Point} Snapped point
   */
  const snapPointToGrid = useCallback((point: Point): Point => {
    return {
      x: snapToGrid(point.x),
      y: snapToGrid(point.y)
    };
  }, [snapToGrid]);

  /**
   * Check if a point is on the grid
   * @param {Point} point - The point to check
   * @returns {boolean} True if the point is on the grid
   */
  const isPointOnGrid = useCallback((point: Point): boolean => {
    return isExactGridMultiple(point.x, GRID_SPACING) && isExactGridMultiple(point.y, GRID_SPACING);
  }, []);

  /**
   * Find the closest point on a polyline to a given point
   * @param {Point} point - The point to find the closest point to
   * @param {Polyline} polyline - The polyline to find the closest point on
   * @returns {Point | null} The closest point on the polyline, or null if the polyline has no points
   */
  const findClosestPointOnPolyline = useCallback((point: Point, polyline: Polyline): Point | null => {
    if (!polyline.points || polyline.points.length === 0) {
      return null;
    }

    let closestPoint: Point | null = null;
    let minDistance = Infinity;

    for (let i = 0; i < polyline.points.length - 1; i++) {
      const start = polyline.points[i];
      const end = polyline.points[i + 1];

      // Calculate distance from point to line segment
      const dx = end.x - start.x;
      const dy = end.y - start.y;

      const length = dx * dx + dy * dy;
      let t = ((point.x - start.x) * dx + (point.y - start.y) * dy) / length;

      t = Math.max(0, Math.min(1, t));

      const closestX = start.x + t * dx;
      const closestY = start.y + t * dy;

      const distance = Math.sqrt((point.x - closestX) ** 2 + (point.y - closestY) ** 2);

      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = { x: closestX, y: closestY };
      }
    }

    return closestPoint;
  }, []);

  /**
   * Create a point from a line object
   * @param line The line object
   * @returns The created point
   */
  const createPointFromLine = (line: { start: Point; end: Point }): Point => {
    return {
      x: (line.start.x + line.end.x) / 2,
      y: (line.start.y + line.end.y) / 2
    };
  };

  /**
   * Handle mouse down event on the canvas
   * @param {Point} point - The point where the mouse was pressed
   */
  const handleMouseDown = useCallback((point: Point) => {
    if (!fabricCanvasRef.current) return;

    const snappedPoint = snapPointToGrid(point);

    setDrawingState(prevState => ({
      ...prevState,
      isDrawing: true,
      points: [snappedPoint],
      startX: snappedPoint.x,
      startY: snappedPoint.y
    }));

    // Start drawing path
    const path = new FabricPath(`M ${snappedPoint.x} ${snappedPoint.y} L ${snappedPoint.x} ${snappedPoint.y}`, {
      stroke: lineColor,
      strokeWidth: lineThickness,
      fill: null,
      objectCaching: false
    });

    fabricCanvasRef.current.add(path);
    fabricCanvasRef.current.setActiveObject(path);

    setDrawingState(prevState => ({
      ...prevState,
      currentPath: path
    }));
  }, [snapPointToGrid, lineColor, lineThickness, fabricCanvasRef]);

  /**
   * Handle mouse move event on the canvas
   * @param {Point} point - The current mouse position
   */
  const handleMouseMove = useCallback((point: Point) => {
    if (!fabricCanvasRef.current || !drawingState.isDrawing) return;

    const snappedPoint = snapPointToGrid(point);

    // Extend the current path
    const currentPath = drawingState.currentPath;
    if (currentPath) {
      const newPathData = currentPath.path;
      newPathData.push(['L', snappedPoint.x, snappedPoint.y]);
      currentPath.set({ path: newPathData });
      fabricCanvasRef.current.requestRenderAll();
    }

    setDrawingState(prevState => ({
      ...prevState,
      points: [...prevState.points, snappedPoint]
    }));
  }, [snapPointToGrid, drawingState, fabricCanvasRef]);

  /**
   * Handle mouse up event on the canvas
   */
  const handleMouseUp = useCallback(() => {
    setDrawingState(prevState => ({
      ...prevState,
      isDrawing: false,
      currentPath: null
    }));
  }, []);

  /**
   * Handle object selection event on the canvas
   */
  const handleObjectSelected = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    setCurrentZoom(fabricCanvasRef.current.getZoom());
  }, [fabricCanvasRef]);

  /**
   * Handle canvas zoom event
   */
  const handleZoom = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    setCurrentZoom(fabricCanvasRef.current.getZoom());
  }, [fabricCanvasRef]);

  useEffect(() => {
    if (!fabricCanvasRef.current) return;

    fabricCanvasRef.current.on('object:selected', handleObjectSelected);
    fabricCanvasRef.current.on('before:zoom', handleZoom);

    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.off('object:selected', handleObjectSelected);
        fabricCanvasRef.current.off('before:zoom', handleZoom);
      }
    };
  }, [fabricCanvasRef, handleObjectSelected, handleZoom]);

  return {
    drawingState,
    currentZoom,
    toggleSnap,
    snapEnabled
  };
};
