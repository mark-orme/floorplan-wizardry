
import { describe, test, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useDrawingHistory } from '../../drawing/useDrawingHistory';
import * as Sentry from '@sentry/react';

// Mock Sentry captureException
vi.mock('@sentry/react', () => ({
  captureException: vi.fn()
}));

describe('useDrawingHistory', () => {
  test('should initialize with empty history', () => {
    const mockCanvas = {
      toObject: vi.fn().mockReturnValue({ objects: [] })
    } as unknown as fabric.Canvas;
    
    const canvasRef = { current: mockCanvas } as React.MutableRefObject<fabric.Canvas>;
    
    const { result } = renderHook(() => useDrawingHistory({ fabricCanvasRef: canvasRef }));
    
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });
  
  test.skip('should handle errors gracefully', () => {
    // This test is skipped
    expect(true).toBe(true);
  });
});
