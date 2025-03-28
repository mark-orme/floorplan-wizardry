import { useCallback } from "react";
import { Canvas as FabricCanvas, Polyline, Object as FabricObject } from "fabric";
import { POLYLINE_STYLES } from "@/constants/drawingConstants";
import { Point } from "@/types/geometryTypes";

// Defined types for line cap and join styles
type CanvasLineCap = "butt" | "round" | "square";
type CanvasLineJoin = "bevel" | "round" | "miter";

// Type for custom Fabric objects with additional properties
interface CustomFabricObject extends FabricObject {
  objectType?: string;
}

/**
 * Hook for creating polylines on canvas
 * @param {React.MutableRefObject<FabricCanvas | null>} fabricCanvasRef - Reference to Fabric canvas
 * @returns {Object} Functions to create and manage polylines
 */
export const usePolylineCreation = (
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>
) => {
  /**
   * Create a polyline from points with specified styles
   * @param {Point[]} points - Array of points
   * @param {Object} options - Style options
   * @returns {CustomFabricObject|null} Created polyline object or null if failed
   */
  const createPolyline = useCallback((
    points: Point[],
    options?: {
      stroke?: string;
      strokeWidth?: number;
      fill?: string;
      opacity?: number;
      selectable?: boolean;
      objectCaching?: boolean;
    }
  ): CustomFabricObject | null => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return null;
    
    try {
      if (!points || points.length < 2) {
        console.warn("Cannot create polyline with less than 2 points");
        return null;
      }
      
      // Format points for fabric polyline
      const pathPoints = points.map(point => ({ x: point.x, y: point.y }));
      
      // Create fabric polyline with merged options
      const polyline = new Polyline(pathPoints, {
        stroke: POLYLINE_STYLES.DEFAULT_STROKE_COLOR,
        strokeWidth: POLYLINE_STYLES.DEFAULT_STROKE_WIDTH,
        fill: POLYLINE_STYLES.DEFAULT_FILL,
        opacity: POLYLINE_STYLES.DEFAULT_OPACITY,
        selectable: true,
        evented: true,
        objectCaching: true,
        strokeLineCap: POLYLINE_STYLES.DEFAULT_LINE_CAP as CanvasLineCap,
        strokeLineJoin: POLYLINE_STYLES.DEFAULT_LINE_JOIN as CanvasLineJoin,
        // Merge with provided options
        ...options
      });
      
      // Add object type for identification
      const customPolyline = polyline as unknown as CustomFabricObject;
      customPolyline.objectType = 'line';
      
      // Add to canvas
      canvas.add(customPolyline as unknown as FabricObject);
      canvas.requestRenderAll();
      
      return customPolyline;
    } catch (error) {
      console.error("Error creating polyline:", error);
      return null;
    }
  }, [fabricCanvasRef]);
  
  /**
   * Create a wall from points
   * @param {Point[]} points - Array of points
   * @returns {CustomFabricObject|null} Created wall polyline or null if failed
   */
  const createWall = useCallback((points: Point[]): CustomFabricObject | null => {
    return createPolyline(points, {
      stroke: POLYLINE_STYLES.WALL_STROKE_COLOR,
      strokeWidth: POLYLINE_STYLES.WALL_STROKE_WIDTH,
      fill: POLYLINE_STYLES.WALL_FILL,
      opacity: POLYLINE_STYLES.WALL_OPACITY,
      selectable: true,
      objectCaching: true
    });
  }, [createPolyline]);
  
  /**
   * Create a room outline from points
   * @param {Point[]} points - Array of points
   * @returns {CustomFabricObject|null} Created room polyline or null if failed
   */
  const createRoom = useCallback((points: Point[]): CustomFabricObject | null => {
    const polyline = createPolyline(points, {
      stroke: POLYLINE_STYLES.ROOM_STROKE_COLOR,
      strokeWidth: POLYLINE_STYLES.ROOM_STROKE_WIDTH,
      fill: POLYLINE_STYLES.ROOM_FILL,
      opacity: POLYLINE_STYLES.ROOM_OPACITY,
      selectable: true,
      objectCaching: true
    });
    
    if (polyline) {
      polyline.objectType = 'room';
      return polyline;
    }
    
    return null;
  }, [createPolyline]);
  
  return {
    createPolyline,
    createWall,
    createRoom
  };
};
