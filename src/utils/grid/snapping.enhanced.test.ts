
/**
 * Enhanced tests for grid snapping utilities
 * Provides comprehensive test coverage for all snapping functions
 * @module utils/grid/snapping.enhanced.test
 */
import { describe, it, expect } from 'vitest';
import { 
  snap, 
  snapPointToGrid, 
  snapToGrid, 
  snapLineToGrid,
  snapToAngle,
  constrainToMajorAngles,
  isPointOnGrid,
  getNearestGridPoint,
  distanceToGrid,
  distanceToGridLine
} from './snapping';
import { Point } from '@/types/core/Point';

describe('Enhanced Grid Snapping Utilities', () => {
  // Define test grid size
  const GRID_SIZE = 20;
  
  describe('snap()', () => {
    it('snaps a value to the nearest grid line', () => {
      expect(snap(21, GRID_SIZE)).toBe(20);
      expect(snap(29, GRID_SIZE)).toBe(20);
      expect(snap(31, GRID_SIZE)).toBe(40);
    });
    
    it('handles negative values correctly', () => {
      expect(snap(-21, GRID_SIZE)).toBe(-20);
      expect(snap(-29, GRID_SIZE)).toBe(-20);
      expect(snap(-31, GRID_SIZE)).toBe(-40);
    });
    
    it('handles zero correctly', () => {
      expect(snap(0, GRID_SIZE)).toBe(0);
    });
    
    it('uses default grid size when not specified', () => {
      const result = snap(21);
      // This would depend on the default grid size in the constants
      expect(typeof result).toBe('number');
    });
  });
  
  describe('snapPointToGrid()', () => {
    it('snaps a point to nearest grid intersection', () => {
      const point: Point = { x: 21, y: 39 };
      const snapped = snapPointToGrid(point, GRID_SIZE);
      
      expect(snapped.x).toBe(20);
      expect(snapped.y).toBe(40);
    });
    
    it('handles points exactly on grid', () => {
      const point: Point = { x: 40, y: 60 };
      const snapped = snapPointToGrid(point, GRID_SIZE);
      
      expect(snapped.x).toBe(40);
      expect(snapped.y).toBe(60);
    });
    
    it('handles negative coordinates', () => {
      const point: Point = { x: -21, y: -39 };
      const snapped = snapPointToGrid(point, GRID_SIZE);
      
      expect(snapped.x).toBe(-20);
      expect(snapped.y).toBe(-40);
    });
  });
  
  describe('snapToGrid()', () => {
    it('is an alias for snapPointToGrid', () => {
      const point: Point = { x: 21, y: 39 };
      const snappedWithAlias = snapToGrid(point, GRID_SIZE);
      const snappedWithOriginal = snapPointToGrid(point, GRID_SIZE);
      
      expect(snappedWithAlias).toEqual(snappedWithOriginal);
    });
  });
  
  describe('snapLineToGrid()', () => {
    it('snaps both endpoints of a line to grid', () => {
      const start: Point = { x: 21, y: 39 };
      const end: Point = { x: 68, y: 52 };
      
      const snapped = snapLineToGrid(start, end, GRID_SIZE);
      
      expect(snapped.start.x).toBe(20);
      expect(snapped.start.y).toBe(40);
      expect(snapped.end.x).toBe(60);
      expect(snapped.end.y).toBe(60);
    });
    
    it('correctly returns a result object with start and end properties', () => {
      const start: Point = { x: 0, y: 0 };
      const end: Point = { x: 10, y: 10 };
      
      const result = snapLineToGrid(start, end, GRID_SIZE);
      
      expect(result).toHaveProperty('start');
      expect(result).toHaveProperty('end');
      expect(result.start).toHaveProperty('x');
      expect(result.start).toHaveProperty('y');
      expect(result.end).toHaveProperty('x');
      expect(result.end).toHaveProperty('y');
    });
  });
  
  describe('snapToAngle()', () => {
    it('snaps a line to standard 45-degree angles', () => {
      const start: Point = { x: 100, y: 100 };
      // Angle that's close to 45 degrees
      const end: Point = { x: 150, y: 145 };
      
      const snappedEnd = snapToAngle(start, end, 45);
      
      // Should snap to 45 degrees (perfect diagonal)
      const dx = snappedEnd.x - start.x;
      const dy = snappedEnd.y - start.y;
      const angleDeg = Math.atan2(dy, dx) * (180 / Math.PI);
      
      expect(Math.abs(angleDeg % 45)).toBeCloseTo(0, 1);
    });
    
    it('maintains the same distance between points', () => {
      const start: Point = { x: 100, y: 100 };
      const end: Point = { x: 150, y: 120 };
      
      const originalDistance = Math.sqrt(
        Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
      );
      
      const snappedEnd = snapToAngle(start, end, 45);
      
      const newDistance = Math.sqrt(
        Math.pow(snappedEnd.x - start.x, 2) + Math.pow(snappedEnd.y - start.y, 2)
      );
      
      // Distance should be approximately the same
      expect(newDistance).toBeCloseTo(originalDistance, 1);
    });
    
    it('snaps to custom angle intervals when provided', () => {
      const start: Point = { x: 100, y: 100 };
      // Angle that's close to 30 degrees
      const end: Point = { x: 150, y: 129 };
      
      const snappedEnd = snapToAngle(start, end, 30);
      
      // Should snap to 30 degrees
      const dx = snappedEnd.x - start.x;
      const dy = snappedEnd.y - start.y;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      
      expect(Math.abs(angle % 30)).toBeCloseTo(0, 0);
    });
  });
  
  describe('constrainToMajorAngles()', () => {
    it('returns object with start and end points', () => {
      const start: Point = { x: 100, y: 100 };
      const end: Point = { x: 200, y: 110 };
      
      const result = constrainToMajorAngles(start, end);
      
      expect(result).toHaveProperty('start');
      expect(result).toHaveProperty('end');
      expect(result.start).toEqual(start);
    });
    
    it('constrains to 45-degree diagonal when appropriate', () => {
      const start: Point = { x: 100, y: 100 };
      const end: Point = { x: 150, y: 160 }; // Similar x and y differences
      
      const result = constrainToMajorAngles(start, end);
      
      // Should snap to 45-degree angle
      const dx = result.end.x - start.x;
      const dy = result.end.y - start.y;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      
      expect(Math.abs(angle % 45)).toBeCloseTo(0, 0);
    });
    
    it('maintains the original start point', () => {
      const start: Point = { x: 100, y: 100 };
      const end: Point = { x: 150, y: 160 };
      
      const result = constrainToMajorAngles(start, end);
      
      expect(result.start).toEqual(start);
    });
  });
  
  describe('isPointOnGrid()', () => {
    it('returns true for points exactly on grid intersections', () => {
      const point: Point = { x: 40, y: 60 };
      expect(isPointOnGrid(point, GRID_SIZE)).toBe(true);
    });
    
    it('returns false for points not on grid intersections', () => {
      const point: Point = { x: 45, y: 65 };
      expect(isPointOnGrid(point, GRID_SIZE)).toBe(false);
    });
    
    it('uses threshold to determine proximity to grid', () => {
      const pointNearGrid: Point = { x: 39.8, y: 60.2 };
      expect(isPointOnGrid(pointNearGrid, GRID_SIZE, 0.5)).toBe(true);
      
      const pointFarFromGrid: Point = { x: 38, y: 62 };
      expect(isPointOnGrid(pointFarFromGrid, GRID_SIZE, 0.5)).toBe(false);
    });
  });
  
  describe('getNearestGridPoint()', () => {
    it('returns the nearest grid intersection', () => {
      const point: Point = { x: 38, y: 42 };
      const nearest = getNearestGridPoint(point, GRID_SIZE);
      
      expect(nearest.x).toBe(40);
      expect(nearest.y).toBe(40);
    });
    
    it('returns the exact point if already on grid', () => {
      const point: Point = { x: 60, y: 80 };
      const nearest = getNearestGridPoint(point, GRID_SIZE);
      
      expect(nearest).toEqual(point);
    });
  });
  
  describe('distanceToGrid()', () => {
    it('calculates correct distance to nearest grid intersection', () => {
      const point: Point = { x: 30, y: 30 };
      const distance = distanceToGrid(point, GRID_SIZE);
      
      // Distance to nearest grid point (40,40) = sqrt((40-30)^2 + (40-30)^2)
      expect(distance).toBeCloseTo(14.14, 1);
    });
    
    it('returns 0 for points exactly on grid', () => {
      const point: Point = { x: 40, y: 60 };
      const distance = distanceToGrid(point, GRID_SIZE);
      
      expect(distance).toBe(0);
    });
  });
  
  describe('distanceToGridLine()', () => {
    it('calculates correct distance to nearest grid lines', () => {
      const point: Point = { x: 30, y: 25 };
      const distances = distanceToGridLine(point, GRID_SIZE);
      
      // Distance to x grid line at 20 or 40
      expect(distances.x).toBe(10);
      // Distance to y grid line at 20 or 40
      expect(distances.y).toBe(5);
    });
    
    it('returns 0 for points exactly on grid lines', () => {
      const point: Point = { x: 40, y: 25 };
      const distances = distanceToGridLine(point, GRID_SIZE);
      
      expect(distances.x).toBe(0);
      expect(distances.y).toBe(5);
    });
  });
});
