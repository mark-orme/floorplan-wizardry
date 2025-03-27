
/**
 * Canvas component tests
 * Tests the functionality of the main Canvas component
 * @module components/__tests__/Canvas
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Canvas } from '../Canvas';
import { Canvas as FabricCanvas } from 'fabric';
import * as gridUtils from '@/utils/gridUtils';

// Mock fabric library
vi.mock('fabric', () => {
  return {
    Canvas: vi.fn().mockImplementation(() => ({
      on: vi.fn(),
      off: vi.fn(),
      clear: vi.fn(),
      renderAll: vi.fn(),
      requestRenderAll: vi.fn(),
      dispose: vi.fn(),
      getWidth: vi.fn().mockReturnValue(800),
      getHeight: vi.fn().mockReturnValue(600),
      isDrawingMode: false,
      freeDrawingBrush: {
        color: '#000000',
        width: 2
      },
      getPointer: vi.fn().mockReturnValue({ x: 100, y: 100 }),
      getObjects: vi.fn().mockReturnValue([]),
      getZoom: vi.fn().mockReturnValue(1),
      setZoom: vi.fn()
    })),
    PencilBrush: vi.fn().mockImplementation(() => ({
      color: '#000000',
      width: 2
    }))
  };
});

// Mock the grid utility functions
vi.mock('@/utils/gridUtils', () => ({
  createCompleteGrid: vi.fn().mockReturnValue({
    gridObjects: [],
    smallGridLines: [],
    largeGridLines: [],
    markers: []
  }),
  setGridVisibility: vi.fn()
}));

// Mock the canvas controller (custom hook)
vi.mock('../canvas/controller/CanvasController', () => ({
  useCanvasController: vi.fn().mockReturnValue({
    tool: 'select',
    lineThickness: 2,
    lineColor: '#000000'
  })
}));

// Mock the canvas interactions hook
vi.mock('@/hooks/useCanvasInteractions', () => ({
  useCanvasInteractions: vi.fn().mockReturnValue({
    drawingState: {
      isDrawing: false,
      startPoint: null,
      currentPoint: null,
      cursorPosition: null,
      midPoint: null,
      selectionActive: false
    },
    currentZoom: 1,
    handleMouseDown: vi.fn(),
    handleMouseMove: vi.fn(),
    handleMouseUp: vi.fn(),
    isSnappedToGrid: vi.fn().mockReturnValue(false),
    isLineAutoStraightened: vi.fn().mockReturnValue(false)
  })
}));

describe('Canvas Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    vi.resetAllMocks();
  });
  
  it('renders the canvas element', () => {
    render(<Canvas />);
    const canvasElement = screen.getByTestId('canvas-element');
    expect(canvasElement).toBeInTheDocument();
  });
  
  it('initializes the grid when canvas is ready', () => {
    const onCanvasReady = vi.fn();
    
    render(<Canvas onCanvasReady={onCanvasReady} />);
    
    // Check if the createCompleteGrid function was called
    expect(gridUtils.createCompleteGrid).toHaveBeenCalled();
    expect(gridUtils.setGridVisibility).toHaveBeenCalled();
    
    // Ensure onCanvasReady callback was called
    expect(onCanvasReady).toHaveBeenCalled();
  });
  
  it('handles canvas initialization errors properly', () => {
    // Mock FabricCanvas constructor to throw an error
    const originalFabricCanvas = (FabricCanvas as unknown as any);
    
    // Temporarily override the implementation
    (FabricCanvas as unknown as any) = vi.fn().mockImplementation(() => {
      throw new Error('Canvas initialization failed');
    });
    
    const onError = vi.fn();
    
    // Render with error handler
    render(<Canvas onError={onError} />);
    
    // Should call the error callback
    expect(onError).toHaveBeenCalled();
    
    // Restore original implementation
    (FabricCanvas as unknown as any) = originalFabricCanvas;
  });
  
  it('does not initialize grid more than once', () => {
    // First render should create the grid
    const { unmount } = render(<Canvas />);
    
    // Reset the mock to track new calls
    vi.clearAllMocks();
    
    // Unmount and render again
    unmount();
    render(<Canvas />);
    
    // Grid should be created again (since it's a new instance)
    expect(gridUtils.createCompleteGrid).toHaveBeenCalledTimes(1);
    
    // Cleanup
    vi.clearAllMocks();
  });
});
