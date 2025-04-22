
/**
 * Floor plan type adapter
 * Provides functions to convert between different floor plan formats
 * @module utils/floorPlanAdapter/floorPlanTypeAdapter
 */
import { FloorPlan as UnifiedFloorPlan } from '@/types/floor-plan/unifiedTypes';
import { FloorPlan as CoreFloorPlan } from '@/types/core/floor-plan/FloorPlan';
import { FloorPlan as AppFloorPlan } from '@/types/core/floor-plan/AppFloorPlan';
import { convertToCoreFloorPlans, convertToUnifiedFloorPlans } from './converters';

/**
 * Convert a unified floor plan to app format
 * @param unifiedPlan Unified floor plan
 * @returns App floor plan
 */
export const convertToAppFloorPlan = (unifiedPlan: UnifiedFloorPlan): AppFloorPlan => {
  // First convert to core format
  const corePlan = convertToCoreFloorPlans([unifiedPlan])[0];
  
  // Then convert to app format
  return {
    id: corePlan.id,
    name: corePlan.name,
    label: corePlan.label,
    walls: corePlan.walls,
    rooms: corePlan.rooms,
    strokes: corePlan.strokes,
    metadata: corePlan.metadata,
    createdAt: corePlan.metadata.createdAt,
    updatedAt: corePlan.metadata.updatedAt
  };
};

/**
 * Convert multiple unified floor plans to app format
 * @param unifiedPlans Unified floor plans
 * @returns App floor plans
 */
export const convertToAppFloorPlans = (unifiedPlans: UnifiedFloorPlan[]): AppFloorPlan[] => {
  return unifiedPlans.map(convertToAppFloorPlan);
};

/**
 * Convert app floor plan to unified format
 * @param appPlan App floor plan
 * @returns Unified floor plan
 */
export const convertToUnifiedFloorPlan = (appPlan: AppFloorPlan): UnifiedFloorPlan => {
  // First convert to core format
  const corePlan: CoreFloorPlan = {
    id: appPlan.id,
    name: appPlan.name,
    label: appPlan.label,
    walls: appPlan.walls,
    rooms: appPlan.rooms,
    strokes: appPlan.strokes,
    metadata: appPlan.metadata
  };
  
  // Then convert to unified format
  return convertToUnifiedFloorPlans([corePlan])[0];
};

/**
 * Convert multiple app floor plans to unified format
 * @param appPlans App floor plans
 * @returns Unified floor plans
 */
export const convertToUnifiedFloorPlans = (appPlans: AppFloorPlan[]): UnifiedFloorPlan[] => {
  return appPlans.map(convertToUnifiedFloorPlan);
};
