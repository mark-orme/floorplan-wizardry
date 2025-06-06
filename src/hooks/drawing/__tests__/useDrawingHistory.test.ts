
import { describe, test, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useDrawingHistory } from '../../drawing/useDrawingHistory';
import * as Sentry from '@sentry/react';

// Mock Sentry captureException
vi.mock('@sentry/react', () => ({
  captureException: vi.fn(),
  captureMessage: vi.fn(),
  addBreadcrumb: vi.fn()
}));

describe('useDrawingHistory', () => {
  test('should initialize with empty history', () => {
    const mockCanvas = {
      toObject: vi.fn().mockReturnValue({ objects: [] }),
      wrapperEl: document.createElement('div')
    } as any;
    
    const canvasRef = { current: mockCanvas } as any;
    
    const { result } = renderHook(() => useDrawingHistory({ fabricCanvasRef: canvasRef }));
    
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });
  
  test('should handle errors gracefully', () => {
    const mockCanvas = {
      toObject: vi.fn().mockImplementation(() => {
        throw new Error('Test error');
      }),
      wrapperEl: document.createElement('div')
    } as any;
    
    const canvasRef = { current: mockCanvas } as any;
    
    const { result } = renderHook(() => useDrawingHistory({ fabricCanvasRef: canvasRef }));
    
    act(() => {
      result.current.saveState();
    });
    
    expect(Sentry.captureException).toHaveBeenCalled();
    expect(result.current.canUndo).toBe(false);
  });
});
