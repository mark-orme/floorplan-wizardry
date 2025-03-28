
/**
 * Grid snapping tests
 * @module tests/grid/snapping
 */
import { describe, test, expect } from 'vitest';
import { Point } from '@/types/core/Point';
import { GRID_SPACING, SNAP_THRESHOLD } from '@/constants/numerics';
import { snapToGrid, snapToAngle } from '@/utils/grid/snapping';

// Constants for testing
const SMALL_GRID = GRID_SPACING.SMALL;

describe('Grid Snapping', () => {
  describe('snapToGrid', () => {
    test('should snap a point to the nearest grid point', () => {
      // Points near grid points
      const point1: Point = { x: 9.9, y: 10.1 } as Point;
      const point2: Point = { x: 20.3, y: 19.7 } as Point;
      
      // Expected results
      const expected1: Point = { x: 10, y: 10 } as Point;
      const expected2: Point = { x: 20, y: 20 } as Point;
      
      // Perform snapping
      const result1 = snapToGrid(point1);
      const result2 = snapToGrid(point2);
      
      // Assertions
      expect(result1.x).toBe(expected1.x);
      expect(result1.y).toBe(expected1.y);
      expect(result2.x).toBe(expected2.x);
      expect(result2.y).toBe(expected2.y);
    });
    
    test('should not change a point that is already on a grid point', () => {
      // Point exactly on grid
      const point: Point = { x: 20, y: 20 } as Point;
      
      // Expected result
      const expected: Point = { x: 20, y: 20 } as Point;
      
      // Perform snapping
      const result = snapToGrid(point);
      
      // Assertions
      expect(result.x).toBe(expected.x);
      expect(result.y).toBe(expected.y);
    });
    
    test('should handle negative coordinates', () => {
      // Points with negative coordinates
      const point1: Point = { x: -9.9, y: -10.1 } as Point;
      const point2: Point = { x: -20.3, y: -19.7 } as Point;
      
      // Expected results
      const expected1: Point = { x: -10, y: -10 } as Point;
      const expected2: Point = { x: -20, y: -20 } as Point;
      
      // Perform snapping
      const result1 = snapToGrid(point1);
      const result2 = snapToGrid(point2);
      
      // Assertions
      expect(result1.x).toBe(expected1.x);
      expect(result1.y).toBe(expected1.y);
      expect(result2.x).toBe(expected2.x);
      expect(result2.y).toBe(expected2.y);
    });
    
    test('should handle zero coordinates', () => {
      // Point at origin
      const point: Point = { x: 0.1, y: -0.1 } as Point;
      
      // Expected result
      const expected: Point = { x: 0, y: 0 } as Point;
      
      // Perform snapping
      const result = snapToGrid(point);
      
      // Assertions
      expect(result.x).toBe(expected.x);
      expect(result.y).toBe(expected.y);
    });
    
    test('should handle custom grid sizes', () => {
      // Point
      const point: Point = { x: 24, y: 26 } as Point;
      
      // Expected result with grid size 5
      const expected: Point = { x: 25, y: 25 } as Point;
      
      // Perform snapping with custom grid size
      const result = snapToGrid(point, 5);
      
      // Assertions
      expect(result.x).toBe(expected.x);
      expect(result.y).toBe(expected.y);
    });
  });
  
  describe('snapToAngle', () => {
    test('should snap lines to horizontal angles', () => {
      // Start point
      const start: Point = { x: 100, y: 100 } as Point;
      
      // End points close to horizontal
      const end1: Point = { x: 150, y: 103 } as Point; // Nearly horizontal
      const end2: Point = { x: 50, y: 97 } as Point;  // Nearly horizontal in opposite direction
      
      // Snap to horizontal (0 degrees)
      const result1 = snapToAngle(start, end1);
      const result2 = snapToAngle(start, end2);
      
      // Both should be snapped to horizontal
      expect(result1.y).toBeCloseTo(start.y);
      expect(result2.y).toBeCloseTo(start.y);
    });
    
    test('should snap lines to vertical angles', () => {
      // Start point
      const start: Point = { x: 100, y: 100 } as Point;
      
      // End points close to vertical
      const end1: Point = { x: 103, y: 150 } as Point; // Nearly vertical
      const end2: Point = { x: 97, y: 50 } as Point;  // Nearly vertical in opposite direction
      
      // Snap to vertical (90 degrees)
      const result1 = snapToAngle(start, end1);
      const result2 = snapToAngle(start, end2);
      
      // Both should be snapped to vertical
      expect(result1.x).toBeCloseTo(start.x);
      expect(result2.x).toBeCloseTo(start.x);
    });
    
    test('should snap lines to 45 degree angles', () => {
      // Start point
      const start: Point = { x: 100, y: 100 } as Point;
      
      // End points close to 45 degrees
      const end1: Point = { x: 150, y: 155 } as Point; // Nearly 45 degrees
      const end2: Point = { x: 50, y: 45 } as Point;  // Nearly 45 degrees in opposite direction
      
      // Snap to 45 degrees
      const result1 = snapToAngle(start, end1);
      const result2 = snapToAngle(start, end2);
      
      // Calculate distances for validation
      const dx1 = result1.x - start.x;
      const dy1 = result1.y - start.y;
      const dx2 = result2.x - start.x;
      const dy2 = result2.y - start.y;
      
      // For 45 degrees, dx and dy should be equal in magnitude
      expect(Math.abs(dx1)).toBeCloseTo(Math.abs(dy1));
      expect(Math.abs(dx2)).toBeCloseTo(Math.abs(dy2));
    });
  });
});
