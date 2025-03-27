
/**
 * Unit tests for grid utility functions
 * @module grid/__tests__/gridUtils
 */
import { describe, it, expect } from 'vitest';
import { snapToGrid, snapToAngle, snapLineToStandardAngles } from '../snapping';
import { GRID_SPACING } from '@/constants/numerics';
import { Point } from '@/types/drawingTypes';

describe('Grid Utilities', () => {
  describe('snapToGrid', () => {
    it('should snap points to the nearest grid intersection', () => {
      // Test cases with various points
      const testCases = [
        { input: { x: 23, y: 19 }, expected: { x: 20, y: 20 } },
        { input: { x: 17, y: 22 }, expected: { x: 20, y: 20 } },
        { input: { x: 46, y: 42 }, expected: { x: 50, y: 40 } },
        { input: { x: 10, y: 10 }, expected: { x: 10, y: 10 } } // Already on grid
      ];
      
      // Test each case with the default grid size
      testCases.forEach(({ input, expected }) => {
        const result = snapToGrid(input);
        expect(result.x).toBe(expected.x);
        expect(result.y).toBe(expected.y);
      });
    });
    
    it('should handle edge cases gracefully', () => {
      // Test with null/undefined
      const result1 = snapToGrid(null as unknown as Point);
      expect(result1).toEqual({ x: 0, y: 0 });
      
      // Test with negative coordinates
      const result2 = snapToGrid({ x: -23, y: -19 });
      expect(result2).toEqual({ x: -20, y: -20 });
    });
    
    it('should work with custom grid sizes', () => {
      const input = { x: 23, y: 19 };
      const result1 = snapToGrid(input, 5);
      expect(result1).toEqual({ x: 25, y: 20 });
      
      const result2 = snapToGrid(input, 25);
      expect(result2).toEqual({ x: 25, y: 25 });
    });
  });
  
  describe('snapToAngle', () => {
    it('should snap angles to the nearest increment', () => {
      // Test cases with various angles
      const testCases = [
        { input: 12, increment: 45, expected: 0 },
        { input: 30, increment: 45, expected: 45 },
        { input: 89, increment: 90, expected: 90 },
        { input: 180, increment: 45, expected: 180 },
        { input: -30, increment: 45, expected: 0 } // Negative angles normalized
      ];
      
      testCases.forEach(({ input, increment, expected }) => {
        const result = snapToAngle(input, increment);
        expect(result).toBe(expected);
      });
    });
    
    it('should use default 45° increment when not specified', () => {
      expect(snapToAngle(22)).toBe(0);
      expect(snapToAngle(30)).toBe(45);
      expect(snapToAngle(100)).toBe(90);
    });
  });
  
  describe('snapLineToStandardAngles', () => {
    it('should constrain lines to standard angles', () => {
      const start: Point = { x: 100, y: 100 };
      
      // Almost horizontal line (should snap to horizontal)
      const result1 = snapLineToStandardAngles(
        start,
        { x: 200, y: 110 }
      );
      expect(result1.y).toBeCloseTo(100, 0); // Should be horizontal
      
      // Almost 45° line (should snap to 45°)
      const result2 = snapLineToStandardAngles(
        start,
        { x: 200, y: 190 }
      );
      expect(result2.y).toBeCloseTo(200, 0); // Should be at 45°
    });
    
    it('should maintain approximate line length when snapping', () => {
      const start: Point = { x: 100, y: 100 };
      const end: Point = { x: 200, y: 120 };
      
      // Calculate original length
      const originalLength = Math.sqrt(
        Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
      );
      
      // Snap line
      const snapped = snapLineToStandardAngles(start, end);
      
      // Calculate new length
      const newLength = Math.sqrt(
        Math.pow(snapped.x - start.x, 2) + Math.pow(snapped.y - start.y, 2)
      );
      
      // Length should be approximately preserved
      expect(newLength).toBeCloseTo(originalLength, 0);
    });
  });
});
