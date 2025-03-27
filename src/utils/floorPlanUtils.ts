
/**
 * Floor plan utility functions
 * @module floorPlanUtils
 */
import { FloorPlan } from "@/types/floorPlanTypes";

/**
 * Constants for floor plan creation
 */
export const FLOOR_PLAN_CONSTANTS = {
  /** Default GIA value */
  DEFAULT_GIA: 0,
  
  /** Default floor level */
  DEFAULT_FLOOR_LEVEL: 0
};

/**
 * Creates a new floor plan with default values
 * 
 * @param {string} id - Floor plan unique identifier
 * @param {string} name - Floor plan name
 * @returns {FloorPlan} New floor plan object
 */
export const createFloorPlan = (id: string, name: string): FloorPlan => {
  const timestamp = new Date().toISOString();
  
  return {
    id,
    name,
    label: name,
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
 * Gets a floor plan by id from an array of floor plans
 * 
 * @param {FloorPlan[]} floorPlans - Array of floor plans
 * @param {string} id - Floor plan id
 * @returns {FloorPlan|undefined} Found floor plan or undefined
 */
export const getFloorPlanById = (floorPlans: FloorPlan[], id: string): FloorPlan | undefined => {
  return floorPlans.find(floorPlan => floorPlan.id === id);
};

/**
 * Gets the total GIA for all floor plans
 * 
 * @param {FloorPlan[]} floorPlans - Array of floor plans
 * @returns {number} Total GIA
 */
export const getTotalGIA = (floorPlans: FloorPlan[]): number => {
  return floorPlans.reduce((total, floorPlan) => total + floorPlan.gia, 0);
};

/**
 * Updates a floor plan in an array of floor plans
 * 
 * @param {FloorPlan[]} floorPlans - Array of floor plans
 * @param {FloorPlan} updatedFloorPlan - Updated floor plan
 * @returns {FloorPlan[]} New array with updated floor plan
 */
export const updateFloorPlan = (floorPlans: FloorPlan[], updatedFloorPlan: FloorPlan): FloorPlan[] => {
  return floorPlans.map(floorPlan => 
    floorPlan.id === updatedFloorPlan.id ? updatedFloorPlan : floorPlan
  );
};

/**
 * Deletes a floor plan from an array of floor plans
 * 
 * @param {FloorPlan[]} floorPlans - Array of floor plans
 * @param {string} id - Floor plan id to delete
 * @returns {FloorPlan[]} New array without the deleted floor plan
 */
export const deleteFloorPlan = (floorPlans: FloorPlan[], id: string): FloorPlan[] => {
  return floorPlans.filter(floorPlan => floorPlan.id !== id);
};
