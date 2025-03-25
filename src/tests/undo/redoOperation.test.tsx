
/**
 * Redo functionality tests
 * @module redoOperation.test
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Canvas } from "fabric";
import { setupFabricMock, createMockGridLayerRef, createMockHistoryRef } from "../utils/canvasMocks";

// Mock fabric namespace
vi.mock('fabric', () => setupFabricMock());

// Import after mocks
import { useDrawingHistory } from '@/hooks/useDrawingHistory';

describe('Redo Operation', () => {
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
  
  it('handles redo correctly by preserving grid', () => {
    // Setup mock history reference with future state and a type assertion
    const mockHistoryRef = createMockHistoryRef(
      [],
      [[{ type: 'polyline', id: 'future_drawing', toObject: () => ({ type: 'polyline', id: 'future_drawing' }) }]]
    ) as unknown as React.MutableRefObject<{
      past: any[][];
      future: any[][];
    }>;
    
    // Setup the hook
    const { handleRedo } = useDrawingHistory({
      fabricCanvasRef: canvasRef,
      gridLayerRef,
      historyRef: mockHistoryRef,
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
    expect(mockHistoryRef.current.past.length).toBe(1);
    
    // Check that GIA was recalculated
    expect(mockRecalculateGIA).toHaveBeenCalled();
  });
  
  it('handles empty future states correctly', () => {
    // Empty future
    const mockHistoryRef = createMockHistoryRef() as unknown as React.MutableRefObject<{
      past: any[][];
      future: any[][];
    }>;
    
    // Setup the hook
    const { handleRedo } = useDrawingHistory({
      fabricCanvasRef: canvasRef,
      gridLayerRef,
      historyRef: mockHistoryRef,
      clearDrawings: mockClearDrawings,
      recalculateGIA: mockRecalculateGIA
    });
    
    // Execute redo
    handleRedo();
    
    // Check that nothing was added
    expect(canvas.add).not.toHaveBeenCalled();
  });
});
