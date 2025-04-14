
import { describe, test, expect } from 'vitest';
import { calculateGIA, formatGIA, extractPolygonPoints } from '@/utils/geometry/calculateGIA';
import { createMockObject } from '@/utils/test/mockFabricCanvas';
import { Point } from '@/types/core/Point';

describe('GIA Calculation', () => {
  test('should calculate area of a square correctly', () => {
    // Create a 10x10 square at (0,0)
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
      { x: 0, y: 10 }
    ];
    
    // Area should be 100 pixels
    const areaPixels = 100;
    
    // 100 pixels at 100px/m = 1 square meter
    const areaMeters = 0.01;
    
    expect(calculateGIA(points)).toBeCloseTo(areaMeters);
  });
  
  test('should calculate area of a rectangle correctly', () => {
    // Create a 20x10 rectangle
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 20, y: 0 },
      { x: 20, y: 10 },
      { x: 0, y: 10 }
    ];
    
    // Area should be 200 pixels
    const areaPixels = 200;
    
    // 200 pixels at 100px/m = 2 square meters
    const areaMeters = 0.02;
    
    expect(calculateGIA(points)).toBeCloseTo(areaMeters);
  });
  
  test('should calculate area of a triangle correctly', () => {
    // Create a right triangle
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 0, y: 10 }
    ];
    
    // Area should be 50 pixels
    const areaPixels = 50;
    
    // 50 pixels at 100px/m = 0.5 square meters
    const areaMeters = 0.005;
    
    expect(calculateGIA(points)).toBeCloseTo(areaMeters);
  });
  
  test('should return 0 for fewer than 3 points', () => {
    // Line with 2 points
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 10, y: 10 }
    ];
    
    expect(calculateGIA(points)).toBe(0);
    
    // Single point
    expect(calculateGIA([{ x: 5, y: 5 }])).toBe(0);
    
    // No points
    expect(calculateGIA([])).toBe(0);
  });
  
  test('should format GIA with units', () => {
    expect(formatGIA(1.2345)).toBe('1.23 m²');
    expect(formatGIA(0.01)).toBe('0.01 m²');
    expect(formatGIA(10)).toBe('10.00 m²');
  });
  
  test('should extract points from fabric polygon', () => {
    const mockPolygon = createMockObject('polygon', {
      points: [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 10, y: 10 },
        { x: 0, y: 10 }
      ],
      left: 5,
      top: 5
    });
    
    const points = extractPolygonPoints(mockPolygon);
    
    // Points should be offset by left/top
    expect(points).toEqual([
      { x: 5, y: 5 },
      { x: 15, y: 5 },
      { x: 15, y: 15 },
      { x: 5, y: 15 }
    ]);
  });
  
  test('should extract points from fabric rectangle', () => {
    const mockRect = createMockObject('rect', {
      left: 10,
      top: 20,
      width: 30,
      height: 40,
      scaleX: 1,
      scaleY: 1
    });
    
    const points = extractPolygonPoints(mockRect);
    
    expect(points).toEqual([
      { x: 10, y: 20 },
      { x: 40, y: 20 },
      { x: 40, y: 60 },
      { x: 10, y: 60 }
    ]);
  });
});
