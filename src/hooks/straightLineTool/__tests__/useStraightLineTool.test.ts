
/**
 * Tests for the straight line tool hook
 * Ensures line drawing functionality works correctly
 * @module hooks/straightLineTool/__tests__/useStraightLineTool
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useStraightLineTool } from '../useStraightLineTool';
import { useLineState, InputMethod } from '../useStraightLineTool';
import { DrawingMode } from '@/constants/drawingModes';
import { FabricEventTypes } from '@/types/fabric-events';
import { Point } from '@/types/core/Geometry';
import { asMockCanvas } from '@/types/test/MockTypes';

// Mock the dependencies
vi.mock('../useLineState', () => ({
  useLineState: vi.fn().mockReturnValue({
    isDrawing: false,
    isToolInitialized: false,
    startPointRef: { current: null },
    currentLineRef: { current: null },
    distanceTooltipRef: { current: null },
    setStartPoint: vi.fn(),
    setCurrentLine: vi.fn(),
    setDistanceTooltip: vi.fn(),
    initializeTool: vi.fn(),
    resetDrawingState: vi.fn(),
    setIsDrawing: vi.fn(),
    createLine: vi.fn(),
    createDistanceTooltip: vi.fn(),
    updateLineAndTooltip: vi.fn(),
    snapPointToGrid: vi.fn(point => point),
    snapLineToGrid: vi.fn()
  }),
  InputMethod: {
    MOUSE: 'mouse',
    TOUCH: 'touch',
    PENCIL: 'pencil',
    STYLUS: 'stylus'
  }
}));

// Mock other necessary dependencies
vi.mock('@/utils/sentry', () => ({
  captureMessage: vi.fn(),
  captureError: vi.fn()
}));

vi.mock('@/utils/logger', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn()
  }
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn()
  }
}));

describe('useStraightLineTool', () => {
  // Create mock canvas with event tracking
  const createMockCanvas = () => {
    const eventHandlers: Record<string, Function[]> = {};
    
    const mockCanvas = {
      on: vi.fn((eventName: string, handler: Function) => {
        if (!eventHandlers[eventName]) {
          eventHandlers[eventName] = [];
        }
        eventHandlers[eventName].push(handler);
        return mockCanvas;
      }),
      off: vi.fn((eventName: string, handler?: Function) => {
        if (handler && eventHandlers[eventName]) {
          const index = eventHandlers[eventName].indexOf(handler);
          if (index !== -1) {
            eventHandlers[eventName].splice(index, 1);
          }
        } else if (eventHandlers[eventName]) {
          delete eventHandlers[eventName];
        }
        return mockCanvas;
      }),
      add: vi.fn(),
      remove: vi.fn(),
      requestRenderAll: vi.fn(),
      discardActiveObject: vi.fn(),
      getPointer: vi.fn().mockReturnValue({ x: 100, y: 100 }),
      getObjects: vi.fn().mockReturnValue([]),
      contains: vi.fn().mockReturnValue(true),
      isDrawingMode: false,
      selection: true,
      defaultCursor: 'default',
      hoverCursor: 'default',
      width: 800,
      height: 600,
      // Method to trigger an event for testing
      triggerEvent: (eventName: string, eventData: any) => {
        if (eventHandlers[eventName]) {
          eventHandlers[eventName].forEach(handler => handler(eventData));
        }
      },
      // Method to get handlers for a specific event
      getHandlers: (eventName: string) => eventHandlers[eventName] || []
    };
    
    return mockCanvas;
  };
  
  let mockCanvas: ReturnType<typeof createMockCanvas>;
  let saveCurrentState: () => void;
  
  beforeEach(() => {
    mockCanvas = createMockCanvas();
    saveCurrentState = vi.fn();
    
    // Reset the useLineState mock
    (useLineState as any).mockReturnValue({
      isDrawing: false,
      isToolInitialized: false,
      startPointRef: { current: null },
      currentLineRef: { current: null },
      distanceTooltipRef: { current: null },
      setStartPoint: vi.fn(),
      setCurrentLine: vi.fn(),
      setDistanceTooltip: vi.fn(),
      initializeTool: vi.fn(),
      resetDrawingState: vi.fn(),
      setIsDrawing: vi.fn()
    });
  });
  
  it('should initialize and set up event handlers correctly', () => {
    const { result } = renderHook(() => useStraightLineTool({
      canvas: asMockCanvas(mockCanvas),
      enabled: true,
      lineColor: '#000000',
      lineThickness: 2,
      saveCurrentState
    }));
    
    // Verify event handlers are attached
    expect(mockCanvas.on).toHaveBeenCalledWith(FabricEventTypes.MOUSE_DOWN, expect.any(Function));
    expect(mockCanvas.on).toHaveBeenCalledWith(FabricEventTypes.MOUSE_MOVE, expect.any(Function));
    expect(mockCanvas.on).toHaveBeenCalledWith(FabricEventTypes.MOUSE_UP, expect.any(Function));
    
    // Verify canvas properties are set correctly for drawing
    expect(mockCanvas.isDrawingMode).toBe(false);
    expect(mockCanvas.selection).toBe(false);
    expect(mockCanvas.defaultCursor).toBe('crosshair');
    
    // Verify the hook returns expected values
    expect(result.current.isActive).toBe(true);
  });
  
  it('should not set up event handlers if tool is not STRAIGHT_LINE', () => {
    renderHook(() => useStraightLineTool({
      canvas: asMockCanvas(mockCanvas),
      enabled: false,
      lineColor: '#000000',
      lineThickness: 2,
      saveCurrentState
    }));
    
    // Verify no event handlers are attached for the wrong tool
    expect(mockCanvas.on).not.toHaveBeenCalled();
  });
  
  it('should clean up event handlers when tool changes', () => {
    const { rerender } = renderHook(
      (props) => useStraightLineTool({
        canvas: asMockCanvas(mockCanvas),
        enabled: props.enabled,
        lineColor: '#000000',
        lineThickness: 2,
        saveCurrentState
      }),
      { initialProps: { enabled: true } }
    );
    
    // Verify event handlers are set up
    expect(mockCanvas.on).toHaveBeenCalledTimes(3);
    
    // Change tool
    rerender({ enabled: false });
    
    // Verify event handlers are removed
    expect(mockCanvas.off).toHaveBeenCalledTimes(3);
  });
  
  it('should handle drawing operations correctly', () => {
    // Mock setIsDrawing function
    const mockSetIsDrawing = vi.fn();
    const mockSetStartPoint = vi.fn();
    const mockSetCurrentLine = vi.fn();
    const mockSetDistanceTooltip = vi.fn();
    
    // Update useLineState mock with custom functions
    (useLineState as any).mockReturnValue({
      isDrawing: false,
      isToolInitialized: false,
      startPointRef: { current: null },
      currentLineRef: { current: null },
      distanceTooltipRef: { current: null },
      setStartPoint: mockSetStartPoint,
      setCurrentLine: mockSetCurrentLine,
      setDistanceTooltip: mockSetDistanceTooltip,
      initializeTool: vi.fn(),
      resetDrawingState: vi.fn(),
      setIsDrawing: mockSetIsDrawing,
      createLine: vi.fn(),
      createDistanceTooltip: vi.fn(),
      updateLineAndTooltip: vi.fn(),
      snapPointToGrid: vi.fn(point => point),
      snapLineToGrid: vi.fn()
    });
    
    renderHook(() => useStraightLineTool({
      canvas: asMockCanvas(mockCanvas),
      enabled: true,
      lineColor: '#000000',
      lineThickness: 2,
      saveCurrentState
    }));
    
    // Get mouse down handler
    const mouseDownHandler = mockCanvas.getHandlers(FabricEventTypes.MOUSE_DOWN)[0];
    expect(mouseDownHandler).toBeDefined();
    
    // Simulate mouse down event
    const mouseDownEvent = {
      e: { preventDefault: vi.fn() },
      pointer: { x: 100, y: 100 }
    };
    
    mouseDownHandler(mouseDownEvent);
    
    // Verify drawing is started
    expect(mockSetIsDrawing).toHaveBeenCalledWith(true);
    expect(mockSetStartPoint).toHaveBeenCalledWith(expect.objectContaining({ x: 100, y: 100 }));
  });
  
  it('should handle Escape key to cancel drawing', () => {
    // Mock cancelDrawing dependencies
    const mockResetDrawingState = vi.fn();
    const mockIsDrawing = true;
    
    // Override useLineState mock for this test
    (useLineState as any).mockReturnValue({
      isDrawing: mockIsDrawing,
      isToolInitialized: true,
      startPointRef: { current: { x: 100, y: 100 } },
      currentLineRef: { current: { id: 'line1' } },
      distanceTooltipRef: { current: { id: 'tooltip1' } },
      setStartPoint: vi.fn(),
      setCurrentLine: vi.fn(),
      setDistanceTooltip: vi.fn(),
      initializeTool: vi.fn(),
      resetDrawingState: mockResetDrawingState,
      setIsDrawing: vi.fn()
    });
    
    const { result } = renderHook(() => useStraightLineTool({
      canvas: asMockCanvas(mockCanvas),
      enabled: true,
      lineColor: '#000000',
      lineThickness: 2,
      saveCurrentState
    }));
    
    // Verify cancel drawing function is returned
    expect(result.current.cancelDrawing).toBeDefined();
    
    // Manually trigger the escape key event
    act(() => {
      // Simulate pressing Escape
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      window.dispatchEvent(escapeEvent);
    });
    
    // Verify drawing is canceled
    expect(mockResetDrawingState).toHaveBeenCalled();
  });
  
  it('should complete a line drawing operation', () => {
    // Mock drawing state
    const mockStartPoint = { x: 100, y: 100 };
    const mockCurrentLine = { 
      id: 'line1', 
      x1: 100, 
      y1: 100, 
      x2: 200, 
      y2: 200,
      set: vi.fn()
    };
    const mockDistanceTooltip = { 
      id: 'tooltip1',
      set: vi.fn()
    };
    const mockResetDrawingState = vi.fn();
    
    // Override useLineState mock for this test
    (useLineState as any).mockReturnValue({
      isDrawing: true,
      isToolInitialized: true,
      startPointRef: { current: mockStartPoint },
      currentLineRef: { current: mockCurrentLine },
      distanceTooltipRef: { current: mockDistanceTooltip },
      setStartPoint: vi.fn(),
      setCurrentLine: vi.fn(),
      setDistanceTooltip: vi.fn(),
      initializeTool: vi.fn(),
      resetDrawingState: mockResetDrawingState,
      setIsDrawing: vi.fn()
    });
    
    renderHook(() => useStraightLineTool({
      canvas: asMockCanvas(mockCanvas),
      enabled: true,
      lineColor: '#000000',
      lineThickness: 2,
      saveCurrentState
    }));
    
    // Get mouse handlers
    const mouseUpHandler = mockCanvas.getHandlers(FabricEventTypes.MOUSE_UP)[0];
    expect(mouseUpHandler).toBeDefined();
    
    // Simulate completing the drawing
    mouseUpHandler({});
    
    // Verify state is saved and drawing is reset
    expect(saveCurrentState).toHaveBeenCalled();
    expect(mockResetDrawingState).toHaveBeenCalled();
  });
});
