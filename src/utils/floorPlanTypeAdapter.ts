
/**
 * Floor Plan Type Adapter
 * Provides utilities for converting between different floor plan types
 */
import type { FloorPlan as UnifiedFloorPlan } from '@/types/core';
import type { FloorPlan as LegacyFloorPlan } from '@/types/floorPlanTypes';
import { v4 as uuidv4 } from 'uuid';

/**
 * Convert an AppFloorPlan to a unified type
 */
export function convertToUnifiedFloorPlan(appFloorPlan: any): UnifiedFloorPlan {
  const now = new Date().toISOString();
  
  return {
    ...appFloorPlan,
    // Add missing required properties for UnifiedFloorPlan
    data: appFloorPlan.data || {},
    userId: appFloorPlan.userId || 'default-user',
    propertyId: appFloorPlan.propertyId || '',
    createdAt: appFloorPlan.createdAt || now,
    updatedAt: appFloorPlan.updatedAt || now
  } as UnifiedFloorPlan;
}

/**
 * Convert a LegacyFloorPlan to a unified type
 */
export function convertLegacyToUnifiedFloorPlan(legacyFloorPlan: LegacyFloorPlan): UnifiedFloorPlan {
  const now = new Date().toISOString();
  
  return {
    ...legacyFloorPlan,
    // Add missing required properties for UnifiedFloorPlan
    data: {}, // Ensure data property exists
    label: legacyFloorPlan.name,
    userId: legacyFloorPlan.userId || 'default-user',
    createdAt: legacyFloorPlan.createdAt || now,
    updatedAt: legacyFloorPlan.updatedAt || now,
    metadata: legacyFloorPlan.metadata || {
      createdAt: now,
      updatedAt: now,
      paperSize: 'A4',
      level: legacyFloorPlan.level || 0,
      version: '1.0',
      author: 'User',
      dateCreated: now,
      lastModified: now,
      notes: ''
    }
  } as UnifiedFloorPlan;
}

/**
 * Convert a UnifiedFloorPlan to AppFloorPlan
 */
export function convertToAppFloorPlan(unifiedFloorPlan: UnifiedFloorPlan): any {
  const { propertyId, ...appFloorPlan } = unifiedFloorPlan;
  return appFloorPlan;
}

/**
 * Convert an array of UnifiedFloorPlans to AppFloorPlans
 */
export function convertToAppFloorPlans(unifiedFloorPlans: UnifiedFloorPlan[]): any[] {
  return unifiedFloorPlans.map(convertToAppFloorPlan);
}

/**
 * Convert any floor plan type to the unified type
 */
export function convertAnyToUnifiedFloorPlan(floorPlan: any): UnifiedFloorPlan {
  if ('propertyId' in floorPlan) {
    // Already in unified format
    return floorPlan as UnifiedFloorPlan;
  } 
  
  if ('userId' in floorPlan) {
    // Likely an AppFloorPlan
    return convertToUnifiedFloorPlan(floorPlan);
  }
  
  // Assume it's a legacy floor plan
  return convertLegacyToUnifiedFloorPlan(floorPlan as LegacyFloorPlan);
}

/**
 * Create a simple adapter to work with both types of FloorPlan
 */
export function createFloorPlanAdapter() {
  return {
    convertToUnified: convertAnyToUnifiedFloorPlan,
    convertToApp: convertToAppFloorPlan,
    convertToAppArray: convertToAppFloorPlans
  };
}
