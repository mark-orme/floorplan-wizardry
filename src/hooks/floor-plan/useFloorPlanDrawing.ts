
/**
 * Hook for drawing floor plans on the canvas
 * Provides utilities for rendering floor plans with various styles
 * @module useFloorPlanDrawing
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas, Rect, Line, Polyline, Text } from "fabric";
import { FloorPlan, Wall, Room, Point, Stroke } from "@/types/floorPlanTypes";
import logger from "@/utils/logger";
import { PIXELS_PER_METER } from "@/constants/numerics";

/**
 * Floor plan drawing constants
 */
const DRAWING_CONSTANTS = {
  /** Default wall color */
  DEFAULT_WALL_COLOR: '#000000',
  /** Default room fill color with opacity */
  DEFAULT_ROOM_FILL: 'rgba(200, 200, 255, 0.2)',
  /** Default wall thickness in pixels */
  DEFAULT_WALL_THICKNESS: 2,
  /** Default room label font size */
  ROOM_LABEL_FONT_SIZE: 14,
  /** Default scale factor */
  DEFAULT_SCALE: 1
};

/**
 * Floor plan drawing options
 * @interface FloorPlanDrawingOptions
 */
interface FloorPlanDrawingOptions {
  /** Stroke color for walls */
  wallColor?: string;
  /** Fill color for rooms */
  roomFillColor?: string;
  /** Stroke width for walls */
  wallThickness?: number;
  /** Whether to show room labels */
  showLabels?: boolean;
  /** Whether to show dimensions */
  showDimensions?: boolean;
  /** Scale factor for display */
  scale?: number;
}

/**
 * Default drawing options
 */
const DEFAULT_OPTIONS: FloorPlanDrawingOptions = {
  wallColor: DRAWING_CONSTANTS.DEFAULT_WALL_COLOR,
  roomFillColor: DRAWING_CONSTANTS.DEFAULT_ROOM_FILL,
  wallThickness: DRAWING_CONSTANTS.DEFAULT_WALL_THICKNESS,
  showLabels: true,
  showDimensions: true,
  scale: DRAWING_CONSTANTS.DEFAULT_SCALE
};

/**
 * Hook for drawing floor plans on a Fabric.js canvas
 * @returns Floor plan drawing utilities
 */
export const useFloorPlanDrawing = () => {
  /**
   * Draw a floor plan on the canvas
   * @param {FabricCanvas} canvas - Fabric canvas instance
   * @param {FloorPlan} floorPlan - Floor plan to draw
   * @param {FloorPlanDrawingOptions} options - Drawing options
   * @returns {Promise<void>} Promise that resolves when drawing is complete
   */
  const drawFloorPlan = useCallback(async (
    canvas: FabricCanvas,
    floorPlan: FloorPlan,
    options: FloorPlanDrawingOptions = DEFAULT_OPTIONS
  ): Promise<void> => {
    if (!canvas || !floorPlan) {
      logger.error("Cannot draw floor plan: Canvas or plan is null");
      return;
    }
    
    try {
      // Set options with defaults
      const drawOptions = { ...DEFAULT_OPTIONS, ...options };
      
      // Draw walls if they exist
      if (floorPlan.walls && floorPlan.walls.length > 0) {
        drawWalls(canvas, floorPlan.walls, drawOptions);
      } else {
        logger.info("No walls to draw in floor plan");
      }
      
      // Draw rooms if they exist
      if (floorPlan.rooms && floorPlan.rooms.length > 0) {
        drawRooms(canvas, floorPlan.rooms, drawOptions);
      } else {
        logger.info("No rooms to draw in floor plan");
      }
      
      // Draw strokes if they exist (from drawing tools)
      if (floorPlan.strokes && floorPlan.strokes.length > 0) {
        // Here floorPlan.strokes is Stroke[][] which is Point[][][]
        drawStrokes(canvas, floorPlan.strokes, drawOptions);
      }
      
      // Render the canvas
      canvas.requestRenderAll();
      
      logger.info("Floor plan drawn successfully");
    } catch (error) {
      logger.error("Error drawing floor plan:", error);
    }
  }, []);
  
  /**
   * Draw walls on the canvas
   * @param {FabricCanvas} canvas - Fabric canvas instance
   * @param {Wall[]} walls - Array of walls to draw
   * @param {FloorPlanDrawingOptions} options - Drawing options
   */
  const drawWalls = (
    canvas: FabricCanvas,
    walls: Wall[],
    options: FloorPlanDrawingOptions
  ): void => {
    walls.forEach(wall => {
      const line = new Line([
        wall.start.x * PIXELS_PER_METER,
        wall.start.y * PIXELS_PER_METER,
        wall.end.x * PIXELS_PER_METER,
        wall.end.y * PIXELS_PER_METER
      ], {
        stroke: options.wallColor,
        strokeWidth: wall.thickness || options.wallThickness || DRAWING_CONSTANTS.DEFAULT_WALL_THICKNESS,
        selectable: false,
        evented: false,
        objectCaching: true
      });
      
      canvas.add(line);
    });
  };
  
  /**
   * Draw rooms on the canvas
   * @param {FabricCanvas} canvas - Fabric canvas instance
   * @param {Room[]} rooms - Array of rooms to draw
   * @param {FloorPlanDrawingOptions} options - Drawing options
   */
  const drawRooms = (
    canvas: FabricCanvas,
    rooms: Room[],
    options: FloorPlanDrawingOptions
  ): void => {
    rooms.forEach(room => {
      // Create room rectangle
      const rect = new Rect({
        left: room.bounds.x * PIXELS_PER_METER,
        top: room.bounds.y * PIXELS_PER_METER,
        width: room.bounds.width * PIXELS_PER_METER,
        height: room.bounds.height * PIXELS_PER_METER,
        fill: options.roomFillColor,
        stroke: options.wallColor,
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectCaching: true
      });
      
      canvas.add(rect);
      
      // Add room label if enabled
      if (options.showLabels && room.name) {
        const text = new Text(room.name, {
          left: (room.bounds.x + room.bounds.width / 2) * PIXELS_PER_METER,
          top: (room.bounds.y + room.bounds.height / 2) * PIXELS_PER_METER,
          fontSize: DRAWING_CONSTANTS.ROOM_LABEL_FONT_SIZE,
          fill: DRAWING_CONSTANTS.DEFAULT_WALL_COLOR,
          textAlign: 'center',
          originX: 'center',
          originY: 'center',
          selectable: false,
          evented: false
        });
        
        canvas.add(text);
      }
    });
  };
  
  /**
   * Draw strokes on the canvas
   * @param {FabricCanvas} canvas - Fabric canvas instance
   * @param {Point[][]} strokes - Array of point arrays defining strokes
   * @param {FloorPlanDrawingOptions} options - Drawing options
   */
  const drawStrokes = (
    canvas: FabricCanvas,
    strokes: Point[][],
    options: FloorPlanDrawingOptions
  ): void => {
    strokes.forEach(stroke => {
      if (stroke.length < 2) return;
      
      // Convert stroke points to pixel coordinates
      const pixelPoints = stroke.map(point => ({
        x: point.x * PIXELS_PER_METER,
        y: point.y * PIXELS_PER_METER
      }));
      
      // Create a polyline for the stroke
      const polyline = new Polyline(pixelPoints, {
        stroke: options.wallColor,
        strokeWidth: options.wallThickness || DRAWING_CONSTANTS.DEFAULT_WALL_THICKNESS,
        fill: 'transparent',
        selectable: false,
        evented: false,
        objectCaching: true
      });
      
      canvas.add(polyline);
    });
  };
  
  return { drawFloorPlan };
};
