
/**
 * Tests for the straight line tool hook
 * Ensures line drawing functionality works correctly
 * @module hooks/straightLineTool/__tests__/useStraightLineTool
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useStraightLineTool } from '../useStraightLineTool';
import { useLineState } from '../useLineState';
import { DrawingMode } from '@/constants/drawingModes';
import { FabricEventNames } from '@/types/fabric-types';
import { Point } from '@/types/core/Geometry';

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
    setIsDrawing: vi.fn()
  })
}));

describe('useStraightLineTool', () => {
  // Create mock canvas
  const mockCanvas = {
    on: vi.fn(),
    off: vi.fn(),
    isDrawingMode: false,
    selection: true,
    defaultCursor: 'default',
    hoverCursor: 'default',
    getObjects: vi.fn().mockReturnValue([]),
    discardActiveObject: vi.fn(),
    requestRenderAll: vi.fn(),
    fire: vi.fn()
  };
  
  const mockCanvasRef = { current: mockCanvas };
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('should initialize the tool with correct settings', () => {
    const { result } = renderHook(() => useStraightLineTool({
      fabricCanvasRef: mockCanvasRef as any,
      tool: DrawingMode.STRAIGHT_LINE,
      lineColor: '#000000',
      lineThickness: 2,
      saveCurrentState: vi.fn()
    }));
    
    // Verify the tool is initialized
    expect(result.current.isToolInitialized).toBe(true);
    expect(result.current.isActive).toBe(true);
    
    // Verify canvas properties are set correctly
    expect(mockCanvas.isDrawingMode).toBe(false);
    expect(mockCanvas.selection).toBe(false);
    expect(mockCanvas.defaultCursor).toBe('crosshair');
    
    // Verify event handlers are registered
    expect(mockCanvas.on).toHaveBeenCalledWith(FabricEventNames.MOUSE_DOWN, expect.any(Function));
    expect(mockCanvas.on).toHaveBeenCalledWith(FabricEventNames.MOUSE_MOVE, expect.any(Function));
    expect(mockCanvas.on).toHaveBeenCalledWith(FabricEventNames.MOUSE_UP, expect.any(Function));
  });
  
  it('should clean up when tool changes', () => {
    const { rerender } = renderHook(
      ({ tool }) => useStraightLineTool({
        fabricCanvasRef: mockCanvasRef as any,
        tool,
        lineColor: '#000000',
        lineThickness: 2,
        saveCurrentState: vi.fn()
      }),
      { initialProps: { tool: DrawingMode.STRAIGHT_LINE } }
    );
    
    // Change tool to something else
    rerender({ tool: DrawingMode.SELECT });
    
    // Verify cleanup happened
    expect(mockCanvas.off).toHaveBeenCalledWith(FabricEventNames.MOUSE_DOWN, expect.any(Function));
    expect(mockCanvas.off).toHaveBeenCalledWith(FabricEventNames.MOUSE_MOVE, expect.any(Function));
    expect(mockCanvas.off).toHaveBeenCalledWith(FabricEventNames.MOUSE_UP, expect.any(Function));
  });
  
  it('should handle drawing operations correctly', () => {
    // Override mock to track drawing state
    const mockSetIsDrawing = vi.fn();
    const mockSetStartPoint = vi.fn();
    
    (useLineState as any).mockReturnValue({
      isDrawing: false,
      isToolInitialized: false,
      startPointRef: { current: null },
      currentLineRef: { current: null },
      distanceTooltipRef: { current: null },
      setStartPoint: mockSetStartPoint,
      setCurrentLine: vi.fn(),
      setDistanceTooltip: vi.fn(),
      initializeTool: vi.fn(),
      resetDrawingState: vi.fn(),
      setIsDrawing: mockSetIsDrawing
    });
    
    // Create a mock mouse event
    const mockPoint: Point = { x: 100, y: 100 };
    const mockEvent = {
      e: { preventDefault: vi.fn() },
      pointer: mockPoint
    };
    
    // Render the hook
    const { result } = renderHook(() => useStraightLineTool({
      fabricCanvasRef: mockCanvasRef as any,
      tool: DrawingMode.STRAIGHT_LINE,
      lineColor: '#000000',
      lineThickness: 2,
      saveCurrentState: vi.fn()
    }));
    
    // Extract the mouse down handler
    const mouseDownHandler = mockCanvas.on.mock.calls.find(
      call => call[0] === FabricEventNames.MOUSE_DOWN
    )[1];
    
    // Call the handler with a mock event
    act(() => {
      mouseDownHandler(mockEvent);
    });
    
    // Verify drawing is started
    expect(mockSetStartPoint).toHaveBeenCalledWith(mockPoint);
  });
  
  it('should handle canceling drawing correctly', () => {
    // Override mock to track drawing state
    const mockResetDrawingState = vi.fn();
    
    (useLineState as any).mockReturnValue({
      isDrawing: true,
      isToolInitialized: true,
      startPointRef: { current: { x: 100, y: 100 } },
      currentLineRef: { current: { dispose: vi.fn() } },
      distanceTooltipRef: { current: { dispose: vi.fn() } },
      setStartPoint: vi.fn(),
      setCurrentLine: vi.fn(),
      setDistanceTooltip: vi.fn(),
      initializeTool: vi.fn(),
      resetDrawingState: mockResetDrawingState,
      setIsDrawing: vi.fn()
    });
    
    // Render the hook
    const { result } = renderHook(() => useStraightLineTool({
      fabricCanvasRef: mockCanvasRef as any,
      tool: DrawingMode.STRAIGHT_LINE,
      lineColor: '#000000',
      lineThickness: 2,
      saveCurrentState: vi.fn()
    }));
    
    // Call cancel drawing
    act(() => {
      result.current.cancelDrawing();
    });
    
    // Verify drawing is reset
    expect(mockResetDrawingState).toHaveBeenCalled();
  });
});
