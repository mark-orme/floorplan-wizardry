
/**
 * Floor Plan Core Package
 * Core domain logic for floor plans, independent of UI
 * @module packages/floorplan-core
 */

// Re-export geometry types from the core domain
export * from '@/types/core/Geometry';
export * from '@/types/core/floor-plan';
export * from '@/types/core/DrawingTool';

// Re-export core geometry utilities
export * from '@/utils/geometry/engine';

// The floor plan domain model
export { calculatePolygonArea, calculateGIA } from '@/utils/geometry/engine';

// Export domain services
export * from './services';
