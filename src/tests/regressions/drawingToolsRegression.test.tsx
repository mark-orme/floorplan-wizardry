
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
import { FabricEventNames } from '@/types/fabric-types';

// Mock the fabric canvas
vi.mock('fabric', () => ({
  Canvas: vi.fn().mockImplementation(() => ({
    on: vi.fn((eventName, callback) => {
      // Store callback in a map we can access for testing
      if (!mockEventHandlers[eventName]) {
        mockEventHandlers[eventName] = [];
      }
      mockEventHandlers[eventName].push(callback);
      return this;
    }),
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
    getPointer: vi.fn().mockImplementation((e) => {
      // Return simulated coordinates based on the event
      if (e && e.clientX !== undefined && e.clientY !== undefined) {
        return { x: e.clientX, y: e.clientY };
      }
      return { x: 100, y: 100 }; // Default fallback
    }),
    fire: vi.fn(),
    isDrawingMode: false,
    freeDrawingBrush: {
      color: "#000000",
      width: 2
    },
    discardActiveObject: vi.fn(),
    contains: vi.fn().mockReturnValue(true),
    selection: true,
    defaultCursor: 'default',
    hoverCursor: 'default'
  })),
  PencilBrush: vi.fn().mockImplementation(() => ({
    color: "#000000",
    width: 2
  })),
  Line: vi.fn().mockImplementation((points, options) => ({
    type: 'line',
    points,
    set: vi.fn(),
    ...options
  })),
  Text: vi.fn().mockImplementation((text, options) => ({
    type: 'text',
    text,
    set: vi.fn(),
    ...options
  }))
}));

// Store mock event handlers for testing
const mockEventHandlers: Record<string, any[]> = {};

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

// Mock the straight line tool hook
vi.mock('@/hooks/straightLineTool/useStraightLineTool', () => ({
  useStraightLineTool: vi.fn().mockReturnValue({
    isDrawing: false,
    cancelDrawing: vi.fn(),
    isToolInitialized: true,
    isActive: true
  })
}));

// Mock snap to grid hooks
vi.mock('@/hooks/useSnapToGrid', () => ({
  useSnapToGrid: vi.fn().mockReturnValue({
    snapPointToGrid: vi.fn(point => point),
    snapLineToGrid: vi.fn((start, end) => ({ start, end }))
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
    // Clear stored event handlers between tests
    Object.keys(mockEventHandlers).forEach(key => {
      delete mockEventHandlers[key];
    });
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
    // Create a spy on the useStraightLineTool mock
    const straightLineToolSpy = vi.spyOn(useStraightLineTool as any, 'mockReturnValue');
    
    // Test selection tool
    const { rerender } = render(<TestCanvas tool={DrawingMode.SELECT} />);
    expect(useStraightLineTool).toHaveBeenCalledWith(expect.objectContaining({
      tool: DrawingMode.SELECT
    }));
    
    // Test drawing tool 
    rerender(<TestCanvas tool={DrawingMode.DRAW} />);
    expect(useStraightLineTool).toHaveBeenCalledWith(expect.objectContaining({
      tool: DrawingMode.DRAW
    }));
    
    // Test straight line tool
    straightLineToolSpy.mockReturnValue({
      isDrawing: false,
      cancelDrawing: vi.fn(),
      isToolInitialized: true,
      isActive: true
    });
    
    rerender(<TestCanvas tool={DrawingMode.STRAIGHT_LINE} />);
    
    expect(useStraightLineTool).toHaveBeenCalledWith(expect.objectContaining({
      tool: DrawingMode.STRAIGHT_LINE
    }));
    
    // Verify that the straight line tool is initialized with isActive=true
    expect(straightLineToolSpy).toHaveBeenLastCalledWith(expect.objectContaining({
      isActive: true
    }));
  });
  
  it('should handle straight line tool initialization correctly', async () => {
    // Create a mock for the useStraightLineTool hook
    const mockCancelDrawing = vi.fn();
    const mockLineState = {
      isDrawing: false,
      cancelDrawing: mockCancelDrawing,
      isToolInitialized: true,
      isActive: true
    };
    
    (useStraightLineTool as any).mockReturnValue(mockLineState);
    
    render(<TestCanvas tool={DrawingMode.STRAIGHT_LINE} />);
    
    // Verify straight line tool is properly initialized
    await waitFor(() => {
      expect(useStraightLineTool).toHaveBeenCalledWith(
        expect.objectContaining({
          tool: DrawingMode.STRAIGHT_LINE,
          lineColor: expect.any(String),
          lineThickness: expect.any(Number)
        })
      );
    });
  });
  
  it('should trigger mouse events and handle line drawing', async () => {
    // Create a mock for the line drawing state and handlers
    const mockHandleMouseDown = vi.fn();
    const mockHandleMouseMove = vi.fn();
    const mockHandleMouseUp = vi.fn();
    const mockCancelDrawing = vi.fn();
    
    // Override the straight line tool mock for this test
    (useStraightLineTool as any).mockImplementation(({ fabricCanvasRef, tool }) => {
      // When the hook is called with tool=STRAIGHT_LINE, simulate attaching event handlers
      if (tool === DrawingMode.STRAIGHT_LINE && fabricCanvasRef.current) {
        // Add mock handlers to the canvas
        fabricCanvasRef.current.on(FabricEventNames.MOUSE_DOWN, mockHandleMouseDown);
        fabricCanvasRef.current.on(FabricEventNames.MOUSE_MOVE, mockHandleMouseMove);
        fabricCanvasRef.current.on(FabricEventNames.MOUSE_UP, mockHandleMouseUp);
      }
      
      return {
        isDrawing: false,
        cancelDrawing: mockCancelDrawing,
        isToolInitialized: true,
        isActive: tool === DrawingMode.STRAIGHT_LINE
      };
    });
    
    // Render with straight line tool
    render(<TestCanvas tool={DrawingMode.STRAIGHT_LINE} />);
    
    // Simulate canvas mouse events from a user drawing a line
    const canvasContainer = screen.getByTestId('canvas-container');
    
    // Create a canvas element for testing
    const canvasElement = document.createElement('canvas');
    canvasContainer.appendChild(canvasElement);
    
    // Simulate a mouse down event
    fireEvent.mouseDown(canvasElement, { clientX: 100, clientY: 100 });
    
    // Verify the mouse down handler was called when the event was fired
    expect(mockHandleMouseDown).toHaveBeenCalled();
    
    // Simulate a mouse move event
    fireEvent.mouseMove(canvasElement, { clientX: 200, clientY: 200 });
    
    // Verify the mouse move handler was called
    expect(mockHandleMouseMove).toHaveBeenCalled();
    
    // Simulate a mouse up event
    fireEvent.mouseUp(canvasElement);
    
    // Verify the mouse up handler was called
    expect(mockHandleMouseUp).toHaveBeenCalled();
    
    // Test escape key to cancel drawing
    fireEvent.keyDown(window, { key: 'Escape' });
    
    // Verify cancel drawing gets called when Escape is pressed
    expect(mockCancelDrawing).toHaveBeenCalled();
  });
});
