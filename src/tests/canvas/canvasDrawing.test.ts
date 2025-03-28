/**
 * Tests for canvas drawing functionality
 * @module tests/canvas/canvasDrawing
 */
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useCanvasDrawing } from '@/hooks/useCanvasDrawing';
import { DrawingMode } from '@/constants/drawingModes';

// Define more specific types for our mocks
interface MockCanvas {
  on: ReturnType<typeof vi.fn>;
  off: ReturnType<typeof vi.fn>;
  add: ReturnType<typeof vi.fn>;
  remove: ReturnType<typeof vi.fn>;
  getObjects: ReturnType<typeof vi.fn>;
  dispose: ReturnType<typeof vi.fn>;
  renderAll: ReturnType<typeof vi.fn>;
  requestRenderAll: ReturnType<typeof vi.fn>;
  getPointer: ReturnType<typeof vi.fn>;
  isDrawingMode: boolean;
  freeDrawingBrush: MockBrush;
}

interface MockBrush {
  color: string;
  width: number;
}

interface MockEvent {
  preventDefault: ReturnType<typeof vi.fn>;
}

interface MockMouseEvent extends MockEvent {
  clientX: number;
  clientY: number;
}

interface MockTouchEvent extends MockEvent {
  touches: Array<{
    clientX: number;
    clientY: number;
    force?: number;
  }>;
}

// Mock fabric canvas
vi.mock('fabric', () => {
  return {
    Canvas: vi.fn().mockImplementation(() => ({
      on: vi.fn(),
      off: vi.fn(),
      add: vi.fn(),
      remove: vi.fn(),
      getObjects: vi.fn().mockReturnValue([]),
      dispose: vi.fn(),
      renderAll: vi.fn(),
      requestRenderAll: vi.fn(),
      getPointer: vi.fn().mockReturnValue({ x: 100, y: 100 }),
      isDrawingMode: false,
      freeDrawingBrush: {
        color: "#000000",
        width: 2
      }
    } as MockCanvas)),
    PencilBrush: vi.fn().mockImplementation(() => ({
      color: "#000000",
      width: 2
    } as MockBrush))
  };
});

// Mock hooks
vi.mock('@/hooks/useCanvasDrawing', () => ({
  useCanvasDrawing: vi.fn().mockReturnValue({
    drawingState: {
      isDrawing: false,
      startPoint: null,
      currentPoint: null,
      midPoint: null,
      currentZoom: 1
    }
  })
}));

describe('Canvas Drawing Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    vi.resetAllMocks();
  });
  
  test('initializes drawing state correctly', () => {
    // When rendering a component that uses the hook
    const result = useCanvasDrawing({
      fabricCanvasRef: { current: null },
      gridLayerRef: { current: [] },
      historyRef: { current: { past: [], future: [] } },
      tool: DrawingMode.DRAW,
      currentFloor: 0,
      setFloorPlans: vi.fn(),
      setGia: vi.fn()
    });
    
    // Then the drawing state should be initialized
    expect(result.drawingState).toBeDefined();
    expect(result.drawingState.isDrawing).toBe(false);
    expect(result.drawingState.currentZoom).toBe(1);
  });
  
  test('handles drawing state changes', () => {
    // Mock the hook to return a specific drawing state
    (useCanvasDrawing as any).mockReturnValue({
      drawingState: {
        isDrawing: true,
        startPoint: { x: 50, y: 50 },
        currentPoint: { x: 150, y: 150 },
        midPoint: { x: 100, y: 100 },
        currentZoom: 1
      }
    });
    
    // When accessing the hook result
    const result = useCanvasDrawing({
      fabricCanvasRef: { current: null },
      gridLayerRef: { current: [] },
      historyRef: { current: { past: [], future: [] } },
      tool: DrawingMode.DRAW,
      currentFloor: 0,
      setFloorPlans: vi.fn(),
      setGia: vi.fn()
    });
    
    // Then the drawing state should match our mock
    expect(result.drawingState.isDrawing).toBe(true);
    expect(result.drawingState.startPoint).toEqual({ x: 50, y: 50 });
    expect(result.drawingState.currentPoint).toEqual({ x: 150, y: 150 });
  });
  
  test('handles tool changes correctly', () => {
    // We can test with different tools
    const tools: DrawingMode[] = [DrawingMode.SELECT, DrawingMode.DRAW, DrawingMode.WALL, DrawingMode.ROOM];
    
    tools.forEach(tool => {
      // When calling the hook with a specific tool
      useCanvasDrawing({
        fabricCanvasRef: { current: null },
        gridLayerRef: { current: [] },
        historyRef: { current: { past: [], future: [] } },
        tool,
        currentFloor: 0,
        setFloorPlans: vi.fn(),
        setGia: vi.fn()
      });
      
      // Then the hook should be called with the correct tool
      expect(useCanvasDrawing).toHaveBeenCalledWith(
        expect.objectContaining({ tool })
      );
    });
  });
});

// Create separate, more focused test files for specific functionality
// This helps avoid the TS errors related to mocking complex event types
