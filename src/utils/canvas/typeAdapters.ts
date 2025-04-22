
/**
 * Canvas type adapter utilities
 * Helps convert between different FloorPlan object representations
 */
import { FloorPlan as UnifiedFloorPlan } from '@/types/floor-plan/unifiedTypes';
import { FloorPlan as AppFloorPlan } from '@/types/core/floor-plan/AppFloorPlan';

/**
 * Convert unified floor plan to app floor plan format
 */
export function convertToAppFloorPlan(unifiedPlan: UnifiedFloorPlan): AppFloorPlan {
  return {
    ...unifiedPlan,
    // Add any required fields that might be missing
    createdAt: unifiedPlan.createdAt || new Date().toISOString(),
    updatedAt: unifiedPlan.updatedAt || new Date().toISOString(),
    metadata: {
      ...unifiedPlan.metadata,
      createdAt: unifiedPlan.metadata.createdAt || new Date().toISOString(),
      updatedAt: unifiedPlan.metadata.updatedAt || new Date().toISOString(),
    }
  } as AppFloorPlan;
}

/**
 * Convert app floor plan to unified floor plan format
 */
export function convertToUnifiedFloorPlan(appPlan: AppFloorPlan): UnifiedFloorPlan {
  return {
    ...appPlan,
    // Add required fields for unified type
    data: appPlan.data || {},
    userId: appPlan.userId || 'default-user',
    propertyId: (appPlan as any).propertyId || ''
  } as UnifiedFloorPlan;
}

/**
 * Convert array of unified floor plans to app floor plans
 */
export function convertToAppFloorPlans(unifiedPlans: UnifiedFloorPlan[]): AppFloorPlan[] {
  return unifiedPlans.map(convertToAppFloorPlan);
}

/**
 * Convert array of app floor plans to unified floor plans
 */
export function convertToUnifiedFloorPlans(appPlans: AppFloorPlan[]): UnifiedFloorPlan[] {
  return appPlans.map(convertToUnifiedFloorPlan);
}
