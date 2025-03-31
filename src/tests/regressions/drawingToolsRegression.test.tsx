
/**
 * Regression tests for drawing tools
 * Ensures drawing functionality works correctly across versions
 * @module tests/regressions/drawingToolsRegression
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Canvas } from '@/components/Canvas';
import { DrawingMode } from '@/constants/drawingModes';
import { useStraightLineTool } from '@/hooks/straightLineTool/useStraightLineTool';
import { useCanvasReadyState } from '@/utils/canvas/canvasReadyState';

// Mock the fabric canvas
vi.mock('fabric', () => ({
  Canvas: vi.fn().mockImplementation(() => ({
    on: vi.fn(),
    off: vi.fn(),
    add: vi.fn(),
    remove: vi.fn(),
    getObjects: vi.fn().mockReturnValue([]),
    dispose: vi.fn(),
    clear: vi.fn(),
    renderAll: vi.fn(),
    requestRenderAll: vi.fn(),
    setZoom: vi.fn(),
    getZoom: vi.fn().mockReturnValue(1),
    getElement: vi.fn().mockReturnValue({
      getBoundingClientRect: vi.fn().mockReturnValue({
        left: 0, top: 0, width: 800, height: 600
      }),
      dispatchEvent: vi.fn()
    }),
    getPointer: vi.fn().mockReturnValue({ x: 100, y: 100 }),
    fire: vi.fn(),
    isDrawingMode: false,
    freeDrawingBrush: {
      color: "#000000",
      width: 2
    },
    discardActiveObject: vi.fn()
  })),
  PencilBrush: vi.fn().mockImplementation(() => ({
    color: "#000000",
    width: 2
  })),
  Line: vi.fn().mockImplementation((points, options) => ({
    type: 'line',
    points,
    ...options
  }))
}));

// Mock the canvas ready state hook
vi.mock('@/utils/canvas/canvasReadyState', () => ({
  useCanvasReadyState: vi.fn().mockReturnValue({
    isReady: true,
    setCanvasCreated: vi.fn(),
    setCanvasInitialized: vi.fn(),
    setGridLoaded: vi.fn(),
    setToolsRegistered: vi.fn()
  })
}));

// Create a TestCanvas component to isolate testing
const TestCanvas = ({ tool = DrawingMode.SELECT }) => {
  return (
    <div>
      <div data-testid="canvas-container">
        <Canvas tool={tool} />
      </div>
    </div>
  );
};

describe('Drawing Tools Regression Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    vi.resetAllMocks();
  });
  
  it('should render the canvas element', async () => {
    render(<TestCanvas />);
    const canvasContainer = screen.getByTestId('canvas-container');
    expect(canvasContainer).toBeInTheDocument();
  });
  
  it('should set canvas ready state correctly', async () => {
    const mockSetCanvasCreated = vi.fn();
    const mockSetCanvasInitialized = vi.fn();
    
    // Override mock for this specific test
    (useCanvasReadyState as any).mockReturnValue({
      isReady: false,
      setCanvasCreated: mockSetCanvasCreated,
      setCanvasInitialized: mockSetCanvasInitialized,
      setGridLoaded: vi.fn(),
      setToolsRegistered: vi.fn()
    });
    
    render(<TestCanvas />);
    
    // Check that the canvas ready state is being set
    expect(mockSetCanvasCreated).toHaveBeenCalled();
    
    // After initialization, the canvas should be marked as initialized
    await waitFor(() => {
      expect(mockSetCanvasInitialized).toHaveBeenCalled();
    });
  });
  
  it('should block interactions until canvas is ready', async () => {
    // Override mock to simulate loading state
    (useCanvasReadyState as any).mockReturnValue({
      isReady: false,
      setCanvasCreated: vi.fn(),
      setCanvasInitialized: vi.fn(),
      setGridLoaded: vi.fn(),
      setToolsRegistered: vi.fn()
    });
    
    render(<TestCanvas />);
    
    // Check that loading overlay is shown
    const loadingIndicator = screen.getByText(/Initializing Canvas/i);
    expect(loadingIndicator).toBeInTheDocument();
    
    // Update mock to simulate canvas ready
    (useCanvasReadyState as any).mockReturnValue({
      isReady: true,
      setCanvasCreated: vi.fn(),
      setCanvasInitialized: vi.fn(),
      setGridLoaded: vi.fn(),
      setToolsRegistered: vi.fn()
    });
    
    // Re-render with ready state
    render(<TestCanvas />);
    
    // Loading indicator should no longer be present
    expect(screen.queryByText(/Initializing Canvas/i)).not.toBeInTheDocument();
  });
  
  it('should switch between drawing tools correctly', async () => {
    // Test selection tool
    const { rerender } = render(<TestCanvas tool={DrawingMode.SELECT} />);
    
    // Test drawing tool 
    rerender(<TestCanvas tool={DrawingMode.DRAW} />);
    
    // Test straight line tool
    rerender(<TestCanvas tool={DrawingMode.STRAIGHT_LINE} />);
    
    // Each tool change should trigger appropriate canvas configuration
    // This is a regression test to ensure tool changes don't break
  });
  
  it('should handle straight line tool initialization correctly', async () => {
    // Create a mock for the useStraightLineTool hook
    const mockLineState = {
      isDrawing: false,
      cancelDrawing: vi.fn(),
      isToolInitialized: true,
      isActive: true
    };
    
    vi.mock('@/hooks/straightLineTool/useStraightLineTool', () => ({
      useStraightLineTool: vi.fn().mockReturnValue(mockLineState)
    }));
    
    render(<TestCanvas tool={DrawingMode.STRAIGHT_LINE} />);
    
    // Verify straight line tool is properly initialized
    await waitFor(() => {
      expect(useStraightLineTool).toHaveBeenCalled();
    });
  });
});
