
/**
 * STUB TEST: This is a properly implemented test stub to fix TypeScript errors.
 * Will be properly implemented when the straight line tool is needed.
 */
import { renderHook, act } from '@testing-library/react-hooks';
import { useLineToolState } from '../useLineToolState';
import { Point } from '@/types/core/Point';

describe('useLineToolState', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useLineToolState());
    
    expect(result.current.lineState).toEqual({
      points: [],
      isActive: false
    });
  });
  
  it('should start a line with startLine', () => {
    const { result } = renderHook(() => useLineToolState({
      snapToGrid: true,
      gridSize: 20
    }));
    
    const point: Point = { x: 100, y: 100 };
    
    act(() => {
      result.current.startLine(point);
    });
    
    expect(result.current.lineState.points).toContainEqual(point);
    expect(result.current.lineState.isActive).toBe(true);
  });
  
  it('should update line with updateLine', () => {
    const { result } = renderHook(() => useLineToolState({
      snapToGrid: true,
      gridSize: 20
    }));
    
    const startPoint: Point = { x: 100, y: 100 };
    const updatePoint: Point = { x: 200, y: 200 };
    
    act(() => {
      result.current.startLine(startPoint);
      result.current.updateLine(updatePoint);
    });
    
    expect(result.current.lineState.points).toHaveLength(2);
    expect(result.current.lineState.points[1]).toEqual(updatePoint);
  });
  
  it('should complete line with completeLine', () => {
    const { result } = renderHook(() => useLineToolState({
      snapToGrid: true, 
      gridSize: 20
    }));
    
    const startPoint: Point = { x: 100, y: 100 };
    const endPoint: Point = { x: 200, y: 200 };
    
    act(() => {
      result.current.startLine(startPoint);
      result.current.updateLine(endPoint);
      result.current.completeLine();
    });
    
    expect(result.current.lineState.isActive).toBe(false);
  });
});

export {};
