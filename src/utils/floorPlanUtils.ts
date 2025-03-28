
/**
 * Floor plan utility functions
 * @module utils/floorPlanUtils
 */
import { FloorPlan, PaperSize } from '@/types/floorPlanTypes';

/**
 * Create a new floor plan with default values
 * @param id - Unique identifier for the floor plan
 * @param name - Name of the floor plan
 * @param level - Floor level (default: 0, ground floor)
 * @returns A new FloorPlan object
 */
export const createFloorPlan = (id: string, name: string, level: number = 0): FloorPlan => {
  return {
    id,
    name,
    label: name,
    walls: [],
    rooms: [],
    strokes: [],
    canvasJson: null,
    canvasData: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    gia: 0,
    level,
    index: level, // Use level as the index to maintain compatibility
    metadata: {
      createdAt: Date.now(),
      updatedAt: Date.now(),
      paperSize: PaperSize.A4,
      level
    }
  };
};

/**
 * Calculate the Gross Internal Area (GIA) of a floor plan
 * @param floorPlan - Floor plan to calculate GIA for
 * @returns GIA in square meters
 */
export const calculateGIA = (floorPlan: FloorPlan): number => {
  // This is a placeholder implementation
  // In a real app, would calculate GIA from room areas
  let totalArea = 0;
  
  if (floorPlan.rooms) {
    for (const room of floorPlan.rooms) {
      if (room.area) {
        totalArea += room.area;
      }
    }
  }
  
  return totalArea;
};
