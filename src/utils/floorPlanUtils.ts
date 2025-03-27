
/**
 * Utilities for working with floor plans
 * @module floorPlanUtils
 */
import { FloorPlan } from "@/types/floorPlanTypes";

/**
 * Creates a new floor plan with all required properties
 * @param {string} id - Unique identifier for the floor plan
 * @param {string} name - Display name for the floor plan
 * @param {number} [level] - Floor level number (0 = ground floor)
 * @returns {FloorPlan} A complete FloorPlan object
 */
export const createFloorPlan = (id: string, name: string, level = 0): FloorPlan => {
  const timestamp = new Date().toISOString();
  
  return {
    id,
    name,
    label: name,
    walls: [],
    rooms: [],
    strokes: [],
    gia: 0,
    level,
    canvasData: null,
    createdAt: timestamp,
    updatedAt: timestamp
  };
};

/**
 * Validates that a floor plan has all required properties
 * @param {Partial<FloorPlan>} plan - The floor plan to validate
 * @returns {boolean} Whether the floor plan is valid
 */
export const isValidFloorPlan = (plan: Partial<FloorPlan>): boolean => {
  return Boolean(
    plan &&
    typeof plan.id === 'string' &&
    typeof plan.name === 'string' &&
    typeof plan.label === 'string' &&
    Array.isArray(plan.walls) &&
    Array.isArray(plan.rooms) &&
    Array.isArray(plan.strokes) &&
    (plan.gia === undefined || typeof plan.gia === 'number') &&
    (plan.createdAt === undefined || typeof plan.createdAt === 'string') &&
    (plan.updatedAt === undefined || typeof plan.updatedAt === 'string')
  );
};

/**
 * Ensures a floor plan has all required properties, providing defaults for missing ones
 * @param {Partial<FloorPlan>} plan - The floor plan to normalize
 * @returns {FloorPlan} A complete floor plan with all required properties
 */
export const normalizeFloorPlan = (plan: Partial<FloorPlan>): FloorPlan => {
  const timestamp = new Date().toISOString();
  
  return {
    id: plan.id || `floor-${Date.now()}`,
    name: plan.name || 'Unnamed Floor',
    label: plan.label || plan.name || 'Unnamed Floor',
    walls: Array.isArray(plan.walls) ? plan.walls : [],
    rooms: Array.isArray(plan.rooms) ? plan.rooms : [],
    strokes: Array.isArray(plan.strokes) ? plan.strokes : [],
    gia: typeof plan.gia === 'number' ? plan.gia : 0,
    level: typeof plan.level === 'number' ? plan.level : 0,
    canvasData: plan.canvasData || null,
    createdAt: plan.createdAt || timestamp,
    updatedAt: plan.updatedAt || timestamp
  };
};
