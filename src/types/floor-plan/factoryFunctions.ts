
/**
 * Floor Plan Factory Functions
 * Functions to create floor plan objects with default values
 * @module types/floor-plan/factoryFunctions
 */
import { FloorPlan } from './floorPlanTypes';
import { PaperSize } from './basicTypes';
import { FloorPlanMetadata } from './metadataTypes';

/**
 * Create a default floor plan
 * @param {number} index Floor index
 * @returns {FloorPlan} Default floor plan
 */
export const createDefaultFloorPlan = (index: number = 0): FloorPlan => {
  const now = new Date().toISOString();
  const name = `Floor ${index + 1}`;
  
  return {
    id: `floor-${Date.now()}-${index}`,
    name,
    label: name,
    gia: 0,
    walls: [],
    rooms: [],
    strokes: [],
    canvasData: null,
    canvasJson: null,
    createdAt: now,
    updatedAt: now,
    level: index,
    index,
    metadata: {
      createdAt: now,
      updatedAt: now,
      paperSize: 'A4',
      level: index
    }
  };
};
