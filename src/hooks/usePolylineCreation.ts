
import { useCallback } from "react";
import { Canvas as FabricCanvas, Object as FabricObject, Path } from "fabric";
import { POLYLINE_STYLES } from "@/constants/drawingConstants";
import { Point } from "@/types/geometryTypes";

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
   * Create a polyline from points using Path instead of Polyline
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
      
      // Create SVG path from points
      let pathString = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        pathString += ` L ${points[i].x} ${points[i].y}`;
      }
      
      // Create fabric path with merged options
      const path = new Path(pathString, {
        stroke: POLYLINE_STYLES.DEFAULT.stroke,
        strokeWidth: POLYLINE_STYLES.DEFAULT.strokeWidth,
        fill: POLYLINE_STYLES.DEFAULT.fill,
        opacity: 1,
        selectable: true,
        evented: true,
        objectCaching: true,
        strokeLineCap: POLYLINE_STYLES.DEFAULT.strokeLineCap as any,
        strokeLineJoin: POLYLINE_STYLES.DEFAULT.strokeLineJoin as any,
        // Merge with provided options
        ...options
      });
      
      // Add object type for identification
      const customPath = path as unknown as CustomFabricObject;
      customPath.objectType = 'line';
      
      // Add to canvas
      canvas.add(customPath as unknown as FabricObject);
      canvas.requestRenderAll();
      
      return customPath;
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
      stroke: '#2563eb',
      strokeWidth: 4,
      fill: 'transparent',
      opacity: 1,
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
      stroke: '#16a34a',
      strokeWidth: 2,
      fill: 'rgba(34, 197, 94, 0.1)',
      opacity: 0.8,
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
