
/**
 * Drawing utilities
 * @module drawing
 */

// Re-export types from floorPlanTypes.ts using export type for TypeScript isolatedModules compatibility
export type { 
  FloorPlan, 
  Wall, 
  Room, 
  Stroke, 
  PaperSize,
  Point
} from '@/types/floorPlanTypes';

import { 
  PIXELS_PER_METER,
  GRID_SPACING,
  SMALL_GRID,
  LARGE_GRID,
  MAX_HISTORY_STATES,
  MAX_OBJECTS_PER_CANVAS,
  DEFAULT_LINE_THICKNESS,
  AREA_PRECISION
} from '@/constants/numerics';

// Re-export constants for backward compatibility
export {
  PIXELS_PER_METER,
  GRID_SPACING,
  SMALL_GRID,
  LARGE_GRID,
  MAX_HISTORY_STATES,
  MAX_OBJECTS_PER_CANVAS,
  DEFAULT_LINE_THICKNESS
};

/**
 * Define GRID_SIZE as GRID_SPACING for backward compatibility
 * Used by grid utilities for coordinate operations
 */
export const GRID_SIZE = GRID_SPACING;

/**
 * Default line color for drawing
 * @constant {string}
 */
export const DEFAULT_LINE_COLOR = "#000000"; // Default line color (black)

/**
 * Calculate GIA (Gross Internal Area) from points
 * Uses the Shoelace formula (Gauss's area formula) to calculate polygon area
 * 
 * @param {Array<{x: number, y: number}>} points - Array of points defining the polygon
 * @returns {number} Calculated area in square meters
 */
export const calculateGIA = (points: Array<{x: number, y: number}>): number => {
  if (!points || points.length < 3) return 0;
  
  // Calculate area using the Shoelace formula (Gauss's area formula)
  let area = 0;
  
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  
  // Take the absolute value and divide by 2
  area = Math.abs(area) / 2;
  
  // Round to specified precision
  const roundFactor = Math.pow(10, AREA_PRECISION);
  return Math.round(area * roundFactor) / roundFactor;
};

/**
 * Re-export everything from the specialized files using proper type exports
 */
export type * from '@/types/drawingTypes';
export * from './geometry'; // This now re-exports from all geometry modules
export * from './fabricPath'; // Use new modular path utilities
export * from './floorPlanStorage';

import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';

/**
 * Drawing utility functions
 */

/**
 * Add object to canvas with history tracking
 * @param canvas Fabric canvas
 * @param obj Object to add
 * @param historyRef History reference
 */
export const addObjectWithHistory = (
  canvas: FabricCanvas,
  obj: FabricObject,
  historyRef?: React.MutableRefObject<{past: any[], future: any[]}>
) => {
  // Add object to canvas
  canvas.add(obj);
  
  // Send to appropriate layer
  if (obj.type === 'line' || obj.type === 'polyline') {
    canvas.sendToBack(obj);
  }
  
  // Save state if history ref provided
  if (historyRef) {
    // Save current state
    const state = canvas.getObjects().filter(o => (o as any).objectType !== 'grid');
    
    // Add to history, limiting size
    historyRef.current.past.push(state);
    if (historyRef.current.past.length > MAX_HISTORY_STATES) {
      historyRef.current.past.shift();
    }
    
    // Clear future history
    historyRef.current.future = [];
  }
  
  // Render canvas
  canvas.requestRenderAll();
};

/**
 * Check if canvas is at object limit
 * @param canvas Fabric canvas
 * @returns True if at limit
 */
export const isCanvasAtObjectLimit = (canvas: FabricCanvas): boolean => {
  const nonGridObjects = canvas.getObjects().filter(obj => (obj as any).objectType !== 'grid');
  return nonGridObjects.length >= MAX_OBJECTS_PER_CANVAS;
};
