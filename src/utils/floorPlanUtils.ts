
/**
 * Floor plan utilities
 * Functions for creating and manipulating floor plans
 * @module utils/floorPlanUtils
 */
import { v4 as uuidv4 } from 'uuid';
import { FloorPlan } from '@/types/floorPlanTypes';
import { CANVAS_CONSTANTS } from '@/constants/canvasConstants';

/**
 * Constants for floor plan creation
 */
const FLOOR_PLAN_CONSTANTS = {
  /** Default floor plan name */
  DEFAULT_NAME: 'New Floor Plan',
  
  /** Default floor plan label */
  DEFAULT_LABEL: 'Floor',
  
  /** Default GIA value */
  DEFAULT_GIA: 0,
  
  /** Default floor index */
  DEFAULT_FLOOR_INDEX: 0
};

/**
 * Creates an empty floor plan with default values
 * 
 * @param {number} [floorIndex=0] - Floor index (level)
 * @returns {FloorPlan} New floor plan object
 */
export const createEmptyFloorPlan = (floorIndex: number = FLOOR_PLAN_CONSTANTS.DEFAULT_FLOOR_INDEX): FloorPlan => {
  const timestamp = new Date().toISOString();
  
  return {
    id: uuidv4(),
    name: `${FLOOR_PLAN_CONSTANTS.DEFAULT_NAME} ${floorIndex + 1}`,
    label: `${FLOOR_PLAN_CONSTANTS.DEFAULT_LABEL} ${floorIndex + 1}`,
    gia: FLOOR_PLAN_CONSTANTS.DEFAULT_GIA,
    walls: [],
    rooms: [],
    strokes: [],
    canvasData: null,
    createdAt: timestamp,
    updatedAt: timestamp
  };
};

/**
 * Create a new floor plan
 * Alias for createEmptyFloorPlan for backward compatibility
 * 
 * @param {number} [floorIndex=0] - Floor index (level)
 * @returns {FloorPlan} New floor plan object
 */
export const createFloorPlan = createEmptyFloorPlan;

/**
 * Update the GIA of a floor plan
 * 
 * @param {FloorPlan} floorPlan - Floor plan to update
 * @param {number} gia - New GIA value
 * @returns {FloorPlan} Updated floor plan
 */
export const updateFloorPlanGIA = (floorPlan: FloorPlan, gia: number): FloorPlan => {
  return {
    ...floorPlan,
    gia,
    updatedAt: new Date().toISOString()
  };
};

/**
 * Update floor plan metadata
 * 
 * @param {FloorPlan} floorPlan - Floor plan to update
 * @param {Partial<FloorPlan>} updates - Properties to update
 * @returns {FloorPlan} Updated floor plan
 */
export const updateFloorPlan = (floorPlan: FloorPlan, updates: Partial<FloorPlan>): FloorPlan => {
  return {
    ...floorPlan,
    ...updates,
    updatedAt: new Date().toISOString()
  };
};
