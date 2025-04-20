
/**
 * Tests for useCanvasInteraction hook
 */
import { renderHook, act } from '@testing-library/react-hooks';
import { useCanvasInteraction } from '../useCanvasInteraction';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';

// Import the adapter for consistent DrawingMode usage
import { normalizeDrawingMode } from '@/utils/floorPlanAdapter';

// Mock Canvas
vi.mock('fabric', () => ({
  Canvas: vi.fn().mockImplementation(() => ({}))
}));

describe('useCanvasInteraction', () => {
  let mockCanvas: any;
  const mockSaveCurrentState = vi.fn();
  
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
    mockSaveCurrentState.mockClear();
  });
  
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useCanvasInteraction({
      fabricCanvasRef: { current: mockCanvas } as any,
      tool: normalizeDrawingMode(DrawingMode.SELECT),
      saveCurrentState: mockSaveCurrentState
    }));
    
    // The result now only includes the properties defined in UseCanvasInteractionResult
    expect(result.current.deleteSelectedObjects).toBeDefined();
    expect(result.current.enablePointSelection).toBeDefined();
    expect(result.current.setupSelectionMode).toBeDefined();
  });
  
  it('should handle selection mode', () => {
    const { result } = renderHook(() => useCanvasInteraction({
      fabricCanvasRef: { current: mockCanvas } as any,
      tool: normalizeDrawingMode(DrawingMode.SELECT),
      saveCurrentState: mockSaveCurrentState
    }));
    
    act(() => {
      result.current.setupSelectionMode();
    });
    
    expect(mockCanvas.selection).toBe(false); // Using point selection mode
  });
  
  it('should handle drawing mode setup', () => {
    const { result } = renderHook(() => useCanvasInteraction({
      fabricCanvasRef: { current: mockCanvas } as any,
      tool: normalizeDrawingMode(DrawingMode.DRAW),
      saveCurrentState: mockSaveCurrentState
    }));
    
    act(() => {
      result.current.setupSelectionMode();
    });
    
    // Should disable selection in drawing mode
    expect(mockCanvas.selection).toBe(false);
  });
  
  it('should handle null canvas gracefully', () => {
    const { result } = renderHook(() => useCanvasInteraction({
      fabricCanvasRef: { current: null } as any,
      tool: normalizeDrawingMode(DrawingMode.SELECT),
      saveCurrentState: mockSaveCurrentState
    }));
    
    act(() => {
      // These should not throw errors
      result.current.setupSelectionMode();
      result.current.enablePointSelection();
      result.current.deleteSelectedObjects();
    });
    
    // No assertions needed - we're just making sure it doesn't throw
  });
  
  it('should clean up event listeners on unmount', () => {
    const { unmount } = renderHook(() => useCanvasInteraction({
      fabricCanvasRef: { current: mockCanvas } as any,
      tool: normalizeDrawingMode(DrawingMode.SELECT),
      saveCurrentState: mockSaveCurrentState
    }));
    
    unmount();
    
    expect(mockCanvas.off).toHaveBeenCalled();
  });
});
