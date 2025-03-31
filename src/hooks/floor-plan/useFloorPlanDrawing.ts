
/**
 * Custom hook for handling floor plan drawing and editing
 * Integrates Fabric.js for interactive drawing capabilities
 * @module useFloorPlanDrawing
 */
import { useState, useCallback } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import logger from '@/utils/logger';
import type { FloorPlan, Stroke, StrokeTypeLiteral } from '@/types/floorPlanTypes';
import type { Point } from '@/types/core/Point';
import { useSnapToGrid } from '@/hooks/useSnapToGrid';

/**
 * Props for the useFloorPlanDrawing hook
 * @interface UseFloorPlanDrawingProps
 */
interface UseFloorPlanDrawingProps {
  /** Reference to the Fabric canvas instance */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Current drawing tool */
  tool: DrawingMode;
  /** Initial line color */
  initialLineColor?: string;
  /** Initial line thickness */
  initialLineThickness?: number;
  /** Floor plans array (for multiple floors) */
  floorPlans?: FloorPlan[];
  /** Current floor index */
  currentFloor?: number;
  /** Set floor plans function */
  setFloorPlans?: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  /** Single floor plan (for single floor mode) */
  floorPlan?: FloorPlan;
  /** Set floor plan function (for single floor mode) */
  setFloorPlan?: React.Dispatch<React.SetStateAction<FloorPlan>>;
  /** Set gross internal area function */
  setGia?: React.Dispatch<React.SetStateAction<number>>;
}

/**
 * Result type for the useFloorPlanDrawing hook
 * @interface UseFloorPlanDrawingResult
 */
interface UseFloorPlanDrawingResult {
  /** Draw a floor plan on canvas */
  drawFloorPlan: (canvas: FabricCanvas, floorPlan: FloorPlan) => void;
  /** Whether currently drawing */
  isDrawing: boolean;
  /** Current drawing points */
  drawingPoints: Point[];
  /** Current point */
  currentPoint: Point | null;
  /** Start drawing at point */
  startDrawing: (point: Point) => void;
  /** Start drawing at point (alias) */
  startDrawingAt: (point: Point) => void;
  /** Continue drawing to point */
  continueDrawing: (point: Point) => void;
  /** End drawing at point */
  endDrawing: (point: Point) => void;
  /** Cancel drawing */
  cancelDrawing: () => void;
  /** Add stroke directly */
  addStroke: (stroke: Stroke) => void;
  /** Calculate areas from floor plan */
  calculateAreas: () => number[];
}

/**
 * Custom hook for managing floor plan drawing and editing
 * Integrates various canvas functionalities and sub-hooks
 * 
 * @param {UseFloorPlanDrawingProps} props - Hook properties
 * @returns {UseFloorPlanDrawingResult} Drawing management utilities
 */
