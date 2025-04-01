
import { renderHook, act } from '@testing-library/react-hooks';
import { useStraightLineTool } from '../straightLineTool/useStraightLineTool';
import { DrawingMode } from '@/constants/drawingModes';
import { Canvas, Line } from 'fabric';

// Mock fabric.js
jest.mock('fabric');

// Mock dependencies
jest.mock('../drawing/useDrawingToolManager', () => ({
  useDrawingToolManager: () => ({
    drawingState: {
      isDrawing: false,
      startPoint: null,
      currentPoint: null,
      points: []
    },
    startDrawing: jest.fn(),
    continueDrawing: jest.fn(),
    endDrawing: jest.fn(),
    cancelDrawing: jest.fn(),
    mouseHandlers: {
      handleMouseDown: jest.fn(),
      handleMouseMove: jest.fn(),
      handleMouseUp: jest.fn()
    }
  })
}));

jest.mock('../straightLineTool/useLineState', () => ({
  useLineState: () => ({
    isDrawing: false,
    isToolInitialized: true,
    startPointRef: { current: null },
    currentLineRef: { current: null },
    distanceTooltipRef: { current: null },
    setIsDrawing: jest.fn(),
    setStartPoint: jest.fn(),
    setCurrentLine: jest.fn(),
    setDistanceTooltip: jest.fn(),
    initializeTool: jest.fn(),
    resetDrawingState: jest.fn()
  })
}));

// Mock logger
jest.mock('@/utils/logger', () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  }
}));

// Mock sentry
jest.mock('@/utils/sentry', () => ({
  captureError: jest.fn(),
  captureMessage: jest.fn()
}));

describe('useStraightLineTool', () => {
  let canvas: Canvas;
  let canvasRef: React.MutableRefObject<Canvas | null>;
  const saveCurrentState = jest.fn();
  
  beforeEach(() => {
    // Create a new canvas instance for each test
    canvas = new Canvas(document.createElement('canvas'));
    canvasRef = { current: canvas };
    
    // Reset mocks
    saveCurrentState.mockReset();
    
    // Add methods that might be missing in the mock
    (canvas as any).on = jest.fn();
    (canvas as any).off = jest.fn();
  });
  
  afterEach(() => {
    canvas = null as any;
    canvasRef.current = null;
  });
  
  it('should return the correct initial state', () => {
    const { result } = renderHook(() => useStraightLineTool({
      fabricCanvasRef: canvasRef,
      tool: DrawingMode.STRAIGHT_LINE,
      lineColor: '#000000',
      lineThickness: 2,
      saveCurrentState
    }));
    
    expect(result.current.isActive).toBeTruthy();
    expect(result.current.isToolInitialized).toBeTruthy();
    expect(result.current.isDrawing).toBeFalsy();
    expect(result.current.currentLine).toBeNull();
  });
  
  it('should not initialize if the tool is not straight line', () => {
    const { result } = renderHook(() => useStraightLineTool({
      fabricCanvasRef: canvasRef,
      tool: DrawingMode.DRAW,
      lineColor: '#000000',
      lineThickness: 2,
      saveCurrentState
    }));
    
    expect(result.current.isActive).toBeFalsy();
  });
  
  it('should register event handlers when the tool is active', () => {
    renderHook(() => useStraightLineTool({
      fabricCanvasRef: canvasRef,
      tool: DrawingMode.STRAIGHT_LINE,
      lineColor: '#000000',
      lineThickness: 2,
      saveCurrentState
    }));
    
    expect(canvas.on).toHaveBeenCalledWith('mouse:down', expect.any(Function));
    expect(canvas.on).toHaveBeenCalledWith('mouse:move', expect.any(Function));
    expect(canvas.on).toHaveBeenCalledWith('mouse:up', expect.any(Function));
  });
  
  it('should remove event handlers when the hook unmounts', () => {
    const { unmount } = renderHook(() => useStraightLineTool({
      fabricCanvasRef: canvasRef,
      tool: DrawingMode.STRAIGHT_LINE,
      lineColor: '#000000',
      lineThickness: 2,
      saveCurrentState
    }));
    
    unmount();
    
    expect(canvas.off).toHaveBeenCalledWith('mouse:down', expect.any(Function));
    expect(canvas.off).toHaveBeenCalledWith('mouse:move', expect.any(Function));
    expect(canvas.off).toHaveBeenCalledWith('mouse:up', expect.any(Function));
  });
  
  it('should cancel drawing when cancelDrawing is called', () => {
    // Mock for testing removal of temporary objects
    (canvas as any).contains = jest.fn().mockReturnValue(true);
    (canvas as any).remove = jest.fn();
    
    // Create mock line and tooltip
    const mockLine = new Line([0, 0, 100, 100]);
    const mockTooltip = { type: 'text', text: '100px' };
    
    // Update the mock to return the objects
    jest.mock('../straightLineTool/useLineState', () => ({
      useLineState: () => ({
        isDrawing: true,
        isToolInitialized: true,
        startPointRef: { current: { x: 0, y: 0 } },
        currentLineRef: { current: mockLine },
        distanceTooltipRef: { current: mockTooltip },
        setIsDrawing: jest.fn(),
        setStartPoint: jest.fn(),
        setCurrentLine: jest.fn(),
        setDistanceTooltip: jest.fn(),
        initializeTool: jest.fn(),
        resetDrawingState: jest.fn()
      })
    }));
    
    const { result } = renderHook(() => useStraightLineTool({
      fabricCanvasRef: canvasRef,
      tool: DrawingMode.STRAIGHT_LINE,
      lineColor: '#000000',
      lineThickness: 2,
      saveCurrentState
    }));
    
    // Test isDrawing property is accessible
    expect(result.current.isDrawing).toBeDefined();
    
    act(() => {
      result.current.cancelDrawing();
    });
    
    // Canvas render should be called
    expect(canvas.renderAll).toHaveBeenCalled();
  });
  
  it('should properly handle tool changes', () => {
    const { rerender } = renderHook(
      ({ tool }) => useStraightLineTool({
        fabricCanvasRef: canvasRef,
        tool,
        lineColor: '#000000',
        lineThickness: 2,
        saveCurrentState
      }),
      { initialProps: { tool: DrawingMode.STRAIGHT_LINE } }
    );
    
    // Change tool
    rerender({ tool: DrawingMode.SELECT });
    
    // Event handlers should be removed
    expect(canvas.off).toHaveBeenCalled();
    
    // Change back to straight line
    rerender({ tool: DrawingMode.STRAIGHT_LINE });
    
    // Event handlers should be added again
    expect(canvas.on).toHaveBeenCalled();
  });
});
