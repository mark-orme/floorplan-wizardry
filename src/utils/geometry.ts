
/**
 * @deprecated Use the specific modules in utils/geometry/ instead
 * Geometry utilities for floor plan drawing
 * Provides coordinate transformation, snapping, and measurement functions
 * Re-exports all geometry utilities for backward compatibility
 * @module geometry
 */

// Re-export everything from the new modular structure
export * from './geometry/constants';
export * from './geometry/gridOperations';
export * from './geometry/lineOperations';
export * from './geometry/areaCalculations';
export * from './geometry/coordinateTransforms';
