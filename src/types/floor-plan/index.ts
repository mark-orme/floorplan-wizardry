
/**
 * Floor plan types index
 * Centralizes all floor plan related types
 */

// Import from canonical sources
import { FloorPlan, Wall, Room, Stroke } from '../floorPlanTypes';
import { PaperSize as CorePaperSize } from '../core/floor-plan/PaperSize';

// Re-export types
export type { FloorPlan, Wall, Room, Stroke };

// Re-export with renaming to avoid duplicate conflict
export { type CorePaperSize as PaperSize };

// Export adapter functions
export * from '../utils/floorPlanTypeAdapter';
