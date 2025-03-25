
/**
 * Geometry utilities for floor plan drawing
 * Provides coordinate transformation, snapping, and measurement functions
 * Re-exports all geometry utilities from the modular structure
 * @module geometry
 */

// Re-export everything from the new modular structure
export * from './geometry/constants';
export * from './geometry/gridOperations';
export * from './geometry/lineOperations';
export * from './geometry/areaCalculations';
export * from './geometry/coordinateTransforms';
export * from './geometry/midpointCalculation';

/**
 * This module serves as a centralized export point for all geometry-related
 * functionality in the application. It does not contain any direct implementation
 * but instead re-exports from specialized modules for better code organization.
 * 
 * Key categories of geometry utilities:
 * - Constants: Fundamental measurement and tolerance values
 * - Grid Operations: Functions for snapping and aligning to the grid
 * - Line Operations: Functions for line manipulation and straightening
 * - Area Calculations: Functions for calculating areas of polygons
 * - Coordinate Transforms: Functions for converting between coordinate systems
 * - Midpoint Calculation: Functions for finding midpoints of lines
 */
