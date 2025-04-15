
/**
 * Unit tests for line operations
 */
import { describe, it, expect } from 'vitest';
import { 
  calculateDistance,
  calculateMidpoint,
  calculateAngle,
  isExactGridMultiple,
  isLineAlignedWithGrid,
  snapToGrid,
  snapLineToGrid
} from '@/utils/geometry/lineOperations';
import { Point, Line } from '@/types/core/Geometry';
import { GRID_SPACING } from '@/constants/numerics';

describe('lineOperations', () => {
  describe('calculateDistance', () => {
    it('should calculate distance between two points', () => {
      const p1 = { x: 0, y: 0 };
      const p2 = { x: 3, y: 4 };
      
      expect(calculateDistance(p1, p2)).toBe(5);
    });
    
    it('should return 0 for same point', () => {
      const p = { x: 10, y: 20 };
      
      expect(calculateDistance(p, p)).toBe(0);
    });
  });
  
  describe('calculateMidpoint', () => {
    it('should calculate midpoint between two points', () => {
      const p1 = { x: 10, y: 20 };
      const p2 = { x: 20, y: 40 };
      
      const midpoint = calculateMidpoint(p1, p2);
      
      expect(midpoint.x).toBe(15);
      expect(midpoint.y).toBe(30);
    });
  });
  
  describe('calculateAngle', () => {
    it('should calculate angle for horizontal line (right)', () => {
      const p1 = { x: 0, y: 0 };
      const p2 = { x: 10, y: 0 };
      
      expect(calculateAngle(p1, p2)).toBe(0);
    });
    
    it('should calculate angle for vertical line (down)', () => {
      const p1 = { x: 0, y: 0 };
      const p2 = { x: 0, y: 10 };
      
      expect(calculateAngle(p1, p2)).toBe(90);
    });
    
    it('should calculate angle for horizontal line (left)', () => {
      const p1 = { x: 10, y: 0 };
      const p2 = { x: 0, y: 0 };
      
      expect(calculateAngle(p1, p2)).toBe(180);
    });
    
    it('should calculate angle for vertical line (up)', () => {
      const p1 = { x: 0, y: 10 };
      const p2 = { x: 0, y: 0 };
      
      expect(calculateAngle(p1, p2)).toBe(270);
    });
    
    it('should calculate angle for diagonal line (45 degrees)', () => {
      const p1 = { x: 0, y: 0 };
      const p2 = { x: 10, y: 10 };
      
      expect(calculateAngle(p1, p2)).toBeCloseTo(45, 0);
    });
  });
  
  describe('isExactGridMultiple', () => {
    it('should return true for values that are exact multiples of grid size', () => {
      expect(isExactGridMultiple(20, 20)).toBe(true);
      expect(isExactGridMultiple(40, 20)).toBe(true);
      expect(isExactGridMultiple(100, 20)).toBe(true);
    });
    
    it('should return false for values that are not exact multiples of grid size', () => {
      expect(isExactGridMultiple(15, 20)).toBe(false);
      expect(isExactGridMultiple(37, 20)).toBe(false);
      expect(isExactGridMultiple(103, 20)).toBe(false);
    });
    
    it('should work with custom grid sizes', () => {
      expect(isExactGridMultiple(25, 5)).toBe(true);
      expect(isExactGridMultiple(27, 5)).toBe(false);
    });
    
    it('should use default grid size when not specified', () => {
      // Using default grid size of 20
      expect(isExactGridMultiple(20)).toBe(true);
      expect(isExactGridMultiple(15)).toBe(false);
    });
  });
  
  describe('isLineAlignedWithGrid', () => {
    it('should return true when point is on grid intersection', () => {
      const point: Point = { x: 20, y: 20 };
      
      expect(isLineAlignedWithGrid(point, 20)).toBe(true);
    });
    
    it('should return false when point is not on grid intersection', () => {
      const point: Point = { x: 15, y: 20 };
      
      expect(isLineAlignedWithGrid(point, 20)).toBe(false);
    });
    
    it('should handle line objects properly', () => {
      const line = {
        start: { x: 20, y: 20 },
        end: { x: 40, y: 40 }
      };
      
      // Type assertion to get the test to compile
      expect(isLineAlignedWithGrid(line as any, 20)).toBe(true);
      
      const nonAlignedLine = {
        start: { x: 20, y: 20 },
        end: { x: 41, y: 40 }
      };
      
      expect(isLineAlignedWithGrid(nonAlignedLine as any, 20)).toBe(false);
    });
  });
  
  describe('snapToGrid', () => {
    it('should snap point to grid', () => {
      const point: Point = { x: 18, y: 22 };
      const snapped = snapToGrid(point, 20);
      
      expect(snapped.x).toBe(20);
      expect(snapped.y).toBe(20);
    });
    
    it('should not change points that are already on grid', () => {
      const point: Point = { x: 20, y: 40 };
      const snapped = snapToGrid(point, 20);
      
      expect(snapped.x).toBe(20);
      expect(snapped.y).toBe(40);
    });
  });
  
  describe('snapLineToGrid', () => {
    it('should snap line endpoints to grid', () => {
      const line: Line = {
        start: { x: 18, y: 22 },
        end: { x: 42, y: 38 }
      };
      
      const snapped = snapLineToGrid(line, 20);
      
      expect(snapped.start.x).toBe(20);
      expect(snapped.start.y).toBe(20);
      expect(snapped.end.x).toBe(40);
      expect(snapped.end.y).toBe(40);
    });
  });
});
