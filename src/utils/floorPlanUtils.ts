
/**
 * Utility functions for floor plan operations
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
  const now = new Date().toISOString();
  
  return {
    id,
    name,
    label: name,
    walls: [],
    rooms: [],
    strokes: [],
    canvasJson: null,
    canvasData: null,
    createdAt: now,
    updatedAt: now,
    gia: 0,
    level,
    index: level, // Use level as the index to maintain compatibility
    metadata: {
      createdAt: now,
      updatedAt: now,
      paperSize: PaperSize.A4,
      level
    }
  };
};
