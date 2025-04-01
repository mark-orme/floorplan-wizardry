
/**
 * Tests for the canvas interaction hook
 * @module __tests__/hooks/useCanvasInteraction.test
 */
import { renderHook, act } from '@testing-library/react-hooks';
import { useCanvasInteraction } from '@/hooks/useCanvasInteraction';
import { Canvas, Line } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { vi } from 'vitest';
import { createMockCanvas, createMockObject, MockCanvasObject } from '@/tests/utils/canvasTestUtils';

// Mock fabric.js
vi.mock('fabric');

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    info: vi.fn(),
    error: vi.fn()
  }
}));

describe('useCanvasInteraction', () => {
  let canvas: Canvas;
  let canvasRef: React.MutableRefObject<Canvas | null>;
  const saveCurrentState = vi.fn();
  
  beforeEach(() => {
    // Create a new canvas instance for each test
    canvas = createMockCanvas();
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
    const line1 = createMockObject('line', { id: 'line1' });
    const line2 = createMockObject('line', { objectType: 'grid', id: 'line2' });
    
    // Use "down" instead of true for activeOn
    (line1 as any).activeOn = "down"; // Changed from true to "down"
    
    canvas.add(line1 as any, line2 as any);
    
    // Mock getActiveObjects
    canvas.getActiveObjects = vi.fn().mockReturnValue([line1]);
    canvas.contains = vi.fn().mockReturnValue(true);
    
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
    expect(canvas.remove).toHaveBeenCalledWith(line1);
  });
  
  it('should enable point selection when enablePointSelection is called', () => {
    // Add some objects to the canvas
    const line = createMockObject('line', { id: 'line1' });
    const gridLine = createMockObject('line', { objectType: 'grid', id: 'grid1' });
    
    canvas.add(line as any, gridLine as any);
    
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
