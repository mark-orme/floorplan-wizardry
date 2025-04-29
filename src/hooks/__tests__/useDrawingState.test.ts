
import { describe, test, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useDrawingState } from '../drawing/useDrawingState';

describe('useDrawingState hook', () => {
  test('should initialize with default values', () => {
    const { result } = renderHook(() => useDrawingState());
    
    expect(result.current.isDrawing).toBe(false);
    expect(result.current.activeColor).toBe('#000000');
    expect(result.current.activeThickness).toBe(2);
    expect(result.current.activeType).toBe('line');
  });

  test.skip('skipped test example', () => {
    // This test is skipped
    expect(true).toBe(true);
  });
});
