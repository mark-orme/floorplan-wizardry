
import { renderHook, act } from '@testing-library/react-hooks';
import { useSnapToGrid } from '../useSnapToGrid';
import { vi } from 'vitest';

describe('useSnapToGrid', () => {
  it('should initialize with default options', () => {
    const { result } = renderHook(() => useSnapToGrid());
    
    expect(result.current.snapEnabled).toBe(true);
    expect(result.current.snapThreshold).toBe(10);
    expect(result.current.gridSize).toBe(20);
  });
  
  it('should toggle snap to grid', () => {
    const { result } = renderHook(() => useSnapToGrid({
      initialSnapEnabled: true
    }));
    
    act(() => {
      result.current.toggleSnap();
    });
    
    expect(result.current.snapEnabled).toBe(false);
    
    act(() => {
      result.current.toggleSnap();
    });
    
    expect(result.current.snapEnabled).toBe(true);
  });
  
  it('should set snap enabled state directly', () => {
    const { result } = renderHook(() => useSnapToGrid());
    
    act(() => {
      result.current.setSnapEnabled(false);
    });
    
    expect(result.current.snapEnabled).toBe(false);
  });
  
  it('should snap a point to the grid when enabled', () => {
    const { result } = renderHook(() => useSnapToGrid({
      gridSize: 10,
      snapThreshold: 5
    }));
    
    // Point is close to grid point (10, 10)
    const snappedPoint = result.current.snapPointToGrid({ x: 12, y: 8 });
    expect(snappedPoint).toEqual({ x: 10, y: 10 });
  });
  
  it('should not snap a point when disabled', () => {
    const { result } = renderHook(() => useSnapToGrid({
      initialSnapEnabled: false,
      gridSize: 10
    }));
    
    const snappedPoint = result.current.snapPointToGrid({ x: 12, y: 8 });
    expect(snappedPoint).toEqual({ x: 12, y: 8 }); // No snapping
  });
  
  it('should not snap when point is far from grid point', () => {
    const { result } = renderHook(() => useSnapToGrid({
      gridSize: 10,
      snapThreshold: 2
    }));
    
    // Point is too far from grid point to snap (threshold is 2)
    const snappedPoint = result.current.snapPointToGrid({ x: 14, y: 14 });
    expect(snappedPoint).toEqual({ x: 14, y: 14 }); // No snapping
  });
  
  it('should update grid size', () => {
    const { result } = renderHook(() => useSnapToGrid());
    
    act(() => {
      result.current.setGridSize(50);
    });
    
    expect(result.current.gridSize).toBe(50);
  });
  
  it('should update snap threshold', () => {
    const { result } = renderHook(() => useSnapToGrid());
    
    act(() => {
      result.current.setSnapThreshold(15);
    });
    
    expect(result.current.snapThreshold).toBe(15);
  });
});
