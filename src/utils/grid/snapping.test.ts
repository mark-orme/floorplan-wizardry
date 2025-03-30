/**
 * Tests for grid snapping utilities
 * Verifies grid point manipulation and snapping algorithms
 * 
 * @module grid/snapping.test
 */
import { describe, it, expect } from 'vitest';
import { Point } from '@/types/core/Point';
import { snapPointToGrid, isPointOnGrid, distanceToGridLine, snapLineToStandardAngles } from './snapping';
import { GRID_SPACING } from '@/constants/numerics';

describe('Grid Snapping Utilities', () => {
  describe('snapPointToGrid', () => {
    it('should not change a point that is already on the grid', () => {
      // Arrange: Create a point that aligns with grid intersection
      const gridSize = GRID_SPACING.SMALL;
      const point: Point = { x: 20, y: 30 };
      
      // Act: Attempt to snap the already-aligned point
      const snapped = snapPointToGrid(point, gridSize);
      
      // Assert: Point should remain unchanged
      expect(snapped.x).toBe(20);
      expect(snapped.y).toBe(30);
    });
    
    it('should snap a point to the nearest grid intersection', () => {
      // Arrange: Create a point that's slightly off grid
      const gridSize = GRID_SPACING.SMALL;
      const point: Point = { x: 22, y: 29 };
      
      // Act: Snap the point to grid
      const snapped = snapPointToGrid(point, gridSize);
      
      // Assert: Point should be snapped to nearest grid intersection
      expect(snapped.x).toBe(20);
      expect(snapped.y).toBe(30);
    });
    
    it('should round to the nearest grid line', () => {
      // Arrange: Test cases with different points near grid lines
      const gridSize = GRID_SPACING.SMALL;
      const testCases = [
        { input: { x: 16, y: 26 }, expected: { x: 20, y: 30 } }, // Closer to (20,30)
        { input: { x: 24, y: 34 }, expected: { x: 20, y: 30 } }, // Closer to (20,30)
        { input: { x: 26, y: 26 }, expected: { x: 30, y: 30 } }  // Closer to (30,30)
      ];
      
      // Act & Assert: Test each case
      testCases.forEach(({ input, expected }) => {
        const snapped = snapPointToGrid(input, gridSize);
        expect(snapped.x).toBe(expected.x);
        expect(snapped.y).toBe(expected.y);
      });
    });
  });
  
  describe('isPointOnGrid', () => {
    it('should return true for a point exactly on a grid intersection', () => {
      // Arrange: Point on grid intersection
      const gridSize = GRID_SPACING.SMALL;
      const point: Point = { x: 20, y: 30 };
      
      // Act: Check if point is on grid
      const result = isPointOnGrid(point, gridSize);
      
      // Assert: Should be true for exact grid point
      expect(result).toBe(true);
    });
    
    it('should return false for a point not on a grid intersection', () => {
      // Arrange: Point not on grid intersection
      const gridSize = GRID_SPACING.SMALL;
      const point: Point = { x: 23, y: 27 };
      
      // Act: Check if point is on grid
      const result = isPointOnGrid(point, gridSize);
      
      // Assert: Should be false for non-grid point
      expect(result).toBe(false);
    });
    
    it('should handle points very close to grid intersections', () => {
      // Arrange: Point almost exactly on grid (floating point tolerance)
      const gridSize = GRID_SPACING.SMALL;
      const point: Point = { x: 20.0001, y: 30.0001 };
      
      // Act: Check if point is on grid
      const result = isPointOnGrid(point, gridSize);
      
      // Assert: Should handle floating point precision and return true
      expect(result).toBe(true);
    });
  });
  
  describe('distanceToGridLine', () => {
    it('should return zero distance for a point on a grid line', () => {
      // Arrange: Set up grid size
      const gridSize = GRID_SPACING.SMALL;
      
      // Test point on horizontal grid line
      const pointH: Point = { x: 25, y: 30 };
      const distH = distanceToGridLine(pointH, gridSize);
      
      // Assert: Y distance should be zero (on horizontal line)
      expect(distH.y).toBeCloseTo(0);
      
      // Test point on vertical grid line
      const pointV: Point = { x: 20, y: 35 };
      const distV = distanceToGridLine(pointV, gridSize);
      
      // Assert: X distance should be zero (on vertical line)
      expect(distV.x).toBeCloseTo(0);
    });
    
    it('should calculate correct distance for a point between grid lines', () => {
      // Arrange: Point centered between grid lines
      const gridSize = GRID_SPACING.SMALL;
      const point: Point = { x: 25, y: 25 };
      
      // Act: Calculate distance to nearest grid lines
      const dist = distanceToGridLine(point, gridSize);
      
      // Assert: For a 10px grid, point at 25,25 is 5px from both lines
      expect(dist.x).toBeCloseTo(5);
      expect(dist.y).toBeCloseTo(5);
    });
  });
  
  describe('snapLineToStandardAngles', () => {
    it('should not change a horizontal line', () => {
      // Arrange: Create a perfectly horizontal line
      const start: Point = { x: 10, y: 30 };
      const end: Point = { x: 50, y: 30 };
      
      // Act: Try to snap the line
      const snapped = snapLineToStandardAngles(start, end);
      
      // Assert: End point should not change (already at standard angle)
      expect(snapped.x).toBeCloseTo(end.x);
      expect(snapped.y).toBeCloseTo(end.y);
    });
    
    it('should not change a vertical line', () => {
      // Arrange: Create a perfectly vertical line
      const start: Point = { x: 30, y: 10 };
      const end: Point = { x: 30, y: 50 };
      
      // Act: Try to snap the line
      const snapped = snapLineToStandardAngles(start, end);
      
      // Assert: End point should not change (already at standard angle)
      expect(snapped.x).toBeCloseTo(end.x);
      expect(snapped.y).toBeCloseTo(end.y);
    });
    
    it('should snap a diagonal line to 45 degrees', () => {
      // Arrange: Create a nearly 45-degree line
      const start: Point = { x: 10, y: 10 };
      const end: Point = { x: 48, y: 52 }; // Not exactly 45 degrees
      
      // Act: Snap to standard angle
      const snapped = snapLineToStandardAngles(start, end);
      
      // Calculate the original distance between points
      const dist = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
      
      // Assert: X and Y changes should be equal (45 degrees)
      expect(snapped.x - start.x).toBeCloseTo(snapped.y - start.y);
      
      // Distance should be preserved (line length doesn't change)
      const snappedDist = Math.sqrt(Math.pow(snapped.x - start.x, 2) + Math.pow(snapped.y - start.y, 2));
      expect(snappedDist).toBeCloseTo(dist);
    });
    
    it('should snap a near-horizontal line to be horizontal', () => {
      // Arrange: Create a nearly horizontal line
      const start: Point = { x: 10, y: 20 };
      const end: Point = { x: 50, y: 23 }; // Slight slope
      
      // Act: Snap to standard angle
      const snapped = snapLineToStandardAngles(start, end);
      
      // Assert: Y coordinate should match start point (horizontal)
      expect(snapped.y).toBeCloseTo(start.y);
    });
    
    it('should snap a near-vertical line to be vertical', () => {
      // Arrange: Create a nearly vertical line
      const start: Point = { x: 20, y: 10 };
      const end: Point = { x: 17, y: 50 }; // Slight slope
      
      // Act: Snap to standard angle
      const snapped = snapLineToStandardAngles(start, end);
      
      // Assert: X coordinate should match start point (vertical)
      expect(snapped.x).toBeCloseTo(start.x);
    });
  });
});
