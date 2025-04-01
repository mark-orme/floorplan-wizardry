
/**
 * Tests for the drawing tool manager hook
 * @module __tests__/hooks/useDrawingToolManager.test
 */
import { renderHook, act } from '@testing-library/react-hooks';
import { useDrawingToolManager } from '@/hooks/drawing/useDrawingToolManager';
import { Canvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';

// Mock fabric.js
jest.mock('fabric');

describe('useDrawingToolManager', () => {
  let canvas: Canvas;
  let canvasRef: React.MutableRefObject<Canvas | null>;
  const saveCurrentState = jest.fn();
  
  beforeEach(() => {
    // Create a new canvas instance for each test
    canvas = new Canvas(document.createElement('canvas'));
    canvasRef = { current: canvas };
    
    // Reset mocks
    saveCurrentState.mockReset();
  });
  
  afterEach(() => {
    canvas = null as unknown as Canvas;
    canvasRef.current = null;
  });
  
  it('should initialize with default drawing state', () => {
    const { result } = renderHook(() => useDrawingToolManager({
      fabricCanvasRef: canvasRef,
      tool: DrawingMode.SELECT,
      saveCurrentState
    }));
    
    expect(result.current.drawingState).toEqual({
      isDrawing: false,
      startPoint: null,
      currentPoint: null,
      points: [],
      currentDrawingObject: null
    });
  });
  
  it('should start drawing when startDrawing is called', () => {
    const { result } = renderHook(() => useDrawingToolManager({
      fabricCanvasRef: canvasRef,
      tool: DrawingMode.STRAIGHT_LINE,
      saveCurrentState
    }));
    
    const point = { x: 100, y: 100 };
    
    act(() => {
      result.current.startDrawing(point);
    });
    
    expect(result.current.drawingState.isDrawing).toBe(true);
    expect(result.current.drawingState.startPoint).toEqual(point);
    expect(result.current.drawingState.currentPoint).toEqual(point);
    expect(result.current.drawingState.points).toEqual([point]);
    expect(saveCurrentState).toHaveBeenCalled();
  });
  
  it('should update points when continueDrawing is called', () => {
    const { result } = renderHook(() => useDrawingToolManager({
      fabricCanvasRef: canvasRef,
      tool: DrawingMode.STRAIGHT_LINE,
      saveCurrentState
    }));
    
    const startPoint = { x: 100, y: 100 };
    const movePoint = { x: 150, y: 150 };
    
    act(() => {
      result.current.startDrawing(startPoint);
    });
    
    act(() => {
      result.current.continueDrawing(movePoint);
    });
    
    expect(result.current.drawingState.isDrawing).toBe(true);
    expect(result.current.drawingState.currentPoint).toEqual(movePoint);
    expect(result.current.drawingState.points).toEqual([startPoint, movePoint]);
  });
  
  it('should end drawing when endDrawing is called', () => {
    const { result } = renderHook(() => useDrawingToolManager({
      fabricCanvasRef: canvasRef,
      tool: DrawingMode.STRAIGHT_LINE,
      saveCurrentState
    }));
    
    const startPoint = { x: 100, y: 100 };
    const endPoint = { x: 200, y: 200 };
    
    act(() => {
      result.current.startDrawing(startPoint);
    });
    
    act(() => {
      result.current.endDrawing(endPoint);
    });
    
    expect(result.current.drawingState.isDrawing).toBe(false);
    expect(result.current.drawingState.currentPoint).toEqual(endPoint);
    expect(result.current.drawingState.points).toEqual([startPoint, endPoint]);
    expect(saveCurrentState).toHaveBeenCalledTimes(2); // Once at start, once at end
  });
  
  it('should cancel drawing when cancelDrawing is called', () => {
    const { result } = renderHook(() => useDrawingToolManager({
      fabricCanvasRef: canvasRef,
      tool: DrawingMode.STRAIGHT_LINE,
      saveCurrentState
    }));
    
    const startPoint = { x: 100, y: 100 };
    
    act(() => {
      result.current.startDrawing(startPoint);
    });
    
    act(() => {
      result.current.cancelDrawing();
    });
    
    expect(result.current.drawingState.isDrawing).toBe(false);
    expect(result.current.drawingState.startPoint).toBeNull();
    expect(result.current.drawingState.currentPoint).toBeNull();
    expect(result.current.drawingState.points).toEqual([]);
  });
  
  it('should provide mouse event handlers', () => {
    const { result } = renderHook(() => useDrawingToolManager({
      fabricCanvasRef: canvasRef,
      tool: DrawingMode.STRAIGHT_LINE,
      saveCurrentState
    }));
    
    expect(result.current.mouseHandlers.handleMouseDown).toBeDefined();
    expect(result.current.mouseHandlers.handleMouseMove).toBeDefined();
    expect(result.current.mouseHandlers.handleMouseUp).toBeDefined();
  });
});
