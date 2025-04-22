
/**
 * Type diagnostics utility functions
 * Utility functions for debugging and validating types
 */

import { FloorPlan, Wall } from '@/types/floor-plan/unifiedTypes';

/**
 * Calculate the length of a wall
 * @param wall The wall to measure
 * @returns The length of the wall
 */
export function calculateWallLength(wall: Wall): number {
  if (!wall || !wall.start || !wall.end) {
    return 0;
  }
  
  const dx = wall.end.x - wall.start.x;
  const dy = wall.end.y - wall.start.y;
  
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Create complete metadata for a floor plan
 * @returns Complete floor plan metadata
 */
export function createCompleteMetadata() {
  const now = new Date().toISOString();
  return {
    createdAt: now,
    updatedAt: now,
    paperSize: 'A4',
    level: 0,
    version: '1.0',
    author: 'System',
    notes: '',
    dateCreated: now,
    lastModified: now
  };
}

/**
 * Validate floor plan completeness
 * @param floorPlan Floor plan to validate
 * @returns True if floor plan is complete
 */
export function validateFloorPlanCompleteness(floorPlan: FloorPlan): boolean {
  // Check for required fields
  if (!floorPlan) return false;
  if (!floorPlan.id) return false;
  if (!floorPlan.name) return false;
  if (!floorPlan.createdAt) return false;
  if (!floorPlan.updatedAt) return false;
  if (!floorPlan.metadata) return false;
  
  // All checks passed
  return true;
}
