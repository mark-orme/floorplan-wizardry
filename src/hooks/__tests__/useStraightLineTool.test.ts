
import { renderHook, act } from '@testing-library/react-hooks';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useStraightLineTool } from '../useStraightLineTool';
import { Canvas, Line, Point, Text } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';

// Mock dependencies
vi.mock('@/utils/sentry', () => ({
  captureMessage: vi.fn(),
  captureError: vi.fn()
}));

vi.mock('@/utils/logger', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  }
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

// Mock fabric classes
vi.mock('fabric', () => {
  const mockPoint = vi.fn().mockImplementation((x, y) => ({ x, y }));
  const mockLine = vi.fn().mockImplementation((points, options) => ({
    set: vi.fn(),
    points,
    ...options
  }));
  const mockText = vi.fn().mockImplementation((text, options) => ({
    set: vi.fn(),
    text,
    ...options
  }));
  
  // Create a mock for canvas with proper event handlers structure
  const mockCanvas = vi.fn().mockImplementation(() => {
    const eventHandlers: Record<string, Array<Function>> = {
      'mouse:down': [],
      'mouse:move': [],
      'mouse:up': []
    };
    
    return {
      on: vi.fn((eventName: string, handler: Function) => {
        if (!eventHandlers[eventName]) {
          eventHandlers[eventName] = [];
        }
        eventHandlers[eventName].push(handler);
      }),
      off: vi.fn((eventName: string, handler: Function) => {
        if (eventHandlers[eventName]) {
          const index = eventHandlers[eventName].indexOf(handler);
          if (index !== -1) {
            eventHandlers[eventName].splice(index, 1);
          }
        }
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
      _eventHandlers: eventHandlers // Accessible for testing
    };
  });
  
  return {
    Canvas: mockCanvas,
    Line: mockLine,
    Point: mockPoint,
    Text: mockText
  };
});

// Mock useSnapToGrid hook
vi.mock('../useSnapToGrid', () => ({
  useSnapToGrid: () => ({
    snapPointToGrid: vi.fn(point => point),
    snapLineToGrid: vi.fn((start, end) => ({ start, end }))
  })
}));

// Type for mock event
interface MockFabricEvent {
  e: MouseEvent | TouchEvent;
  pointer?: { x: number; y: number };
  target?: any;
}

describe('useStraightLineTool', () => {
  let fabricCanvas: Canvas;
  let fabricCanvasRef: { current: Canvas | null };
  let saveCurrentState: () => void;
  
  beforeEach(() => {
    fabricCanvas = new Canvas();
    fabricCanvasRef = { current: fabricCanvas };
    saveCurrentState = vi.fn();
  });
  
  afterEach(() => {
    vi.clearAllMocks();
  });
  
  it('should initialize the straight line tool correctly', () => {
    const { result } = renderHook(() => useStraightLineTool({
      fabricCanvasRef,
      tool: DrawingMode.STRAIGHT_LINE,
      lineColor: '#000000',
      lineThickness: 2,
      saveCurrentState
    }));
    
    expect(result.current.isToolInitialized).toBe(true);
    expect(result.current.isDrawing).toBe(false);
    expect(fabricCanvas.isDrawingMode).toBe(false);
    expect(fabricCanvas.selection).toBe(false);
    expect(fabricCanvas.defaultCursor).toBe('crosshair');
    expect(fabricCanvas.hoverCursor).toBe('crosshair');
    expect(fabricCanvas.on).toHaveBeenCalledTimes(3); // mouse:down, mouse:move, mouse:up
  });
  
  it('should remove event handlers when unmounting', () => {
    const { unmount } = renderHook(() => useStraightLineTool({
      fabricCanvasRef,
      tool: DrawingMode.STRAIGHT_LINE,
      lineColor: '#000000',
      lineThickness: 2,
      saveCurrentState
    }));
    
    unmount();
    
    expect(fabricCanvas.off).toHaveBeenCalledTimes(3); // mouse:down, mouse:move, mouse:up
  });
  
  it('should not initialize if tool is not STRAIGHT_LINE', () => {
    const { result } = renderHook(() => useStraightLineTool({
      fabricCanvasRef,
      tool: DrawingMode.SELECT,
      lineColor: '#000000',
      lineThickness: 2,
      saveCurrentState
    }));
    
    expect(result.current.isToolInitialized).toBe(false);
    expect(fabricCanvas.on).not.toHaveBeenCalled();
  });
  
  it('should start drawing on mouse down', () => {
    // Get the hook
    const { result } = renderHook(() => useStraightLineTool({
      fabricCanvasRef,
      tool: DrawingMode.STRAIGHT_LINE,
      lineColor: '#000000',
      lineThickness: 2,
      saveCurrentState
    }));
    
    // Extract the mouse:down handler from the mock
    const onCall = vi.mocked(fabricCanvas.on);
    const mouseDownHandler = onCall.mock.calls.find(
      call => call[0] === 'mouse:down'
    )?.[1];
    
    // Simulate mouse down event
    if (mouseDownHandler) {
      const mockEvent: MockFabricEvent = { 
        e: new MouseEvent('mousedown'), 
        pointer: { x: 100, y: 100 } 
      };
      
      act(() => {
        mouseDownHandler(mockEvent);
      });
      
      // Verify line creation and state
      expect(result.current.isDrawing).toBe(true);
      expect(fabricCanvas.add).toHaveBeenCalledTimes(1);
      expect(Line).toHaveBeenCalledTimes(1);
    }
  });
  
  it('should update the line on mouse move', () => {
    // Get the hook and set up initial drawing state
    const { result } = renderHook(() => useStraightLineTool({
      fabricCanvasRef,
      tool: DrawingMode.STRAIGHT_LINE,
      lineColor: '#000000',
      lineThickness: 2,
      saveCurrentState
    }));
    
    // Extract handlers from mock
    const onCall = vi.mocked(fabricCanvas.on);
    const mouseDownHandler = onCall.mock.calls.find(
      call => call[0] === 'mouse:down'
    )?.[1];
    
    const mouseMoveHandler = onCall.mock.calls.find(
      call => call[0] === 'mouse:move'
    )?.[1];
    
    // Start drawing
    if (mouseDownHandler && mouseMoveHandler) {
      const mockDownEvent: MockFabricEvent = { 
        e: new MouseEvent('mousedown'), 
        pointer: { x: 100, y: 100 } 
      };
      
      act(() => {
        mouseDownHandler(mockDownEvent);
      });
      
      // Move the mouse
      const mockMoveEvent: MockFabricEvent = { 
        e: new MouseEvent('mousemove'), 
        pointer: { x: 200, y: 200 } 
      };
      
      act(() => {
        mouseMoveHandler(mockMoveEvent);
      });
      
      // Verify tooltip creation
      expect(Text).toHaveBeenCalledTimes(1);
      expect(fabricCanvas.add).toHaveBeenCalledTimes(2); // Line + tooltip
    }
  });
  
  it('should finalize the line on mouse up', () => {
    // Get the hook and set up initial drawing state
    const { result } = renderHook(() => useStraightLineTool({
      fabricCanvasRef,
      tool: DrawingMode.STRAIGHT_LINE,
      lineColor: '#000000',
      lineThickness: 2,
      saveCurrentState
    }));
    
    // Extract handlers from mock
    const onCall = vi.mocked(fabricCanvas.on);
    const mouseDownHandler = onCall.mock.calls.find(
      call => call[0] === 'mouse:down'
    )?.[1];
    
    const mouseUpHandler = onCall.mock.calls.find(
      call => call[0] === 'mouse:up'
    )?.[1];
    
    // Mock getPointer to return a position far enough from start
    fabricCanvas.getPointer = vi.fn().mockReturnValue({ x: 200, y: 200 });
    
    // Start and finish drawing
    if (mouseDownHandler && mouseUpHandler) {
      const mockDownEvent: MockFabricEvent = { 
        e: new MouseEvent('mousedown'), 
        pointer: { x: 100, y: 100 } 
      };
      
      act(() => {
        mouseDownHandler(mockDownEvent);
      });
      
      const mockUpEvent: MockFabricEvent = { 
        e: new MouseEvent('mouseup'), 
        pointer: { x: 200, y: 200 } 
      };
      
      act(() => {
        mouseUpHandler(mockUpEvent);
      });
      
      // Verify line is completed
      expect(saveCurrentState).toHaveBeenCalledTimes(1);
      expect(result.current.isDrawing).toBe(false);
    }
  });
  
  it('should cancel drawing when pressing escape', () => {
    // Get the hook
    const { result } = renderHook(() => useStraightLineTool({
      fabricCanvasRef,
      tool: DrawingMode.STRAIGHT_LINE,
      lineColor: '#000000',
      lineThickness: 2,
      saveCurrentState
    }));
    
    // Start drawing
    const onCall = vi.mocked(fabricCanvas.on);
    const mouseDownHandler = onCall.mock.calls.find(
      call => call[0] === 'mouse:down'
    )?.[1];
    
    if (mouseDownHandler) {
      const mockEvent: MockFabricEvent = { 
        e: new MouseEvent('mousedown'), 
        pointer: { x: 100, y: 100 } 
      };
      
      act(() => {
        mouseDownHandler(mockEvent);
      });
      
      // Verify drawing started
      expect(result.current.isDrawing).toBe(true);
      
      // Simulate pressing escape
      const keydownEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      act(() => {
        window.dispatchEvent(keydownEvent);
      });
      
      // Verify drawing canceled
      expect(result.current.isDrawing).toBe(false);
      expect(fabricCanvas.remove).toHaveBeenCalled();
    }
  });
});
