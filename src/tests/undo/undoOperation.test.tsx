
/**
 * Undo functionality tests
 * @module undoOperation.test
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Canvas } from "fabric";
import { MAX_HISTORY_STATES } from "@/utils/drawing";
import { setupFabricMock, createMockGridLayerRef, createMockHistoryRef } from "../utils/canvasMocks";

// Mock fabric namespace
vi.mock('fabric', () => setupFabricMock());

// Import after mocks
import { useDrawingHistory } from '@/hooks/useDrawingHistory';

describe('Undo Operation', () => {
  let canvas: Canvas;
  let gridLayerRef: { current: any[] };
  let mockClearDrawings: any;
  let mockRecalculateGIA: any;
  let canvasRef: { current: Canvas | null };
  
  beforeEach(() => {
    canvas = new Canvas('test-canvas');
    gridLayerRef = createMockGridLayerRef();
    canvasRef = { current: canvas };
    mockClearDrawings = vi.fn();
    mockRecalculateGIA = vi.fn();
    
    // Mock filter to separate grid and drawing objects
    canvas.getObjects = vi.fn().mockImplementation(() => [
      { type: 'polyline', id: 'drawing1', toObject: () => ({ type: 'polyline', id: 'drawing1' }) },
      { type: 'polyline', id: 'drawing2', toObject: () => ({ type: 'polyline', id: 'drawing2' }) },
      { id: 'grid1' },
      { id: 'grid2' }
    ]);
  });
  
  afterEach(() => {
    vi.clearAllMocks();
  });
  
  it('handles undo correctly by preserving grid', () => {
    // Setup mock history reference with a type assertion to satisfy TypeScript
    const mockHistoryRef = createMockHistoryRef(
      [[{ type: 'polyline', id: 'old_drawing', toObject: () => ({ type: 'polyline', id: 'old_drawing' }) }]],
      []
    ) as unknown as React.MutableRefObject<{
      past: any[][];
      future: any[][];
    }>;
    
    // Setup the hook
    const { handleUndo } = useDrawingHistory({
      fabricCanvasRef: canvasRef,
      gridLayerRef,
      historyRef: mockHistoryRef,
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
    expect(mockHistoryRef.current.future.length).toBe(1);
    
    // Check that GIA was recalculated
    expect(mockRecalculateGIA).toHaveBeenCalled();
  });
  
  it('handles empty history states correctly', () => {
    // Empty past
    const mockHistoryRef = createMockHistoryRef() as unknown as React.MutableRefObject<{
      past: any[][];
      future: any[][];
    }>;
    
    // Setup the hook
    const { handleUndo } = useDrawingHistory({
      fabricCanvasRef: canvasRef,
      gridLayerRef,
      historyRef: mockHistoryRef,
      clearDrawings: mockClearDrawings,
      recalculateGIA: mockRecalculateGIA
    });
    
    // Execute undo
    handleUndo();
    
    // Check that nothing was removed
    expect(canvas.remove).not.toHaveBeenCalled();
  });
});
