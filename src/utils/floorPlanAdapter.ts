
/**
 * Adapter utilities for converting between core.FloorPlan and floorPlanTypes.FloorPlan
 * @module utils/floorPlanAdapter
 */
import { FloorPlan as CoreFloorPlan } from '@/types/core/FloorPlan';
import { FloorPlan as AppFloorPlan } from '@/types/floorPlanTypes';

/**
 * Convert from app FloorPlan type to core FloorPlan type
 * @param appPlan The app FloorPlan
 * @returns The core FloorPlan
 */
export function appToCoreFloorPlan(appPlan: AppFloorPlan): CoreFloorPlan {
  return {
    ...appPlan,
    // Ensure required fields are present
    label: appPlan.label || `Floor ${appPlan.index || 0}`,
  };
}

/**
 * Convert from core FloorPlan type to app FloorPlan type
 * @param corePlan The core FloorPlan
 * @returns The app FloorPlan
 */
export function coreToAppFloorPlan(corePlan: CoreFloorPlan): AppFloorPlan {
  return {
    ...corePlan,
  };
}

/**
 * Convert multiple app FloorPlans to core FloorPlans
 * @param appPlans Array of app FloorPlans
 * @returns Array of core FloorPlans
 */
export function appToCoreFloorPlans(appPlans: AppFloorPlan[]): CoreFloorPlan[] {
  return appPlans.map(appToCoreFloorPlan);
}

/**
 * Convert multiple core FloorPlans to app FloorPlans
 * @param corePlans Array of core FloorPlans
 * @returns Array of app FloorPlans
 */
export function coreToAppFloorPlans(corePlans: CoreFloorPlan[]): AppFloorPlan[] {
  return corePlans.map(coreToAppFloorPlan);
}