export const useFloorPlanDrawing = (
  props: UseFloorPlanDrawingProps
): UseFloorPlanDrawingResult => {
  const { fabricCanvasRef, tool } = props;
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingPoints, setDrawingPoints] = useState<Point[]>([]);
  const [currentPoint, setCurrentPoint] = useState<Point | null>(null);
  
  // Use snapping functionality
  const { snapPointToGrid } = useSnapToGrid();
  
  /**
   * Draw a floor plan on the canvas
   * @param {FabricCanvas} canvas - The fabric canvas instance
   * @param {FloorPlan} floorPlan - Floor plan data to draw
   */
  const drawFloorPlan = useCallback((canvas: FabricCanvas, floorPlan: FloorPlan): void => {
    logger.info(`Drawing floor plan: ${floorPlan.id}`);
    
    // Implementation would go here in a real system
    // For now this is just a stub since the original function is missing
    
    try {
      // Clear existing objects except grid
      const objectsToRemove = canvas.getObjects().filter(obj => {
        // Skip grid objects or other special objects if needed
        return !(obj as any).isGrid;
      });
      
      if (objectsToRemove.length > 0) {
        canvas.remove(...objectsToRemove);
      }
      
      // Draw strokes from floorPlan if available
      if (floorPlan.strokes && Array.isArray(floorPlan.strokes)) {
        logger.info(`Drawing ${floorPlan.strokes.length} strokes`);
        
        // Loop through floor plan strokes and add them to canvas
        // Implementation depends on stroke format
      }
      
      canvas.renderAll();
    } catch (error) {
      logger.error('Error drawing floor plan:', error);
    }
  }, []);
  
  /**
   * Start drawing at a point
   * @param {Point} point - Starting point
   */
  const startDrawing = useCallback((point: Point): void => {
    // Apply grid snapping if enabled
    const snappedPoint = snapPointToGrid(point);
    
    setIsDrawing(true);
    setDrawingPoints([snappedPoint]);
    setCurrentPoint(snappedPoint);
  }, [snapPointToGrid]);
  
  /**
   * Alias for startDrawing
   * @param {Point} point - Starting point
   */
  const startDrawingAt = useCallback((point: Point): void => {
    startDrawing(point);
  }, [startDrawing]);
  
  /**
   * Continue drawing to a point
   * @param {Point} point - Next point
   */
  const continueDrawing = useCallback((point: Point): void => {
    if (!isDrawing) return;
    
    // Apply grid snapping if enabled
    const snappedPoint = snapPointToGrid(point);
    
    setDrawingPoints(prev => [...prev, snappedPoint]);
    setCurrentPoint(snappedPoint);
  }, [isDrawing, snapPointToGrid]);
  
  /**
   * End drawing at a point
   * @param {Point} point - Ending point
   */
  const endDrawing = useCallback((point: Point): void => {
    if (!isDrawing) return;
    
    // Apply grid snapping if enabled
    const snappedPoint = snapPointToGrid(point);
    
    setDrawingPoints(prev => [...prev, snappedPoint]);
    setCurrentPoint(null);
    setIsDrawing(false);
    
    // Save the drawing
    if (props.setFloorPlan && props.floorPlan) {
      props.setFloorPlan(prev => ({
        ...prev,
        strokes: [
          ...prev.strokes,
          {
            id: `stroke-${Date.now()}`,
            points: [...drawingPoints, snappedPoint],
            type: 'line' as StrokeTypeLiteral,
            color: '#000000',
            thickness: 2,
            width: 2
          }
        ]
      }));
    } else if (props.setFloorPlans && props.floorPlans && typeof props.currentFloor === 'number') {
      props.setFloorPlans(prev => {
        const newFloorPlans = [...prev];
        const currentFloorPlan = newFloorPlans[props.currentFloor as number];
        if (currentFloorPlan) {
          newFloorPlans[props.currentFloor as number] = {
            ...currentFloorPlan,
            strokes: [
              ...currentFloorPlan.strokes,
              {
                id: `stroke-${Date.now()}`,
                points: [...drawingPoints, snappedPoint],
                type: 'line' as StrokeTypeLiteral,
                color: '#000000',
                thickness: 2,
                width: 2
              }
            ]
          };
        }
        return newFloorPlans;
      });
    }
  }, [isDrawing, props, drawingPoints, snapPointToGrid]);
  
  /**
   * Cancel the current drawing
   */
  const cancelDrawing = useCallback((): void => {
    setIsDrawing(false);
    setDrawingPoints([]);
    setCurrentPoint(null);
  }, []);
  
  /**
   * Add a stroke directly to the floor plan
   * @param {Stroke} stroke - Stroke to add
   */
  const addStroke = useCallback((stroke: Stroke): void => {
    if (props.setFloorPlan && props.floorPlan) {
      props.setFloorPlan(prev => ({
        ...prev,
        strokes: [...prev.strokes, stroke]
      }));
    } else if (props.setFloorPlans && props.floorPlans && typeof props.currentFloor === 'number') {
      props.setFloorPlans(prev => {
        const newFloorPlans = [...prev];
        const currentFloorPlan = newFloorPlans[props.currentFloor as number];
        if (currentFloorPlan) {
          newFloorPlans[props.currentFloor as number] = {
            ...currentFloorPlan,
            strokes: [...currentFloorPlan.strokes, stroke]
          };
        }
        return newFloorPlans;
      });
    }
  }, [props]);
  
  /**
   * Calculate areas from the floor plan
   * @returns {number[]} Array of area values
   */
  const calculateAreas = useCallback((): number[] => {
    // Implementation would calculate areas from the floor plan
    // This is a stub
    const areas: number[] = [];
    
    if (props.floorPlan) {
      // Calculate from single floor plan
      // For now, just return a mock value
      areas.push(100);
    } else if (props.floorPlans && typeof props.currentFloor === 'number') {
      // Calculate from multiple floor plans
      const currentFloorPlan = props.floorPlans[props.currentFloor];
      if (currentFloorPlan) {
        // For now, just return a mock value
        areas.push(100);
      }
    }
    
    return areas;
  }, [props]);
  
  return {
    drawFloorPlan,
    isDrawing,
    drawingPoints,
    currentPoint,
    startDrawing,
    startDrawingAt,
    continueDrawing,
    endDrawing,
    cancelDrawing,
    addStroke,
    calculateAreas
  };
};
