
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
  snapToGrid
} from '@/utils/geometry/lineOperations';
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
      expect(isExactGridMultiple(20)).toBe(true);
      expect(isExactGridMultiple(40)).toBe(true);
      expect(isExactGridMultiple(100)).toBe(true);
    });
    
    it('should return false for values that are not exact multiples of grid size', () => {
      expect(isExactGridMultiple(15)).toBe(false);
      expect(isExactGridMultiple(37)).toBe(false);
      expect(isExactGridMultiple(103)).toBe(false);
    });
    
    it('should work with custom grid sizes', () => {
      expect(isExactGridMultiple(25, 5)).toBe(true);
      expect(isExactGridMultiple(27, 5)).toBe(false);
    });
  });
  
  describe('isLineAlignedWithGrid', () => {
    it('should return true when both points are on grid intersections', () => {
      const p1 = { x: 20, y: 20 };
      const p2 = { x: 60, y: 80 };
      
      expect(isLineAlignedWithGrid(p1, p2)).toBe(true);
    });
    
    it('should return false when one or both points are not on grid intersections', () => {
      const p1 = { x: 20, y: 20 };
      const p2 = { x: 65, y: 85 };
      
      expect(isLineAlignedWithGrid(p1, p2)).toBe(false);
    });
  });
  
  describe('snapToGrid', () => {
    it('should snap a line to the grid', () => {
      const line = {
        start: { x: 22, y: 18 },
        end: { x: 58, y: 82 }
      };
      
      const snapped = snapToGrid(line);
      
      expect(snapped.start.x).toBe(20);
      expect(snapped.start.y).toBe(20);
      expect(snapped.end.x).toBe(60);
      expect(snapped.end.y).toBe(80);
    });
    
    it('should snap to custom grid size', () => {
      const line = {
        start: { x: 22, y: 18 },
        end: { x: 58, y: 82 }
      };
      
      const snapped = snapToGrid(line, 10);
      
      expect(snapped.start.x).toBe(20);
      expect(snapped.start.y).toBe(20);
      expect(snapped.end.x).toBe(60);
      expect(snapped.end.y).toBe(80);
    });
  });
});
