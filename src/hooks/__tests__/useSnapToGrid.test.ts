
/**
 * Tests for useSnapToGrid hook
 */
import { describe, test, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSnapToGrid } from '../useSnapToGrid';
import { Point } from '@/types/core/Geometry';

describe('useSnapToGrid hook', () => {
  test('should return correct initial state', () => {
    const { result } = renderHook(() => useSnapToGrid());
    
    expect(result.current.snapEnabled).toBe(true);
    expect(result.current.isAutoStraightened).toBe(false);
    expect(typeof result.current.toggleSnap).toBe('function');
    expect(typeof result.current.snapPointToGrid).toBe('function');
    expect(typeof result.current.snapLineToGrid).toBe('function');
    expect(typeof result.current.isSnappedToGrid).toBe('function');
  });
  
  test('should toggle snap', () => {
    const { result } = renderHook(() => useSnapToGrid());
    
    // Initially true
    expect(result.current.snapEnabled).toBe(true);
    
    // Toggle it off
    act(() => {
      result.current.toggleSnap();
    });
    
    expect(result.current.snapEnabled).toBe(false);
    
    // Toggle it back on
    act(() => {
      result.current.toggleSnap();
    });
    
    expect(result.current.snapEnabled).toBe(true);
  });
  
  test('should snap points to grid when enabled', () => {
    const { result } = renderHook(() => useSnapToGrid());
    
    // Create a point that's slightly off grid
    const point: Point = { x: 9.3, y: 11.7 };
    
    // Should snap to closest grid point
    let snappedPoint = result.current.snapPointToGrid(point);
    expect(snappedPoint.x).toBe(10);
    expect(snappedPoint.y).toBe(10);
  });
  
  test('should not snap points when disabled', () => {
    const { result } = renderHook(() => useSnapToGrid());
    
    // Turn off snapping
    act(() => {
      result.current.toggleSnap();
    });
    
    // Create a point that's slightly off grid
    const point: Point = { x: 9.3, y: 11.7 };
    
    // Should not snap
    let snappedPoint = result.current.snapPointToGrid(point);
    expect(snappedPoint.x).toBe(9.3);
    expect(snappedPoint.y).toBe(11.7);
  });
  
  test('should correctly identify if a point is on grid', () => {
    const { result } = renderHook(() => useSnapToGrid());
    
    // Create points
    const onGridPoint: Point = { x: 10, y: 10 };
    const offGridPoint: Point = { x: 13, y: 17 };
    const nearGridPoint: Point = { x: 9.8, y: 10.2 }; // Within threshold
    
    expect(result.current.isSnappedToGrid(onGridPoint)).toBe(true);
    expect(result.current.isSnappedToGrid(offGridPoint)).toBe(false);
    expect(result.current.isSnappedToGrid(nearGridPoint)).toBe(true);
  });
  
  test('should snap lines to grid', () => {
    const { result } = renderHook(() => useSnapToGrid());
    
    const start: Point = { x: 9.3, y: 11.7 };
    const end: Point = { x: 19.7, y: 21.3 };
    
    const snappedLine = result.current.snapLineToGrid(start, end);
    
    expect(snappedLine.start.x).toBe(10);
    expect(snappedLine.start.y).toBe(10);
    expect(snappedLine.end.x).toBe(20);
    expect(snappedLine.end.y).toBe(20);
  });
});
