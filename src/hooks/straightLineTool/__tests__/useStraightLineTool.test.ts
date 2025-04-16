
/**
 * Tests for the straight line tool hook
 * Ensures line drawing functionality works correctly
 * @module hooks/straightLineTool/__tests__/useStraightLineTool
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useStraightLineTool, InputMethod } from '../useStraightLineTool';
import { useLineState } from '../useLineState';
import { DrawingMode } from '@/constants/drawingModes';
import { FabricEventNames } from '@/types/fabric-events';
import { Point } from '@/types/core/Point';
import { asMockCanvas } from '@/types/test/MockTypes';

// Mock the dependencies
vi.mock('../useLineState', () => ({
  useLineState: vi.fn().mockReturnValue({
    isDrawing: false,
    isActive: false,
    isToolInitialized: false,
    startPoint: null,
    currentPoint: null,
    currentLine: null,
    distanceTooltip: null,
    initializeTool: vi.fn(),
    resetDrawingState: vi.fn(),
    inputMethod: 'mouse',
    isPencilMode: false,
    snapEnabled: true,
    toggleSnap: vi.fn(),
    toggleAngles: vi.fn(),
    createLine: vi.fn(),
    createDistanceTooltip: vi.fn(),
    anglesEnabled: false,
    setInputMethod: vi.fn(),
    setIsPencilMode: vi.fn(),
    startDrawing: vi.fn(),
    continueDrawing: vi.fn(),
    completeDrawing: vi.fn(),
    cancelDrawing: vi.fn()
  }),
  InputMethod: {
    MOUSE: 'mouse',
    TOUCH: 'touch',
    PENCIL: 'pencil',
    STYLUS: 'stylus'
  }
}));

// Mock other necessary dependencies
vi.mock('@/utils/sentryUtils', () => ({
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
    
    // Reset the useLineState mock with corrected properties
    vi.mocked(useLineState).mockReturnValue({
      isDrawing: false,
      isActive: false,
      isToolInitialized: false,
      startPoint: null,
      currentPoint: null,
      currentLine: null,
      distanceTooltip: null,
      initializeTool: vi.fn(),
      resetDrawingState: vi.fn(),
      createLine: vi.fn(),
      createDistanceTooltip: vi.fn(),
      inputMethod: InputMethod.MOUSE,
      isPencilMode: false,
      snapEnabled: true,
      toggleSnap: vi.fn(),
      toggleAngles: vi.fn(),
      anglesEnabled: false,
      setInputMethod: vi.fn(),
      setIsPencilMode: vi.fn(),
      startDrawing: vi.fn(),
      continueDrawing: vi.fn(),
      completeDrawing: vi.fn(),
      cancelDrawing: vi.fn()
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
    expect(mockCanvas.on).toHaveBeenCalledWith(FabricEventNames.MOUSE_DOWN, expect.any(Function));
    expect(mockCanvas.on).toHaveBeenCalledWith(FabricEventNames.MOUSE_MOVE, expect.any(Function));
    expect(mockCanvas.on).toHaveBeenCalledWith(FabricEventNames.MOUSE_UP, expect.any(Function));
    
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
    // Mock startDrawing function
    const mockStartDrawing = vi.fn();
    
    // Update useLineState mock with correct properties
    vi.mocked(useLineState).mockReturnValue({
      isDrawing: false,
      isActive: false,
      isToolInitialized: false,
      startPoint: null,
      currentPoint: null,
      currentLine: null,
      distanceTooltip: null,
      initializeTool: vi.fn(),
      resetDrawingState: vi.fn(),
      createLine: vi.fn(),
      createDistanceTooltip: vi.fn(),
      inputMethod: InputMethod.MOUSE,
      isPencilMode: false,
      snapEnabled: true,
      toggleSnap: vi.fn(),
      toggleAngles: vi.fn(),
      anglesEnabled: false,
      setInputMethod: vi.fn(),
      setIsPencilMode: vi.fn(),
      startDrawing: mockStartDrawing,
      continueDrawing: vi.fn(),
      completeDrawing: vi.fn(),
      cancelDrawing: vi.fn()
    });
    
    renderHook(() => useStraightLineTool({
      canvas: asMockCanvas(mockCanvas),
      enabled: true,
      lineColor: '#000000',
      lineThickness: 2,
      saveCurrentState
    }));
    
    // Get mouse down handler
    const mouseDownHandler = mockCanvas.getHandlers(FabricEventNames.MOUSE_DOWN)[0];
    expect(mouseDownHandler).toBeDefined();
    
    // Simulate mouse down event
    const mouseDownEvent = {
      e: { preventDefault: vi.fn() },
      pointer: { x: 100, y: 100 }
    };
    
    mouseDownHandler(mouseDownEvent);
    
    // Verify drawing is started
    expect(mockStartDrawing).toHaveBeenCalledWith(expect.objectContaining({ x: 100, y: 100 }));
  });
  
  it('should handle Escape key to cancel drawing', () => {
    // Mock cancelDrawing function
    const mockCancelDrawing = vi.fn();
    
    // Override useLineState mock with correct properties
    vi.mocked(useLineState).mockReturnValue({
      isDrawing: true,
      isActive: true,
      isToolInitialized: true,
      startPoint: { x: 100, y: 100 },
      currentPoint: { x: 200, y: 200 },
      currentLine: { id: 'line1', _set: vi.fn(), _render: vi.fn() } as any,
      distanceTooltip: { id: 'tooltip1', _set: vi.fn(), _render: vi.fn() } as any,
      initializeTool: vi.fn(),
      resetDrawingState: vi.fn(),
      createLine: vi.fn(),
      createDistanceTooltip: vi.fn(),
      inputMethod: InputMethod.MOUSE,
      isPencilMode: false,
      snapEnabled: true,
      toggleSnap: vi.fn(),
      toggleAngles: vi.fn(),
      anglesEnabled: false,
      setInputMethod: vi.fn(),
      setIsPencilMode: vi.fn(),
      startDrawing: vi.fn(),
      continueDrawing: vi.fn(),
      completeDrawing: vi.fn(),
      cancelDrawing: mockCancelDrawing
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
    expect(mockCancelDrawing).toHaveBeenCalled();
  });
  
  it('should complete a line drawing operation', () => {
    // Mock completeDrawing function
    const mockCompleteDrawing = vi.fn();
    
    // Override useLineState mock with correct properties
    vi.mocked(useLineState).mockReturnValue({
      isDrawing: true,
      isActive: true,
      isToolInitialized: true,
      startPoint: { x: 100, y: 100 },
      currentPoint: { x: 200, y: 200 },
      currentLine: { 
        id: 'line1', 
        x1: 100, 
        y1: 100, 
        x2: 200, 
        y2: 200,
        set: vi.fn(),
        _set: vi.fn(),
        _render: vi.fn(),
        _findCenterFromElement: vi.fn(),
        _setWidthHeight: vi.fn()
      } as any,
      distanceTooltip: { 
        id: 'tooltip1',
        set: vi.fn(),
        _reNewline: '',
        _reSpacesAndTabs: '',
        _reSpaceAndTab: '',
        _reWords: /\S+/g,
        _render: vi.fn()
      } as any,
      initializeTool: vi.fn(),
      resetDrawingState: vi.fn(),
      createLine: vi.fn(),
      createDistanceTooltip: vi.fn(),
      inputMethod: InputMethod.MOUSE,
      isPencilMode: false,
      snapEnabled: true,
      toggleSnap: vi.fn(),
      toggleAngles: vi.fn(),
      anglesEnabled: false,
      setInputMethod: vi.fn(),
      setIsPencilMode: vi.fn(),
      startDrawing: vi.fn(),
      continueDrawing: vi.fn(),
      completeDrawing: mockCompleteDrawing,
      cancelDrawing: vi.fn()
    });
    
    renderHook(() => useStraightLineTool({
      canvas: asMockCanvas(mockCanvas),
      enabled: true,
      lineColor: '#000000',
      lineThickness: 2,
      saveCurrentState
    }));
    
    // Get mouse handlers
    const mouseUpHandler = mockCanvas.getHandlers(FabricEventNames.MOUSE_UP)[0];
    expect(mouseUpHandler).toBeDefined();
    
    // Simulate completing the drawing
    mouseUpHandler({ pointer: { x: 300, y: 300 } });
    
    // Verify drawing is completed
    expect(mockCompleteDrawing).toHaveBeenCalledWith(expect.objectContaining({ 
      x: 300, 
      y: 300 
    }));
  });
});
