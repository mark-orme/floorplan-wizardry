
/**
 * Tests for grid snapping utilities
 * @module grid/snapping.test
 */
import { describe, it, expect } from 'vitest';
import { 
  snapToGrid, 
  snapToAngle, 
  snapLineToStandardAngles,
  getNearestGridIntersection,
  distanceToNearestGridLine,
  getNearestPointOnGrid
} from './snapping';
import { GRID_SPACING } from '@/constants/numerics';

describe('Grid Snapping Utils', () => {
  // Test snapToGrid function
  describe('snapToGrid', () => {
    it('snaps points to exact grid intersections', () => {
      // Given a point and grid size
      const point = { x: 42, y: 38 };
      const gridSize = 10;
      
      // When we snap it to grid
      const snapped = snapToGrid(point, gridSize);
      
      // Then it should be snapped to the nearest grid intersection
      expect(snapped.x).toBe(40);
      expect(snapped.y).toBe(40);
    });
    
    it('handles invalid points by normalizing them', () => {
      // Given an invalid point
      const point = { x: NaN, y: undefined } as any;
      const gridSize = 10;
      
      // When we snap it to grid
      const snapped = snapToGrid(point, gridSize);
      
      // Then it should be handled gracefully
      expect(typeof snapped.x).toBe('number');
      expect(typeof snapped.y).toBe('number');
      expect(isNaN(snapped.x)).toBe(false);
      expect(isNaN(snapped.y)).toBe(false);
    });
    
    it('uses default grid size when none provided', () => {
      // Given a point and no grid size
      const point = { x: 42, y: 38 };
      
      // When we snap it to grid without specifying size
      const snapped = snapToGrid(point);
      
      // Then it should use the default GRID_SPACING
      const expectedX = Math.round(point.x / GRID_SPACING) * GRID_SPACING;
      const expectedY = Math.round(point.y / GRID_SPACING) * GRID_SPACING;
      expect(snapped.x).toBe(expectedX);
      expect(snapped.y).toBe(expectedY);
    });
  });
  
  // Test snapToAngle function
  describe('snapToAngle', () => {
    it('snaps angles to nearest increment', () => {
      // Given an angle and increment
      const angle = 42;
      const increment = 45;
      
      // When we snap it
      const snapped = snapToAngle(angle, increment);
      
      // Then it should be snapped to 45 degrees
      expect(snapped).toBe(45);
    });
    
    it('normalizes negative angles', () => {
      // Given a negative angle
      const angle = -30;
      
      // When we snap it with default increment (45)
      const snapped = snapToAngle(angle);
      
      // Then it should be normalized and snapped to 45 degrees
      expect(snapped).toBe(0); // -30 is closer to 0 than to 45
    });
    
    it('handles invalid angles', () => {
      // Given an invalid angle
      const angle = NaN;
      
      // When we snap it
      const snapped = snapToAngle(angle);
      
      // Then it should default to 0
      expect(snapped).toBe(0);
    });
  });
  
  // Test remaining functions
  describe('other snapping functions', () => {
    it('getNearestGridIntersection finds correct grid point', () => {
      // Test implementation
      const point = { x: 44, y: 48 };
      const result = getNearestGridIntersection(point, 10);
      
      // Points should snap to nearest grid intersection
      expect(result.x).toBe(40);
      expect(result.y).toBe(50);
    });
    
    it('snapLineToStandardAngles aligns lines to standard angles', () => {
      // Test with specific start/end points
      const start = { x: 100, y: 100 };
      const end = { x: 150, y: 140 }; // about 38.7 degrees
      
      const snapped = snapLineToStandardAngles(start, end);
      
      // Should snap to 45 degrees
      expect(Math.round(snapped.x)).toBe(142);
      expect(Math.round(snapped.y)).toBe(142);
    });
    
    it('distanceToNearestGridLine calculates correct distances', () => {
      const point = { x: 23, y: 47 };
      const gridSize = 10;
      
      const distances = distanceToNearestGridLine(point, gridSize);
      
      // Distance to nearest grid line should be calculated correctly
      expect(distances.x).toBe(3); // 23 is 3 away from 20
      expect(distances.y).toBe(3); // 47 is 3 away from 50
    });
  });
});
