
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
      distance: null
    });
  });
  
  it('should update state when starting to draw', () => {
    const { result } = renderHook(() => useDrawingState());
    const testPoint: Point = { x: 100, y: 100 };
    
    act(() => {
      result.current.startDrawing(testPoint);
    });
    
    expect(result.current.drawingState.isDrawing).toBe(true);
    expect(result.current.drawingState.startPoint).toEqual(testPoint);
    expect(result.current.drawingState.currentPoint).toEqual(testPoint);
    expect(result.current.drawingState.points).toEqual([testPoint]);
  });
  
  it('should update drawing state with new points', () => {
    const { result } = renderHook(() => useDrawingState());
    const startPoint: Point = { x: 100, y: 100 };
    const nextPoint: Point = { x: 120, y: 120 };
    
    act(() => {
      result.current.startDrawing(startPoint);
      result.current.updateDrawing(nextPoint);
    });
    
    expect(result.current.drawingState.currentPoint).toEqual(nextPoint);
    expect(result.current.drawingState.points).toEqual([startPoint, nextPoint]);
  });
  
  it('should end drawing correctly', () => {
    const { result } = renderHook(() => useDrawingState());
    const testPoint: Point = { x: 100, y: 100 };
    
    act(() => {
      result.current.startDrawing(testPoint);
      result.current.endDrawing();
    });
    
    expect(result.current.drawingState.isDrawing).toBe(false);
    expect(result.current.drawingState.startPoint).toEqual(testPoint); // Should keep start point
  });
  
  it('should reset drawing state', () => {
    const { result } = renderHook(() => useDrawingState());
    const testPoint: Point = { x: 100, y: 100 };
    
    act(() => {
      result.current.startDrawing(testPoint);
      result.current.resetDrawing();
    });
    
    expect(result.current.drawingState).toEqual({
      isDrawing: false,
      startPoint: null,
      currentPoint: null,
      cursorPosition: null,
      midPoint: null,
      selectionActive: false,
      currentZoom: 1,
      points: [],
      distance: null
    });
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
    const position: Point = { x: 150, y: 150 };
    
    act(() => {
      result.current.updateCursorPosition(position);
    });
    
    expect(result.current.drawingState.cursorPosition).toEqual(position);
  });
});
