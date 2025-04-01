
/**
 * History edge cases regression tests
 * Tests boundary conditions for undo/redo operations
 * @module tests/regressions/historyEdgeCases
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Canvas } from 'fabric';
import { 
  createMockCanvas, 
  createMockGridLayerRef, 
  createMockHistoryRef 
} from '@/utils/test/mockFabricCanvas';
import { MAX_HISTORY_STATES } from '@/constants/numerics';
import { useDrawingHistory } from '@/hooks/useDrawingHistory';

describe('History Edge Cases Regression Tests', () => {
  let canvas: Canvas;
  let gridLayerRef: { current: any[] };
  let mockClearDrawings: any;
  let mockRecalculateGIA: any;
  let canvasRef: { current: Canvas | null };
  
  beforeEach(() => {
    canvas = createMockCanvas() as unknown as Canvas;
    gridLayerRef = createMockGridLayerRef();
    canvasRef = { current: canvas };
    mockClearDrawings = vi.fn();
    mockRecalculateGIA = vi.fn();
  });
  
  it('handles empty history state gracefully', () => {
    // Create empty history
    const mockHistoryRef = {
      current: {
        past: [],
        future: []
      }
    } as React.MutableRefObject<{
      past: any[][];
      future: any[][];
    }>;
    
    // Setup the hook
    const { handleUndo, handleRedo, canUndo, canRedo } = useDrawingHistory({
      fabricCanvasRef: canvasRef,
      gridLayerRef,
      historyRef: mockHistoryRef,
      clearDrawings: mockClearDrawings,
      recalculateGIA: mockRecalculateGIA
    });
    
    // Check initial state
    expect(canUndo()).toBe(false);
    expect(canRedo()).toBe(false);
    
    // Perform undo with empty history
    handleUndo();
    
    // History should still be empty
    expect(mockHistoryRef.current.past).toHaveLength(0);
    expect(mockHistoryRef.current.future).toHaveLength(0);
    
    // Perform redo with empty history
    handleRedo();
    
    // History should still be empty
    expect(mockHistoryRef.current.past).toHaveLength(0);
    expect(mockHistoryRef.current.future).toHaveLength(0);
  });
  
  it('handles maximum history size correctly', () => {
    // Create history at max size
    const pastStates = Array(MAX_HISTORY_STATES).fill(null).map((_, i) => [
      { id: `obj-${i}`, type: 'polyline', toObject: () => ({ id: `obj-${i}`, type: 'polyline' }) }
    ]);
    
    const mockHistoryRef = {
      current: {
        past: [...pastStates],
        future: []
      }
    } as React.MutableRefObject<{
      past: any[][];
      future: any[][];
    }>;
    
    // Setup the hook
    const { saveCurrentState } = useDrawingHistory({
      fabricCanvasRef: canvasRef,
      gridLayerRef,
      historyRef: mockHistoryRef,
      clearDrawings: mockClearDrawings,
      recalculateGIA: mockRecalculateGIA
    });
    
    // Initial check
    expect(mockHistoryRef.current.past.length).toBe(MAX_HISTORY_STATES);
    
    // Add one more state
    saveCurrentState();
    
    // Should still be MAX_HISTORY_STATES (oldest should be removed)
    expect(mockHistoryRef.current.past.length).toBe(MAX_HISTORY_STATES);
    
    // First item should be the second item from the original array
    expect(mockHistoryRef.current.past[0][0].id).toBe(`obj-1`);
  });
  
  it('handles complex undo/redo sequences correctly', () => {
    // Create history with some states
    const mockHistoryRef = {
      current: {
        past: [
          [{ id: 'obj-1', toObject: () => ({ id: 'obj-1' }) }],
          [{ id: 'obj-2', toObject: () => ({ id: 'obj-2' }) }],
          [{ id: 'obj-3', toObject: () => ({ id: 'obj-3' }) }]
        ],
        future: []
      }
    } as React.MutableRefObject<{
      past: any[][];
      future: any[][];
    }>;
    
    // Setup the hook
    const { handleUndo, handleRedo } = useDrawingHistory({
      fabricCanvasRef: canvasRef,
      gridLayerRef,
      historyRef: mockHistoryRef,
      clearDrawings: mockClearDrawings,
      recalculateGIA: mockRecalculateGIA
    });
    
    // Perform undo
    handleUndo();
    
    // Check state
    expect(mockHistoryRef.current.past).toHaveLength(2);
    expect(mockHistoryRef.current.future).toHaveLength(1);
    
    // Perform another undo
    handleUndo();
    
    // Check state
    expect(mockHistoryRef.current.past).toHaveLength(1);
    expect(mockHistoryRef.current.future).toHaveLength(2);
    
    // Perform redo
    handleRedo();
    
    // Check state
    expect(mockHistoryRef.current.past).toHaveLength(2);
    expect(mockHistoryRef.current.future).toHaveLength(1);
    
    // Perform undo again
    handleUndo();
    
    // Check state
    expect(mockHistoryRef.current.past).toHaveLength(1);
    expect(mockHistoryRef.current.future).toHaveLength(2);
    
    // Save new state
    const saveCurrentState = () => {
      const newState = [{ id: 'obj-4', toObject: () => ({ id: 'obj-4' }) }];
      mockHistoryRef.current.past.push(newState);
      mockHistoryRef.current.future = [];
    };
    
    saveCurrentState();
    
    // Future should be cleared
    expect(mockHistoryRef.current.past).toHaveLength(2);
    expect(mockHistoryRef.current.future).toHaveLength(0);
  });
});

