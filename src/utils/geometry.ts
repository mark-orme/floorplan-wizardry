
/**
 * Geometry utilities for floor plan drawing
 * Provides coordinate transformation, snapping, and measurement functions
 * Re-exports all geometry utilities from the modular structure
 * @module geometry
 */

// Explicitly import the functions we need from different modules to avoid conflicts
import { calculateGIA } from './geometry/areaCalculations';
import { GRID_SPACING, DISTANCE_PRECISION, CLOSE_POINT_THRESHOLD, FLOATING_POINT_TOLERANCE } from './geometry/constants';
import { screenToCanvasCoordinates } from './geometry/coordinateTransforms';
import { snapToGrid } from './geometry/gridOperations';
import { calculateDistance, isExactGridMultiple as lineIsExactGridMultiple } from './geometry/lineOperations';

// Re-export specific functions with non-conflicting names
export {
  // From areaCalculations
  calculateGIA,
  
  // From constants
  GRID_SPACING,
  DISTANCE_PRECISION,
  CLOSE_POINT_THRESHOLD,
  FLOATING_POINT_TOLERANCE,
  
  // From coordinateTransforms
  screenToCanvasCoordinates,
  
  // From gridOperations
  snapToGrid,
  
  // From lineOperations (with renamed export to avoid conflict)
  calculateDistance,
  lineIsExactGridMultiple
};

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
