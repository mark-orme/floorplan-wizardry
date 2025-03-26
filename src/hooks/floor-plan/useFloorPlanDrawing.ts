
/**
 * Hook for drawing floor plans on the canvas
 * Provides utilities for rendering floor plans with various styles
 * @module useFloorPlanDrawing
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas, Rect, Line } from "fabric";
import { FloorPlan } from "@/types/floorPlanTypes";
import logger from "@/utils/logger";
import { PIXELS_PER_METER } from "@/constants/numerics";

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
  wallColor: '#000000',
  roomFillColor: 'rgba(200, 200, 255, 0.2)',
  wallThickness: 2,
  showLabels: true,
  showDimensions: true,
  scale: 1
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
      logger.warn('Cannot draw floor plan: Invalid canvas or floor plan data');
      return;
    }
    
    // Merge with default options
    const drawOptions = { ...DEFAULT_OPTIONS, ...options };
    
    try {
      const { scale = 1, wallColor, wallThickness } = drawOptions;
      
      // Clear existing floor plan objects if needed
      // (skipped - usually you'd want to clear specific groups)
      
      // Draw walls
      if (floorPlan.walls && floorPlan.walls.length > 0) {
        for (const wall of floorPlan.walls) {
          if (wall.start && wall.end) {
            const line = new Line([
              wall.start.x * PIXELS_PER_METER * scale,
              wall.start.y * PIXELS_PER_METER * scale,
              wall.end.x * PIXELS_PER_METER * scale,
              wall.end.y * PIXELS_PER_METER * scale
            ], {
              stroke: wallColor,
              strokeWidth: wallThickness,
              selectable: true,
              objectType: 'wall',
              strokeLineCap: 'round',
              strokeLineJoin: 'round'
            });
            
            canvas.add(line);
          }
        }
      }
      
      // Draw rooms (basic rectangles for demonstration)
      if (floorPlan.rooms && floorPlan.rooms.length > 0) {
        for (const room of floorPlan.rooms) {
          if (room.bounds) {
            const { x, y, width, height } = room.bounds;
            
            const rect = new Rect({
              left: x * PIXELS_PER_METER * scale,
              top: y * PIXELS_PER_METER * scale,
              width: width * PIXELS_PER_METER * scale,
              height: height * PIXELS_PER_METER * scale,
              fill: drawOptions.roomFillColor,
              stroke: drawOptions.wallColor,
              strokeWidth: 1,
              selectable: true,
              objectType: 'room',
              name: room.name || 'Unnamed Room'
            });
            
            canvas.add(rect);
            
            // Add room label if enabled
            if (drawOptions.showLabels && room.name) {
              // Room label implementation would go here
            }
          }
        }
      }
      
      // Render the canvas
      canvas.requestRenderAll();
      
    } catch (error) {
      logger.error('Error drawing floor plan:', error);
      throw error;
    }
  }, []);
  
  return { drawFloorPlan };
};
