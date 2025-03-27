
import { useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { POLYLINE_STYLES } from "@/constants/drawingConstants";

// Defined types for line cap and join styles
type CanvasLineCap = "butt" | "round" | "square";
type CanvasLineJoin = "bevel" | "round" | "miter";

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
   * @param {Array<{x: number, y: number}>} points - Array of points
   * @param {Object} options - Style options
   * @returns {Object|null} Created polyline object or null if failed
   */
  const createPolyline = useCallback((
    points: Array<{x: number, y: number}>,
    options?: {
      stroke?: string;
      strokeWidth?: number;
      fill?: string;
      opacity?: number;
      selectable?: boolean;
      objectCaching?: boolean;
    }
  ) => {
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
      const polyline = new fabric.Polyline(pathPoints, {
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
      polyline.objectType = 'line';
      
      // Add to canvas
      canvas.add(polyline);
      canvas.requestRenderAll();
      
      return polyline;
    } catch (error) {
      console.error("Error creating polyline:", error);
      return null;
    }
  }, [fabricCanvasRef]);
  
  /**
   * Create a walls from points
   * @param {Array<{x: number, y: number}>} points - Array of points
   * @returns {Object|null} Created wall polyline or null if failed
   */
  const createWall = useCallback((points: Array<{x: number, y: number}>) => {
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
   * @param {Array<{x: number, y: number}>} points - Array of points
   * @returns {Object|null} Created room polyline or null if failed
   */
  const createRoom = useCallback((points: Array<{x: number, y: number}>) => {
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
