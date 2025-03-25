
/**
 * Undo/Redo functionality tests
 * @module undoRedo.test
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Canvas } from "fabric";
import { MAX_HISTORY_STATES } from "@/utils/drawing";

// Mock canvas and history ref
const mockHistoryRef = {
  past: [],
  future: []
};

// Mock fabric canvas
vi.mock('fabric', () => {
  const FabricMock = {
    Canvas: vi.fn().mockImplementation(() => ({
      on: vi.fn().mockReturnValue({}),
      off: vi.fn(),
      add: vi.fn(),
      remove: vi.fn(),
      getObjects: vi.fn().mockReturnValue([
        { type: 'polyline', id: 'drawing1' },
        { type: 'polyline', id: 'drawing2' },
        { type: 'line', id: 'grid1' },
        { type: 'line', id: 'grid2' }
      ]),
      contains: vi.fn().mockReturnValue(true),
      sendObjectToBack: vi.fn(),
      bringObjectToFront: vi.fn(),
      dispose: vi.fn(),
      clear: vi.fn(),
      requestRenderAll: vi.fn()
    })),
    Polyline: vi.fn().mockImplementation((points, options) => ({
      type: 'polyline',
      points,
      ...options,
      clone: () => ({ type: 'polyline', points, ...options })
    }))
  };
  
  return FabricMock;
});

// Import after mocks
import { useDrawingHistory } from '@/hooks/useDrawingHistory';

describe('Undo/Redo functionality', () => {
  let canvas: Canvas;
  let gridLayerRef: { current: any[] };
  let mockClearDrawings: any;
  let mockRecalculateGIA: any;
  let canvasRef: { current: Canvas | null };
  
  beforeEach(() => {
    canvas = new Canvas('test-canvas');
    gridLayerRef = { current: [{ id: 'grid1' }, { id: 'grid2' }] };
    canvasRef = { current: canvas };
    mockHistoryRef.past = [
      [{ type: 'polyline', id: 'old_drawing' }]
    ];
    mockHistoryRef.future = [];
    mockClearDrawings = vi.fn();
    mockRecalculateGIA = vi.fn();
    
    // Mock filter to separate grid and drawing objects
    canvas.getObjects = vi.fn().mockImplementation(() => [
      { type: 'polyline', id: 'drawing1', clone: () => ({ type: 'polyline', id: 'drawing1' }) },
      { type: 'polyline', id: 'drawing2', clone: () => ({ type: 'polyline', id: 'drawing2' }) },
      { id: 'grid1' },
      { id: 'grid2' }
    ]);
  });
  
  afterEach(() => {
    vi.clearAllMocks();
  });
  
  it('handles undo correctly by preserving grid', () => {
    // Setup the hook
    const { handleUndo } = useDrawingHistory({
      fabricCanvasRef: canvasRef,
      gridLayerRef,
      historyRef: { current: mockHistoryRef },
      clearDrawings: mockClearDrawings,
      recalculateGIA: mockRecalculateGIA
    });
    
    // Execute undo
    handleUndo();
    
    // Check that only non-grid objects were removed
    expect(canvas.remove).toHaveBeenCalledTimes(2);
    
    // Check that grid objects were preserved
    expect(canvas.getObjects).toHaveBeenCalled();
    
    // Check that future state was updated
    expect(mockHistoryRef.future.length).toBe(1);
    
    // Check that GIA was recalculated
    expect(mockRecalculateGIA).toHaveBeenCalled();
  });
  
  it('handles redo correctly by preserving grid', () => {
    // Setup future state
    mockHistoryRef.future = [
      [{ type: 'polyline', id: 'future_drawing', clone: () => ({ type: 'polyline', id: 'future_drawing' }) }]
    ];
    
    // Setup the hook
    const { handleRedo } = useDrawingHistory({
      fabricCanvasRef: canvasRef,
      gridLayerRef,
      historyRef: { current: mockHistoryRef },
      clearDrawings: mockClearDrawings,
      recalculateGIA: mockRecalculateGIA
    });
    
    // Execute redo
    handleRedo();
    
    // Check that only non-grid objects were removed
    expect(canvas.remove).toHaveBeenCalledTimes(2);
    
    // Check that add was called for the future state object
    expect(canvas.add).toHaveBeenCalled();
    
    // Check that past state was updated
    expect(mockHistoryRef.past.length).toBe(2);
    
    // Check that GIA was recalculated
    expect(mockRecalculateGIA).toHaveBeenCalled();
  });
  
  it('handles empty history states correctly', () => {
    // Empty past
    mockHistoryRef.past = [];
    mockHistoryRef.future = [];
    
    // Setup the hook
    const { handleUndo, handleRedo } = useDrawingHistory({
      fabricCanvasRef: canvasRef,
      gridLayerRef,
      historyRef: { current: mockHistoryRef },
      clearDrawings: mockClearDrawings,
      recalculateGIA: mockRecalculateGIA
    });
    
    // Execute undo and redo
    handleUndo();
    handleRedo();
    
    // Check that nothing was removed or added
    expect(canvas.remove).not.toHaveBeenCalled();
    expect(canvas.add).not.toHaveBeenCalled();
  });
  
  it('limits history size to MAX_HISTORY_STATES', () => {
    // Fill past with many states
    mockHistoryRef.past = Array(MAX_HISTORY_STATES + 10).fill([{ type: 'polyline' }]);
    mockHistoryRef.future = Array(MAX_HISTORY_STATES + 10).fill([{ type: 'polyline' }]);
    
    // Setup future state
    const { handleRedo } = useDrawingHistory({
      fabricCanvasRef: canvasRef,
      gridLayerRef,
      historyRef: { current: mockHistoryRef },
      clearDrawings: mockClearDrawings,
      recalculateGIA: mockRecalculateGIA
    });
    
    // Execute redo which should trim history
    handleRedo();
    
    // Check that past and future are trimmed to MAX_HISTORY_STATES
    expect(mockHistoryRef.past.length).toBeLessThanOrEqual(MAX_HISTORY_STATES + 1); // +1 because we add to past in redo
    expect(mockHistoryRef.future.length).toBeLessThanOrEqual(MAX_HISTORY_STATES);
  });
});
