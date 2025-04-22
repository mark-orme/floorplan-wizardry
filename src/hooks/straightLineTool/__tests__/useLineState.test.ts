
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLineState } from '../useLineState';
import { 
  createInitialLineState,
  createLineStateWithStart,
  createCompleteLineState 
} from '../testUtils';

describe('useLineState', () => {
  beforeEach(() => {
    // Reset any shared state or mocks before each test
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useLineState(createInitialLineState()));
    expect(result.current.state.isDrawing).toBe(false);
    expect(result.current.state.startPoint).toBeNull();
    expect(result.current.state.endPoint).toBeNull();
  });

  it('should set start point correctly', () => {
    const { result } = renderHook(() => useLineState(createInitialLineState()));
    
    act(() => {
      result.current.startDrawing({ x: 100, y: 100 });
    });
    
    expect(result.current.state.isDrawing).toBe(true);
    expect(result.current.state.startPoint).not.toBeNull();
    expect(result.current.state.startPoint?.x).toBe(100);
    expect(result.current.state.startPoint?.y).toBe(100);
  });

  it('should update end point while drawing', () => {
    const { result } = renderHook(() => useLineState(createLineStateWithStart()));
    
    act(() => {
      result.current.updateLine({ x: 200, y: 200 });
    });
    
    expect(result.current.state.isDrawing).toBe(true);
    expect(result.current.state.endPoint).not.toBeNull();
    expect(result.current.state.endPoint?.x).toBe(200);
    expect(result.current.state.endPoint?.y).toBe(200);
  });

  it('should finish drawing correctly', () => {
    const { result } = renderHook(() => useLineState(createCompleteLineState()));
    
    act(() => {
      result.current.finishDrawing();
    });
    
    expect(result.current.state.isDrawing).toBe(false);
    // State should still have the start and end points after finishing
    expect(result.current.state.startPoint).not.toBeNull();
    expect(result.current.state.endPoint).not.toBeNull();
  });

  it('should cancel drawing correctly', () => {
    const { result } = renderHook(() => useLineState(createLineStateWithStart()));
    
    act(() => {
      result.current.cancelDrawing();
    });
    
    expect(result.current.state.isDrawing).toBe(false);
    expect(result.current.state.startPoint).toBeNull();
    expect(result.current.state.endPoint).toBeNull();
  });

  it('should reset state correctly', () => {
    const { result } = renderHook(() => useLineState(createCompleteLineState()));
    
    act(() => {
      result.current.resetState();
    });
    
    expect(result.current.state.isDrawing).toBe(false);
    expect(result.current.state.startPoint).toBeNull();
    expect(result.current.state.endPoint).toBeNull();
    expect(result.current.state.tempLine).toBeNull();
  });
});
