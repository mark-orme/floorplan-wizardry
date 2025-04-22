
import { renderHook, act } from '@testing-library/react-hooks';
import { useLineState } from '../useLineState';
import { Point } from '@/types/core/Point';
import { Canvas } from 'fabric';

describe('useLineState', () => {
  const mockCanvasRef = { current: null } as React.RefObject<Canvas>;

  it('should toggle snap state', () => {
    const { result } = renderHook(() => useLineState({ 
      fabricCanvasRef: mockCanvasRef,
      lineColor: '#000000',
      lineThickness: 1,
      saveCurrentState: () => {}
    }));
    
    act(() => {
      result.current.toggleSnap();
    });
    
    expect(result.current.snapEnabled).toBe(true);
  });

  it('should handle drawing state', () => {
    const { result } = renderHook(() => useLineState({ 
      fabricCanvasRef: mockCanvasRef,
      lineColor: '#000000',
      lineThickness: 1,
      saveCurrentState: () => {}
    }));
    const point: Point = { x: 100, y: 100 };
    
    act(() => {
      result.current.startDrawing(point);
    });
    
    expect(result.current.startPoint).toEqual(point);
    expect(result.current.currentPoint).toEqual(point);
  });

  it('should update drawing position', () => {
    const { result } = renderHook(() => useLineState({ 
      fabricCanvasRef: mockCanvasRef,
      lineColor: '#000000',
      lineThickness: 1,
      saveCurrentState: () => {}
    }));
    const startPoint: Point = { x: 50, y: 50 };
    const newPoint: Point = { x: 150, y: 150 };
    
    act(() => {
      result.current.startDrawing(startPoint);
      result.current.continueDrawing(newPoint);
    });
    
    expect(result.current.currentPoint).toEqual(newPoint);
  });

  it('should clear state', () => {
    const { result } = renderHook(() => useLineState({ 
      fabricCanvasRef: mockCanvasRef,
      lineColor: '#000000',
      lineThickness: 1,
      saveCurrentState: () => {}
    }));
    const startPoint: Point = { x: 20, y: 20 };
    const currentPoint: Point = { x: 80, y: 80 };
    
    act(() => {
      result.current.startDrawing(startPoint);
      result.current.continueDrawing(currentPoint);
      result.current.completeDrawing();
    });
    
    expect(result.current.startPoint).toBeNull();
    expect(result.current.currentPoint).toBeNull();
    expect(result.current.snapEnabled).toBe(false);
  });
});
