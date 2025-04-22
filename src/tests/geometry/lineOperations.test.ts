
import { describe, it, expect } from 'vitest';
import { 
  snapToGrid, 
  snapLineToGrid, 
  isExactGridMultiple, 
  isLineAlignedWithGrid,
  calculateDistance,
  calculateAngle,
  calculateMidpoint
} from '@/utils/geometry/lineOperations';
import { Point } from '@/types/core/Point';

describe('Line Operations', () => {
  describe('calculateDistance', () => {
    it('should calculate distance between two points', () => {
      const point1: Point = { x: 0, y: 0 };
      const point2: Point = { x: 3, y: 4 };
      
      expect(calculateDistance(point1, point2)).toBe(5);
    });
    
    it('should return 0 for the same point', () => {
      const point: Point = { x: 10, y: 10 };
      
      expect(calculateDistance(point, point)).toBe(0);
    });
  });
  
  describe('calculateAngle', () => {
    it('should calculate angle between two points', () => {
      const point1: Point = { x: 0, y: 0 };
      const point2: Point = { x: 10, y: 10 };
      
      expect(calculateAngle(point1, point2)).toBeCloseTo(45);
    });
    
    it('should handle horizontal line', () => {
      const point1: Point = { x: 0, y: 0 };
      const point2: Point = { x: 10, y: 0 };
      
      expect(calculateAngle(point1, point2)).toBe(0);
    });
    
    it('should handle vertical line', () => {
      const point1: Point = { x: 0, y: 0 };
      const point2: Point = { x: 0, y: 10 };
      
      expect(calculateAngle(point1, point2)).toBe(90);
    });
  });
  
  describe('calculateMidpoint', () => {
    it('should calculate the midpoint of a line', () => {
      const point1: Point = { x: 0, y: 0 };
      const point2: Point = { x: 10, y: 10 };
      
      expect(calculateMidpoint(point1, point2)).toEqual({ x: 5, y: 5 });
    });
  });
  
  describe('snapToGrid', () => {
    it('should snap a point to the nearest grid point', () => {
      const point: Point = { x: 23, y: 19 };
      const gridSize = 10;
      
      expect(snapToGrid(point, gridSize)).toEqual({ x: 20, y: 20 });
    });
    
    it('should round x and y independently', () => {
      const point: Point = { x: 16, y: 14 };
      const gridSize = 10;
      
      expect(snapToGrid(point, gridSize)).toEqual({ x: 20, y: 10 });
    });
    
    it('should handle negative coordinates', () => {
      const point: Point = { x: -23, y: -19 };
      const gridSize = 10;
      
      expect(snapToGrid(point, gridSize)).toEqual({ x: -20, y: -20 });
    });
  });
  
  describe('isExactGridMultiple', () => {
    it('should return true for values that are exact multiples of grid size', () => {
      expect(isExactGridMultiple(20, 10)).toBe(true);
      expect(isExactGridMultiple(50, 10)).toBe(true);
      expect(isExactGridMultiple(0, 10)).toBe(true);
    });
    
    it('should return false for values that are not exact multiples of grid size', () => {
      expect(isExactGridMultiple(23, 10)).toBe(false);
      expect(isExactGridMultiple(45.5, 10)).toBe(false);
    });
    
    it('should handle rounding errors', () => {
      // Due to floating point, this might not be exactly 40
      const value = 4 * 10.0001;
      expect(isExactGridMultiple(value, 10)).toBe(true);
    });
  });
  
  describe('snapLineToGrid', () => {
    it('should snap both endpoints of a line to the grid', () => {
      const start: Point = { x: 23, y: 19 };
      const end: Point = { x: 58, y: 42 };
      const gridSize = 10;
      
      const result = snapLineToGrid(start, end, gridSize);
      
      expect(result[0]).toEqual({ x: 20, y: 20 });
      expect(result[1]).toEqual({ x: 60, y: 40 });
    });
  });
});
