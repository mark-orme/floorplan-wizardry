
/**
 * Tests for useLineState hook
 */
import { renderHook, act } from '@testing-library/react';
import { useLineState } from '../useLineState';
import { createLineState } from '../lineState';

describe('useLineState', () => {
  it('should initialize with default line state', () => {
    const { result } = renderHook(() => useLineState({ id: 'test-line' }));
    
    expect(result.current.lineState).toEqual(
      expect.objectContaining({
        id: 'test-line',
        start: null,
        end: null,
        active: false
      })
    );
  });

  it('should update start point', () => {
    const { result } = renderHook(() => useLineState({ id: 'test-line' }));
    
    act(() => {
      result.current.setStart({ x: 10, y: 20 });
    });
    
    expect(result.current.lineState.start).toEqual({ x: 10, y: 20 });
  });

  it('should update end point', () => {
    const { result } = renderHook(() => useLineState({ id: 'test-line' }));
    
    act(() => {
      result.current.setEnd({ x: 100, y: 200 });
    });
    
    expect(result.current.lineState.end).toEqual({ x: 100, y: 200 });
  });

  it('should calculate length when both points are set', () => {
    const { result } = renderHook(() => useLineState({ id: 'test-line' }));
    
    act(() => {
      result.current.setStart({ x: 0, y: 0 });
      result.current.setEnd({ x: 3, y: 4 });
    });
    
    // Length should be 5 (Pythagorean theorem: 3^2 + 4^2 = 5^2)
    expect(result.current.lineState.length).toBeCloseTo(5);
  });

  it('should calculate angle when both points are set', () => {
    const { result } = renderHook(() => useLineState({ id: 'test-line' }));
    
    act(() => {
      result.current.setStart({ x: 0, y: 0 });
      result.current.setEnd({ x: 10, y: 0 });
    });
    
    // Angle should be 0 for a horizontal line to the right
    expect(result.current.lineState.angle).toBeCloseTo(0);
  });

  it('should reset the line state', () => {
    const { result } = renderHook(() => useLineState({ id: 'test-line' }));
    
    act(() => {
      result.current.setStart({ x: 10, y: 20 });
      result.current.setEnd({ x: 30, y: 40 });
      result.current.setActive(true);
      result.current.reset();
    });
    
    expect(result.current.lineState).toEqual(
      expect.objectContaining({
        id: 'test-line',
        start: null,
        end: null,
        active: false,
        length: 0,
        angle: 0
      })
    );
  });
});
