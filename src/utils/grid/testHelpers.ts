/**
 * Test helpers for grid utilities
 * Provides compatibility functions for test files using older signatures
 * @module utils/grid/testHelpers
 */
import { Canvas, Object as FabricObject } from 'fabric';
import { Point, createPoint } from '@/types/core/Point';
import { snapToGrid, snapToAngle, snapPointToGrid, isPointOnGrid, distanceToGridLine } from './snapping';
import { createGridLines, calculateGridDimensions, createCompleteGrid, isGridObject } from '@/utils/gridUtils';

/**
 * Compatibility wrapper for snapToGrid to handle Point objects
 * @param point The point to snap
 * @param gridSize Optional grid size
 * @returns The snapped point
 */
export function snapPointLegacy(point: Point, gridSize?: number): Point {
  if (!point) {
    return createPoint(0, 0);
  }
  return snapPointToGrid(point, gridSize);
}

/**
 * Compatibility wrapper for snapToAngle that works with legacy tests
 * @param start Start point
 * @param end End point
 * @param snapAngle Angle to snap to
 * @returns Snapped end point
 */
export function snapLineToAngleLegacy(start: Point, end: Point, snapAngle?: number): Point {
  // Extract the angle between the two points
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  
  // Convert the number parameter to angle for the function
  const snappedAngle = snapToAngle(angle, snapAngle || 45);
  
  // Calculate the distance between points
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Calculate the new end point based on the snapped angle
  const radAngle = snappedAngle * (Math.PI / 180);
  const newX = start.x + distance * Math.cos(radAngle);
  const newY = start.y + distance * Math.sin(radAngle);
  
  return createPoint(newX, newY);
}

/**
 * Compatibility wrapper for grid rendering functions
 * @param canvas Canvas object
 * @param width Canvas width
 * @param height Canvas height
 * @param cellSize Cell size
 * @returns Grid rendering result
 */
export function renderGridComponentsLegacy(canvas: Canvas, width?: number, height?: number, cellSize?: number): any {
  const result = {
    gridObjects: [] as FabricObject[],
    smallGridLines: [] as FabricObject[],
    largeGridLines: [] as FabricObject[],
    markers: [] as FabricObject[]
  };
  
  const dimensions = {
    width: width || 800,
    height: height || 600,
    cellSize: cellSize || 20
  };
  
  result.gridObjects = createGridLines(canvas, dimensions);
  
  // Division of grid objects into small and large grid lines (mock implementation)
  result.smallGridLines = result.gridObjects.slice(0, Math.floor(result.gridObjects.length / 2));
  result.largeGridLines = result.gridObjects.slice(Math.floor(result.gridObjects.length / 2));
  
  return result;
}
