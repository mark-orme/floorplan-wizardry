
/**
 * Tests for useCanvasInteraction hook
 */
import { renderHook, act } from '@testing-library/react-hooks';
import { useCanvasInteraction } from '../useCanvasInteraction';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Canvas as FabricCanvas } from 'fabric';

// Mock Canvas
vi.mock('fabric', () => ({
  Canvas: vi.fn().mockImplementation(() => ({}))
}));

describe('useCanvasInteraction', () => {
  let mockCanvas: any;
  
  beforeEach(() => {
    mockCanvas = {
      add: vi.fn(),
      remove: vi.fn(),
      getObjects: vi.fn().mockReturnValue([]),
      renderAll: vi.fn(),
      requestRenderAll: vi.fn(),
      setActiveObject: vi.fn(),
      discardActiveObject: vi.fn(),
      getActiveObject: vi.fn(),
      getActiveObjects: vi.fn().mockReturnValue([]),
      on: vi.fn(),
      off: vi.fn(),
      selection: true
    };
  });
  
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useCanvasInteraction({
      fabricCanvasRef: { current: mockCanvas } as any
    }));
    
    expect(result.current.isInteracting).toBe(false);
    expect(result.current.isDrawing).toBe(false);
  });
  
  it('should handle selection mode', () => {
    const { result } = renderHook(() => useCanvasInteraction({
      fabricCanvasRef: { current: mockCanvas } as any
    }));
    
    act(() => {
      result.current.setSelectionMode(true);
    });
    
    expect(mockCanvas.selection).toBe(true);
  });
  
  it('should handle drawing mode', () => {
    const { result } = renderHook(() => useCanvasInteraction({
      fabricCanvasRef: { current: mockCanvas } as any
    }));
    
    act(() => {
      result.current.setDrawingMode(true);
    });
    
    expect(result.current.isDrawing).toBe(true);
  });
  
  it('should handle null canvas gracefully', () => {
    const { result } = renderHook(() => useCanvasInteraction({
      fabricCanvasRef: { current: null } as any
    }));
    
    act(() => {
      result.current.setSelectionMode(true);
      result.current.setDrawingMode(true);
    });
    
    expect(result.current.isInteracting).toBe(false);
    expect(result.current.isDrawing).toBe(true);
  });
  
  it('should clean up event listeners on unmount', () => {
    const { unmount } = renderHook(() => useCanvasInteraction({
      fabricCanvasRef: { current: mockCanvas } as any
    }));
    
    unmount();
    
    expect(mockCanvas.off).toHaveBeenCalled();
  });
});
