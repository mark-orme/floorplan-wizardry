import { renderHook, act } from '@testing-library/react-hooks';
import { useLineState } from '../useLineState';
import { Point } from '@/types/core/Point';

describe('useLineState', () => {
  it('should toggle snap state', () => {
    const { result } = renderHook(() => useLineState());
    
    act(() => {
      result.current.toggleSnap();
    });
    
    expect(result.current.snapEnabled).toBe(true);
  });

  // Update tests to use current API
  it('should handle drawing state', () => {
    const { result } = renderHook(() => useLineState());
    const point: Point = { x: 100, y: 100 };
    
    act(() => {
      result.current.startDrawing(point);
    });
    
    expect(result.current.startPoint).toEqual(point);
    expect(result.current.currentPoint).toEqual(point);
  });

  it('should update current point', () => {
    const { result } = renderHook(() => useLineState());
    const startPoint: Point = { x: 50, y: 50 };
    const newPoint: Point = { x: 150, y: 150 };
    
    act(() => {
      result.current.startDrawing(startPoint);
      result.current.updateCurrentPoint(newPoint);
    });
    
    expect(result.current.currentPoint).toEqual(newPoint);
  });

  it('should reset state', () => {
    const { result } = renderHook(() => useLineState());
    const startPoint: Point = { x: 20, y: 20 };
    const currentPoint: Point = { x: 80, y: 80 };
    
    act(() => {
      result.current.startDrawing(startPoint);
      result.current.updateCurrentPoint(currentPoint);
      result.current.reset();
    });
    
    expect(result.current.startPoint).toBeNull();
    expect(result.current.currentPoint).toBeNull();
    expect(result.current.snapEnabled).toBe(false);
  });
});
