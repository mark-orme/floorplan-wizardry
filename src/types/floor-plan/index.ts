
/**
 * Unified Floor Plan Types
 * Central export point for all floor plan types
 * @module types/floor-plan
 */

// Re-export all types from the core module to have a single source of truth
export * from '../core';

// Export any floor-plan specific types that don't exist in core
export * from './PaperSize';

// Add RoomTypeLiteral that includes "dining" to ensure compatibility
export type RoomTypeLiteral = 'bedroom' | 'bathroom' | 'kitchen' | 'living' | 'dining' | 'office' | 'other';

// Export floorPlanTypeAdapter for backward compatibility
export * from '../utils/floorPlanTypeAdapter';
