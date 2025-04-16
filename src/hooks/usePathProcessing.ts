/**
 * Path processing hook
 * Handles processing of drawing paths
 * @module hooks/usePathProcessing
 */
import { useCallback } from 'react';
import { Canvas as FabricCanvas, Path as FabricPath, Object as FabricObject, Line } from 'fabric';
import { FloorPlan, Stroke, StrokeTypeLiteral } from '@/types/floorPlanTypes';
import { DrawingTool } from '@/types/core/DrawingTool';
import { Point } from '@/types/drawingTypes';
import { v4 as uuidv4 } from 'uuid';
import { isStraightPath, straightenPath } from '@/utils/geometry/pathStraightening';
import { useDrawingContext } from '@/contexts/DrawingContext';
import { DrawingMode } from '@/constants/drawingModes';

/**
 * Minimum stroke length for processing
 */
const MIN_STROKE_LENGTH = 5;

/**
 * Props for the path processing hook
 */
export interface UsePathProcessingProps {
  /** Reference to the fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Reference to the grid layer objects */
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  /** Reference to the history object (optional) */
  historyRef?: React.MutableRefObject<{past: FabricObject[][], future: FabricObject[][]}>;
  /** Current drawing tool (optional) */
  tool?: DrawingTool;
  /** Function to set floor plans */
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  /** Current floor index */
  currentFloor: number;
  /** Function to set gross internal area (optional) */
  setGia?: React.Dispatch<React.SetStateAction<number>>;
}

/**
 * Extract points from a path object
 * 
 * @param path - Fabric path object
 * @returns Array of point coordinates
 */
const extractPointsFromPath = (path: FabricPath): Point[] => {
  const points: Point[] = [];
  const pathData = path.path;
  
  if (!pathData || !Array.isArray(pathData)) {
    return points;
  }
  
  // Extract points from path data
  // This is a simplified version
  for (let i = 0; i < pathData.length; i++) {
    const segment = pathData[i];
    if (segment[0] === 'L' || segment[0] === 'M') {
      points.push({ x: segment[1], y: segment[2] });
    }
  }
  
  return points;
};

/**
 * Convert drawing tool to stroke type
 * @param tool - The drawing tool
 * @returns The corresponding stroke type
 */
const drawingToolToStrokeType = (tool?: DrawingTool): StrokeTypeLiteral => {
  if (!tool) return 'line';
  
  // Map drawing tools to stroke types
  switch (tool) {
    case 'wall':
      return 'wall';
    case 'room':
      return 'line'; // Changed from 'room' to 'line' to match StrokeTypeLiteral
    case 'line':
      return 'line';
    case 'draw':
      return 'line'; // Changed from 'freehand' to 'line' to match StrokeTypeLiteral
    default:
      return 'line';
  }
};

/**
 * Hook for processing drawing paths
 * 
 * @param props - Hook properties
 * @returns Path processing utilities
 */
export const usePathProcessing = ({
  fabricCanvasRef,
  gridLayerRef,
  historyRef,
  tool,
  setFloorPlans,
  currentFloor,
  setGia
}: UsePathProcessingProps) => {
  // Get drawing context to access snapToGrid setting
  const { snapToGrid } = useDrawingContext();
  
  const processCreatedPath = useCallback((path: FabricPath) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !path) return;
    
    // Extract points from the path
    const points = extractPointsFromPath(path);
    
    // Skip if path is too short
    if (points.length < MIN_STROKE_LENGTH) {
      canvas.remove(path);
      return;
    }
    
    // Check if the path is nearly straight
    const isNearlyStraight = isStraightPath(points);
    
    // Create stroke data
    let stroke: Stroke;
    
    // If nearly straight, convert to a straight line
    if (isNearlyStraight && tool === 'draw') {
      // Remove the original path
      canvas.remove(path);
      
      // Get straightened endpoints
      const { start, end } = straightenPath(points, snapToGrid);
      
      // Create a Fabric.js Line
      const line = new Line([start.x, start.y, end.x, end.y], {
        stroke: path.stroke?.toString() || '#000000',
        strokeWidth: path.strokeWidth || 1,
        selectable: true,
        evented: true,
        objectType: 'straight-line'
      });
      
      // Add the line to canvas
      canvas.add(line);
      
      // Create stroke with just the endpoints
      stroke = {
        id: uuidv4(),
        points: [start, end],
        type: 'line',
        color: path.stroke?.toString() || '#000000',
        thickness: path.strokeWidth || 1,
        width: path.strokeWidth || 1
      };
    } else {
      // Handle as normal path
      stroke = {
        id: uuidv4(),
        points,
        type: drawingToolToStrokeType(tool),
        color: path.stroke?.toString() || '#000000',
        thickness: path.strokeWidth || 1,
        width: path.strokeWidth || 1
      };
      
      // Apply styling based on tool type
      const strokeOptions = {
        stroke: stroke.color,
        strokeWidth: stroke.thickness,
        fill: 'transparent',
        opacity: 1,
        selectable: true,
        objectCaching: true
      };
      
      // Apply path properties from stroke options
      Object.keys(strokeOptions).forEach(key => {
        // Type assertion to access properties dynamically
        (path as any)[key] = (strokeOptions as any)[key];
      });
    }
    
    // Update floor plans with the new stroke
    setFloorPlans(prevFloorPlans => {
      const updatedFloorPlans = [...prevFloorPlans];
      
      if (updatedFloorPlans[currentFloor]) {
        // Update existing floor plan
        updatedFloorPlans[currentFloor] = {
          ...updatedFloorPlans[currentFloor],
          strokes: [
            ...updatedFloorPlans[currentFloor].strokes,
            stroke
          ],
          updatedAt: new Date().toISOString()
        };
      }
      
      return updatedFloorPlans;
    });
    
    canvas.renderAll();
  }, [fabricCanvasRef, tool, setFloorPlans, currentFloor, snapToGrid]);
  
  return {
    processCreatedPath
  };
};
