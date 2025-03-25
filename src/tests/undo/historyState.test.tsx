
/**
 * History state management tests
 * @module historyState.test
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Canvas } from "fabric";
import { MAX_HISTORY_STATES } from "@/utils/drawing";
import { setupFabricMock, createMockGridLayerRef, createMockHistoryRef } from "../utils/canvasMocks";

// Mock fabric namespace
vi.mock('fabric', () => setupFabricMock());

// Import after mocks
import { useDrawingHistory } from '@/hooks/useDrawingHistory';

describe('History State Management', () => {
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
  });
  
  afterEach(() => {
    vi.clearAllMocks();
  });
  
  it('limits history size to MAX_HISTORY_STATES', () => {
    // Fill past with many states
    const mockPast = Array(MAX_HISTORY_STATES + 10).fill([
      { type: 'polyline', toObject: () => ({ type: 'polyline' }) }
    ]);
    
    const mockFuture = Array(MAX_HISTORY_STATES + 10).fill([
      { type: 'polyline', toObject: () => ({ type: 'polyline' }) }
    ]);
    
    const mockHistoryRef = createMockHistoryRef(mockPast, mockFuture) as unknown as React.MutableRefObject<{
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
    
    // Execute redo which should trim history
    handleRedo();
    
    // Check that past and future are trimmed to MAX_HISTORY_STATES
    expect(mockHistoryRef.current.past.length).toBeLessThanOrEqual(MAX_HISTORY_STATES + 1); // +1 because we add to past in redo
    expect(mockHistoryRef.current.future.length).toBeLessThanOrEqual(MAX_HISTORY_STATES);
  });
});
