
/**
 * Tests for the useDrawingState hook
 * @module hooks/__tests__/useDrawingState.test
 */
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useDrawingState } from '../useDrawingState';
import { Point } from '@/types';

describe('useDrawingState Hook', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useDrawingState());
    
    expect(result.current.drawingState).toEqual({
      isDrawing: false,
      startPoint: null,
      currentPoint: null,
      cursorPosition: null,
      midPoint: null,
      selectionActive: false,
      currentZoom: 1,
      points: [],
      distance: null,
      zoomLevel: 1,
      lastX: 0,
      lastY: 0,
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
      snapToGrid: true,
      toolType: 'line',
      width: 2,
      color: '#000000'
    });
  });
  
  it('should update state when starting to draw', () => {
    const { result } = renderHook(() => useDrawingState());
    const x = 100;
    const y = 100;
    
    act(() => {
      result.current.startDrawing(x, y);
    });
    
    expect(result.current.drawingState.isDrawing).toBe(true);
    expect(result.current.drawingState.startPoint?.x).toBe(x);
    expect(result.current.drawingState.startPoint?.y).toBe(y);
  });
  
  it('should update drawing state with new points', () => {
    const { result } = renderHook(() => useDrawingState());
    const startX = 100;
    const startY = 100;
    const nextX = 120;
    const nextY = 120;
    
    act(() => {
      result.current.startDrawing(startX, startY);
      result.current.updateDrawing(nextX, nextY);
    });
    
    expect(result.current.drawingState.currentPoint?.x).toBe(nextX);
    expect(result.current.drawingState.currentPoint?.y).toBe(nextY);
    expect(result.current.drawingState.points.length).toBe(2);
  });
  
  it('should end drawing correctly', () => {
    const { result } = renderHook(() => useDrawingState());
    const x = 100;
    const y = 100;
    
    act(() => {
      result.current.startDrawing(x, y);
      result.current.endDrawing(x + 50, y + 50);
    });
    
    expect(result.current.drawingState.isDrawing).toBe(false);
    expect(result.current.drawingState.points.length).toBe(2);
  });
  
  it('should reset drawing state', () => {
    const { result } = renderHook(() => useDrawingState());
    const x = 100;
    const y = 100;
    
    act(() => {
      result.current.startDrawing(x, y);
      result.current.resetDrawing();
    });
    
    expect(result.current.drawingState.isDrawing).toBe(false);
    expect(result.current.drawingState.startPoint).toBeNull();
  });
  
  it('should update distance measurement', () => {
    const { result } = renderHook(() => useDrawingState());
    const distance = 42.5;
    
    act(() => {
      result.current.updateDistance(distance);
    });
    
    expect(result.current.drawingState.distance).toBe(distance);
  });
  
  it('should update cursor position', () => {
    const { result } = renderHook(() => useDrawingState());
    const position = { x: 150, y: 150 } as Point;
    
    act(() => {
      result.current.updateCursorPosition(position);
    });
    
    expect(result.current.drawingState.cursorPosition).toEqual(position);
  });
});
