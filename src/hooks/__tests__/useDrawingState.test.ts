
import { vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDrawingState } from '@/hooks/canvas/drawing/useDrawingState';
import { DrawingMode } from '@/constants/drawingModes';

describe('useDrawingState', () => {
  test('should initialize with default state', () => {
    const { result } = renderHook(() => useDrawingState());
    
    expect(result.current.state).toEqual({
      isDrawing: false,
      startPoint: null,
      currentPoint: null,
      points: [],
      activeTool: DrawingMode.SELECT,
      lineColor: '#000000',
      lineThickness: 2
    });
  });

  test('should start drawing', () => {
    const { result } = renderHook(() => useDrawingState());
    
    act(() => {
      result.current.startDrawing({ x: 10, y: 20 });
    });
    
    expect(result.current.state.isDrawing).toBe(true);
    expect(result.current.state.startPoint).toEqual({ x: 10, y: 20 });
    expect(result.current.state.currentPoint).toEqual({ x: 10, y: 20 });
    expect(result.current.state.points).toEqual([{ x: 10, y: 20 }]);
  });

  test('should continue drawing', () => {
    const { result } = renderHook(() => useDrawingState());
    
    act(() => {
      result.current.startDrawing({ x: 10, y: 20 });
    });
    
    act(() => {
      result.current.continueDrawing({ x: 15, y: 25 });
    });
    
    expect(result.current.state.currentPoint).toEqual({ x: 15, y: 25 });
    expect(result.current.state.points).toEqual([{ x: 10, y: 20 }, { x: 15, y: 25 }]);
  });
});
