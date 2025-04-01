
/**
 * Tests for the canvas interaction hook
 * @module __tests__/hooks/useCanvasInteraction.test
 */
import { renderHook, act } from '@testing-library/react-hooks';
import { useCanvasInteraction } from '@/hooks/useCanvasInteraction';
import { Canvas, Line } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';

// Mock fabric.js
jest.mock('fabric');

// Mock toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    info: jest.fn(),
    error: jest.fn()
  }
}));

describe('useCanvasInteraction', () => {
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
  
  it('should delete selected objects when deleteSelectedObjects is called', () => {
    // Add some objects to the canvas
    const line1 = new Line([0, 0, 100, 100]);
    const line2 = new Line([0, 0, 200, 200]);
    line1.activeOn = true; // Mark as selected using activeOn instead of active
    
    canvas.add(line1, line2);
    
    const { result } = renderHook(() => useCanvasInteraction({
      fabricCanvasRef: canvasRef,
      tool: DrawingMode.SELECT,
      saveCurrentState
    }));
    
    act(() => {
      result.current.deleteSelectedObjects();
    });
    
    // Should call saveCurrentState before deleting
    expect(saveCurrentState).toHaveBeenCalled();
    
    // Should remove selected object
    expect(canvas.contains(line1)).toBe(false);
    expect(canvas.contains(line2)).toBe(true);
  });
  
  it('should enable point selection when enablePointSelection is called', () => {
    // Add some objects to the canvas
    const line = new Line([0, 0, 100, 100]);
    const gridLine = new Line([0, 0, 200, 200]);
    (gridLine as any).objectType = 'grid'; // Mark as a grid object
    
    canvas.add(line, gridLine);
    
    const { result } = renderHook(() => useCanvasInteraction({
      fabricCanvasRef: canvasRef,
      tool: DrawingMode.SELECT,
      saveCurrentState
    }));
    
    act(() => {
      result.current.enablePointSelection();
    });
    
    // Selection should be disabled on canvas (no lasso selection)
    expect(canvas.selection).toBe(false);
    
    // Regular objects should be selectable
    expect(line.selectable).toBe(true);
    
    // Grid objects should not be selectable
    expect(gridLine.selectable).toBe(false);
  });
  
  it('should setup selection mode based on tool', () => {
    const { result } = renderHook(() => useCanvasInteraction({
      fabricCanvasRef: canvasRef,
      tool: DrawingMode.SELECT,
      saveCurrentState
    }));
    
    act(() => {
      result.current.setupSelectionMode();
    });
    
    // For SELECT tool, should enable selection
    expect(canvas.selection).toBe(false); // Using point selection, not lasso
    
    // Change tool to non-select
    const { result: resultDraw } = renderHook(() => useCanvasInteraction({
      fabricCanvasRef: canvasRef,
      tool: DrawingMode.DRAW,
      saveCurrentState
    }));
    
    act(() => {
      resultDraw.current.setupSelectionMode();
    });
    
    // For DRAW tool, should disable selection
    expect(canvas.selection).toBe(false);
  });
});
