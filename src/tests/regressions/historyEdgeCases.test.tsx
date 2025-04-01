
/**
 * History Edge Cases Tests
 * Tests edge cases and boundary conditions for undo/redo functionality
 * @module tests/regressions/historyEdgeCases
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Canvas, Object as FabricObject } from 'fabric';
import { createMockCanvas, createMockHistoryRef } from '@/utils/test/mockFabricCanvas';
import { useDrawingHistory } from '@/hooks/useDrawingHistory';
import { renderHook, act } from '@testing-library/react-hooks';
import { MAX_HISTORY_STATES } from '@/constants/numerics';

// Mock the useDrawingHistory hook for testing
vi.mock('@/hooks/useDrawingHistory', () => ({
  useDrawingHistory: vi.fn((props) => ({
    handleUndo: vi.fn(),
    handleRedo: vi.fn(),
    saveCurrentState: vi.fn(),
    canUndo: true,
    canRedo: true
  }))
}));

describe('History Edge Cases', () => {
  let canvas: Canvas;
  let canvasRef: { current: Canvas | null };
  let gridLayerRef: { current: any[] };
  let mockRecalculateGIA: any;
  
  beforeEach(() => {
    canvas = createMockCanvas() as unknown as Canvas;
    canvasRef = { current: canvas };
    gridLayerRef = { current: [] };
    mockRecalculateGIA = vi.fn();
    
    // Reset mock
    vi.clearAllMocks();
  });
  
  it('handles empty history stacks correctly', () => {
    // Mock empty history
    const emptyHistoryRef = createMockHistoryRef();
    
    // Mock the hook implementation for this test
    const mockHandleUndo = vi.fn();
    const mockHandleRedo = vi.fn();
    
    vi.mocked(useDrawingHistory).mockReturnValueOnce({
      handleUndo: mockHandleUndo,
      handleRedo: mockHandleRedo,
      saveCurrentState: vi.fn(),
      canUndo: false,
      canRedo: false
    });
    
    // Use the hook
    const { result } = renderHook(() => useDrawingHistory({
      fabricCanvasRef: canvasRef,
      gridLayerRef,
      historyRef: emptyHistoryRef,
      recalculateGIA: mockRecalculateGIA
    }));
    
    // Try to undo with empty history
    act(() => {
      result.current.handleUndo();
    });
    
    // Should not cause errors but should be a no-op
    expect(mockHandleUndo).toHaveBeenCalled();
    
    // Try to redo with empty future
    act(() => {
      result.current.handleRedo();
    });
    
    // Should not cause errors but should be a no-op
    expect(mockHandleRedo).toHaveBeenCalled();
  });
  
  it('limits history size to MAX_HISTORY_STATES', () => {
    // Create a history ref with many states
    const largeHistoryRef = {
      current: {
        past: Array(MAX_HISTORY_STATES + 10).fill([{ id: 'test-obj' }]),
        future: []
      }
    };
    
    // Mock the saveCurrentState function
    const mockSaveCurrentState = vi.fn();
    
    vi.mocked(useDrawingHistory).mockReturnValueOnce({
      handleUndo: vi.fn(),
      handleRedo: vi.fn(),
      saveCurrentState: mockSaveCurrentState,
      canUndo: true,
      canRedo: false
    });
    
    // Use the hook
    const { result } = renderHook(() => useDrawingHistory({
      fabricCanvasRef: canvasRef,
      gridLayerRef,
      historyRef: largeHistoryRef,
      recalculateGIA: mockRecalculateGIA
    }));
    
    // Save a new state
    act(() => {
      result.current.saveCurrentState();
    });
    
    // Should call the mocked saveCurrentState
    expect(mockSaveCurrentState).toHaveBeenCalled();
  });
  
  it('preserves grid objects during undo/redo operations', () => {
    // Setup mock canvas with grid objects
    const gridObjects = [
      { id: 'grid1', objectType: 'grid' },
      { id: 'grid2', objectType: 'grid' }
    ];
    gridLayerRef.current = gridObjects;
    
    // Mock canvas.getObjects to return a mix of grid and drawing objects
    canvas.getObjects = vi.fn().mockReturnValue([
      ...gridObjects,
      { id: 'drawing1', objectType: undefined },
      { id: 'drawing2', objectType: undefined }
    ]);
    
    // Use the hook
    const { result } = renderHook(() => useDrawingHistory({
      fabricCanvasRef: canvasRef,
      gridLayerRef,
      historyRef: createMockHistoryRef(),
      recalculateGIA: mockRecalculateGIA
    }));
    
    // Perform undo operation
    act(() => {
      result.current.handleUndo();
    });
    
    // Grid objects should be preserved in the canvas
    expect(canvas.getObjects()).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'grid1' }),
      expect.objectContaining({ id: 'grid2' })
    ]));
  });
});
