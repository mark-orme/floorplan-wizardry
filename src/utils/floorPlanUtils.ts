
/**
 * Utilities for floor plan creation and manipulation
 * @module utils/floorPlanUtils
 */
import { v4 as uuidv4 } from 'uuid';
import { FloorPlan } from '@/types/floorPlanTypes';

/**
 * Create a new empty floor plan with default values
 * 
 * @param {string} id - Optional ID for the floor plan (generates UUID if not provided)
 * @param {string} name - Name of the floor plan
 * @param {number} level - Floor level (optional, defaults to 0)
 * @returns {FloorPlan} A new floor plan object with default values
 */
export const createFloorPlan = (
  id?: string,
  name?: string,
  level?: number
): FloorPlan => {
  const now = new Date().toISOString();
  
  return {
    id: id || uuidv4(),
    name: name || 'New Floor Plan',
    label: name || 'New Floor Plan',
    level: level || 0,
    gia: 0, // Initialize with 0 gross internal area
    walls: [],
    rooms: [],
    strokes: [],
    canvasData: null,
    createdAt: now,
    updatedAt: now
  };
};

/**
 * Clone an existing floor plan with a new ID
 * 
 * @param {FloorPlan} floorPlan - The floor plan to clone
 * @param {string} newName - Optional new name for the cloned floor plan
 * @returns {FloorPlan} A clone of the floor plan with a new ID
 */
export const cloneFloorPlan = (
  floorPlan: FloorPlan,
  newName?: string
): FloorPlan => {
  const now = new Date().toISOString();
  
  return {
    ...floorPlan,
    id: uuidv4(),
    name: newName || `${floorPlan.name} (Copy)`,
    label: newName || `${floorPlan.name} (Copy)`,
    createdAt: now,
    updatedAt: now
  };
};

/**
 * Update a floor plan with new data
 * 
 * @param {FloorPlan} floorPlan - The floor plan to update
 * @param {Partial<FloorPlan>} updates - The updates to apply
 * @returns {FloorPlan} The updated floor plan
 */
export const updateFloorPlan = (
  floorPlan: FloorPlan,
  updates: Partial<FloorPlan>
): FloorPlan => {
  return {
    ...floorPlan,
    ...updates,
    updatedAt: new Date().toISOString()
  };
};
