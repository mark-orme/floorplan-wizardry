
/**
 * Tests for grid snapping utilities
 * @module grid/snapping.test
 */
import { describe, it, expect } from 'vitest';
import { Point } from '@/types/core/Point';
import { snapPointToGrid, isPointOnGrid, distanceToGridLine, snapLineToStandardAngles } from './snapping';
import { GRID_SPACING } from '@/constants/numerics';

describe('Grid Snapping Utilities', () => {
  describe('snapPointToGrid', () => {
    it('should not change a point that is already on the grid', () => {
      const gridSize = GRID_SPACING.SMALL;
      const point: Point = { x: 20, y: 30 };
      const snapped = snapPointToGrid(point, gridSize);
      
      expect(snapped.x).toBe(20);
      expect(snapped.y).toBe(30);
    });
    
    it('should snap a point to the nearest grid intersection', () => {
      const gridSize = GRID_SPACING.SMALL;
      const point: Point = { x: 22, y: 29 };
      const snapped = snapPointToGrid(point, gridSize);
      
      expect(snapped.x).toBe(20);
      expect(snapped.y).toBe(30);
    });
    
    it('should round to the nearest grid line', () => {
      const gridSize = GRID_SPACING.SMALL;
      const testCases = [
        { input: { x: 16, y: 26 }, expected: { x: 20, y: 30 } },
        { input: { x: 24, y: 34 }, expected: { x: 20, y: 30 } },
        { input: { x: 26, y: 26 }, expected: { x: 30, y: 30 } }
      ];
      
      testCases.forEach(({ input, expected }) => {
        const snapped = snapPointToGrid(input, gridSize);
        expect(snapped.x).toBe(expected.x);
        expect(snapped.y).toBe(expected.y);
      });
    });
  });
  
  describe('isPointOnGrid', () => {
    it('should return true for a point exactly on a grid intersection', () => {
      const gridSize = GRID_SPACING.SMALL;
      const point: Point = { x: 20, y: 30 };
      
      const result = isPointOnGrid(point, gridSize);
      expect(result).toBe(true);
    });
    
    it('should return false for a point not on a grid intersection', () => {
      const gridSize = GRID_SPACING.SMALL;
      const point: Point = { x: 23, y: 27 };
      
      const result = isPointOnGrid(point, gridSize);
      expect(result).toBe(false);
    });
    
    it('should handle points very close to grid intersections', () => {
      const gridSize = GRID_SPACING.SMALL;
      const point: Point = { x: 20.0001, y: 30.0001 };
      
      const result = isPointOnGrid(point, gridSize);
      expect(result).toBe(true);
    });
  });
  
  describe('distanceToGridLine', () => {
    it('should return zero distance for a point on a grid line', () => {
      const gridSize = GRID_SPACING.SMALL;
      
      // Point on a horizontal grid line
      const pointH: Point = { x: 25, y: 30 };
      const distH = distanceToGridLine(pointH, gridSize);
      expect(distH.y).toBeCloseTo(0);
      
      // Point on a vertical grid line
      const pointV: Point = { x: 20, y: 35 };
      const distV = distanceToGridLine(pointV, gridSize);
      expect(distV.x).toBeCloseTo(0);
    });
    
    it('should calculate correct distance for a point between grid lines', () => {
      const gridSize = GRID_SPACING.SMALL;
      const point: Point = { x: 25, y: 25 };
      
      const dist = distanceToGridLine(point, gridSize);
      
      // For a 10px grid, a point at 25,25 is 5px from both vertical and horizontal lines
      expect(dist.x).toBeCloseTo(5);
      expect(dist.y).toBeCloseTo(5);
    });
  });
  
  describe('snapLineToStandardAngles', () => {
    it('should not change a horizontal line', () => {
      const start: Point = { x: 10, y: 30 };
      const end: Point = { x: 50, y: 30 };
      
      const snapped = snapLineToStandardAngles(start, end);
      expect(snapped.x).toBeCloseTo(end.x);
      expect(snapped.y).toBeCloseTo(end.y);
    });
    
    it('should not change a vertical line', () => {
      const start: Point = { x: 30, y: 10 };
      const end: Point = { x: 30, y: 50 };
      
      const snapped = snapLineToStandardAngles(start, end);
      expect(snapped.x).toBeCloseTo(end.x);
      expect(snapped.y).toBeCloseTo(end.y);
    });
    
    it('should snap a diagonal line to 45 degrees', () => {
      const start: Point = { x: 10, y: 10 };
      const end: Point = { x: 48, y: 52 };
      
      const snapped = snapLineToStandardAngles(start, end);
      
      // Distance from start to end
      const dist = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
      
      // For a 45-degree line, x and y changes should be equal
      expect(snapped.x - start.x).toBeCloseTo(snapped.y - start.y);
      
      // Distance should be preserved
      const snappedDist = Math.sqrt(Math.pow(snapped.x - start.x, 2) + Math.pow(snapped.y - start.y, 2));
      expect(snappedDist).toBeCloseTo(dist);
    });
    
    it('should snap a near-horizontal line to be horizontal', () => {
      const start: Point = { x: 10, y: 20 };
      const end: Point = { x: 50, y: 23 };
      
      const snapped = snapLineToStandardAngles(start, end);
      expect(snapped.y).toBeCloseTo(start.y);
    });
    
    it('should snap a near-vertical line to be vertical', () => {
      const start: Point = { x: 20, y: 10 };
      const end: Point = { x: 17, y: 50 };
      
      const snapped = snapLineToStandardAngles(start, end);
      expect(snapped.x).toBeCloseTo(start.x);
    });
  });
});
