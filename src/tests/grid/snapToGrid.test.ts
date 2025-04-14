
import { describe, test, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSnapToGrid } from '@/hooks/useSnapToGrid';
import { snap, snapPointToGrid, snapLineToGrid } from '@/utils/grid/snapping';
import { Point } from '@/types/core/Point';

describe('Snap to Grid Functions', () => {
  test('snap function should round values to nearest grid line', () => {
    expect(snap(9.3, 10)).toBe(10);
    expect(snap(15, 10)).toBe(20);
    expect(snap(42, 5)).toBe(40);
    expect(snap(-8.7, 10)).toBe(-10);
  });
  
  test('snapPointToGrid should snap points to grid intersections', () => {
    const point1: Point = { x: 9.3, y: 11.7 };
    const point2: Point = { x: 42, y: 38 };
    
    expect(snapPointToGrid(point1, 10)).toEqual({ x: 10, y: 10 });
    expect(snapPointToGrid(point2, 5)).toEqual({ x: 40, y: 40 });
  });
  
  test('snapLineToGrid should snap both endpoints and straighten lines', () => {
    const start: Point = { x: 9.3, y: 11.7 };
    const end: Point = { x: 48.6, y: 13.2 };
    
    const result = snapLineToGrid(start, end, 10);
    
    // Both points should be snapped to grid
    expect(result.start).toEqual({ x: 10, y: 10 });
    
    // End point should be snapped and on the horizontal line from start
    expect(result.end.x).toBe(50);
    expect(result.end.y).toBe(10); // Should be horizontally aligned with start
  });
});

describe('useSnapToGrid Hook', () => {
  test('should initialize with default values', () => {
    const { result } = renderHook(() => useSnapToGrid());
    
    expect(result.current.snapEnabled).toBe(true);
    expect(typeof result.current.toggleSnapToGrid).toBe('function');
    expect(typeof result.current.snapPointToGrid).toBe('function');
    expect(typeof result.current.snapLineToGrid).toBe('function');
  });
  
  test('should toggle snap state', () => {
    const { result } = renderHook(() => useSnapToGrid());
    
    // Initially enabled
    expect(result.current.snapEnabled).toBe(true);
    
    // Toggle to disabled
    act(() => {
      result.current.toggleSnapToGrid();
    });
    
    expect(result.current.snapEnabled).toBe(false);
    
    // Toggle back to enabled
    act(() => {
      result.current.toggleSnapToGrid();
    });
    
    expect(result.current.snapEnabled).toBe(true);
  });
  
  test('should not snap when disabled', () => {
    const { result } = renderHook(() => useSnapToGrid({ initialSnapEnabled: false }));
    
    const point: Point = { x: 9.3, y: 11.7 };
    const snappedPoint = result.current.snapPointToGrid(point);
    
    // Should return the original point
    expect(snappedPoint).toEqual(point);
    expect(snappedPoint).not.toBe(point); // But a new object
  });
  
  test('should snap points to grid when enabled', () => {
    const { result } = renderHook(() => useSnapToGrid());
    
    const point: Point = { x: 9.3, y: 11.7 };
    const snappedPoint = result.current.snapPointToGrid(point);
    
    // Should be snapped to nearest grid point
    expect(snappedPoint.x).toBe(10);
    expect(snappedPoint.y).toBe(10);
  });
  
  test('should snap lines to grid when enabled', () => {
    const { result } = renderHook(() => useSnapToGrid());
    
    const start: Point = { x: 9.3, y: 11.7 };
    const end: Point = { x: 19.7, y: 11.3 };
    
    const { start: snappedStart, end: snappedEnd } = result.current.snapLineToGrid(start, end);
    
    // Both points should be snapped
    expect(snappedStart.x).toBe(10);
    expect(snappedStart.y).toBe(10);
    expect(snappedEnd.x).toBe(20);
    expect(snappedEnd.y).toBe(10); // Should align horizontally
  });
});
