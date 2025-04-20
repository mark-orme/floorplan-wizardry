
/**
 * Type diagnostics utility
 * @module utils/debug/typeDiagnostics
 */
import { PaperSize, FloorPlanMetadata } from '@/types/floor-plan/unifiedTypes';

/**
 * Calculate wall length based on start and end points
 * @param start Start point
 * @param end End point
 * @returns Length of wall
 */
export function calculateWallLength(start: {x: number, y: number}, end: {x: number, y: number}): number {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Create a complete metadata object with all required fields
 * @param overrides Properties to override defaults
 * @returns Complete metadata object
 */
export function createCompleteMetadata(overrides: Partial<FloorPlanMetadata> = {}): FloorPlanMetadata {
  const now = new Date().toISOString();
  return {
    createdAt: overrides.createdAt || now,
    updatedAt: overrides.updatedAt || now,
    paperSize: overrides.paperSize || PaperSize.A4,
    level: overrides.level ?? 0,
    // Add the missing fields required by FloorPlanMetadata
    version: overrides.version || '1.0',
    author: overrides.author || '',
    dateCreated: overrides.dateCreated || now,
    lastModified: overrides.lastModified || now,
    notes: overrides.notes || ''
  };
}
