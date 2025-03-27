
/**
 * Tests for the useSnapToGrid hook
 * @module hooks/__tests__/useSnapToGrid
 */
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useSnapToGrid } from '../useSnapToGrid';
import { Point } from '@/types/drawingTypes';

describe('useSnapToGrid Hook', () => {
  it('should initialize with snap enabled by default', () => {
    const { result } = renderHook(() => useSnapToGrid());
    
    expect(result.current.snapEnabled).toBe(true);
  });
  
  it('should toggle snap state when toggleSnap is called', () => {
    const { result } = renderHook(() => useSnapToGrid());
    
    // Initial state should be true
    expect(result.current.snapEnabled).toBe(true);
    
    // Toggle to false
    act(() => {
      result.current.toggleSnap();
    });
    
    expect(result.current.snapEnabled).toBe(false);
    
    // Toggle back to true
    act(() => {
      result.current.toggleSnap();
    });
    
    expect(result.current.snapEnabled).toBe(true);
  });
  
  it('should snap points to grid when snap is enabled', () => {
    const { result } = renderHook(() => useSnapToGrid());
    
    const testPoint: Point = { x: 23, y: 17 };
    const snappedPoint = result.current.snapPointToGrid(testPoint);
    
    // Should snap to nearest grid intersection (20, 20)
    expect(snappedPoint.x).toBe(20);
    expect(snappedPoint.y).toBe(20);
  });
  
  it('should not snap points when snap is disabled', () => {
    const { result } = renderHook(() => useSnapToGrid());
    
    // Disable snapping
    act(() => {
      result.current.toggleSnap();
    });
    
    const testPoint: Point = { x: 23, y: 17 };
    const resultPoint = result.current.snapPointToGrid(testPoint);
    
    // Should return the original point
    expect(resultPoint).toEqual(testPoint);
  });
  
  it('should snap lines to standard angles', () => {
    const { result } = renderHook(() => useSnapToGrid());
    
    const startPoint: Point = { x: 100, y: 100 };
    const endPoint: Point = { x: 150, y: 130 }; // ~37° angle
    
    const snappedEnd = result.current.snapLineToGrid(startPoint, endPoint);
    
    // Should snap to a 45° angle
    const dx = snappedEnd.x - startPoint.x;
    const dy = snappedEnd.y - startPoint.y;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    expect(Math.round(angle / 45) * 45).toBe(45);
  });
  
  it('should correctly detect if a point is snapped to grid', () => {
    const { result } = renderHook(() => useSnapToGrid());
    
    const originalPoint: Point = { x: 23, y: 17 };
    const snappedPoint: Point = { x: 20, y: 20 };
    
    const isSnapped = result.current.isSnappedToGrid(snappedPoint, originalPoint);
    
    // Should detect that the point was snapped (changed)
    expect(isSnapped).toBe(true);
    
    // A point that wasn't snapped
    const samePoint: Point = { x: 20, y: 20 };
    const notSnapped = result.current.isSnappedToGrid(samePoint, samePoint);
    
    // Should detect that the point wasn't snapped
    expect(notSnapped).toBe(false);
  });
  
  it('should correctly detect if a line is straightened', () => {
    const { result } = renderHook(() => useSnapToGrid());
    
    const startPoint: Point = { x: 100, y: 100 };
    const originalEnd: Point = { x: 150, y: 130 }; // ~37° angle
    const straightenedEnd: Point = { x: 150, y: 150 }; // 45° angle
    
    const isStraightened = result.current.isAutoStraightened(
      startPoint, 
      straightenedEnd, 
      originalEnd
    );
    
    // Should detect that the line was straightened
    expect(isStraightened).toBe(true);
    
    // A line that wasn't straightened
    const notStraightened = result.current.isAutoStraightened(
      startPoint,
      originalEnd,
      originalEnd
    );
    
    // Should detect that the line wasn't straightened
    expect(notStraightened).toBe(false);
  });
});
