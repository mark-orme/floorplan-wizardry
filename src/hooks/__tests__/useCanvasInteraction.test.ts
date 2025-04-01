
/**
 * Tests for useCanvasInteraction hook
 * @module hooks/__tests__/useCanvasInteraction
 */
import { renderHook, act } from '@testing-library/react-hooks';
import { useCanvasInteraction } from '@/hooks/useCanvasInteraction';
import { DrawingMode } from '@/constants/drawingModes';
import { toast } from 'sonner';
import logger from '@/utils/logger';
import { createMockCanvas, createMockObject } from '@/utils/test/mockFabricCanvas';

// Mock dependencies
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn()
  }
}));

vi.mock('@/utils/logger', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn()
  }
}));

describe('useCanvasInteraction', () => {
  // Setup mocks
  let mockCanvas;
  let fabricCanvasRef;
  let saveCurrentState;
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    mockCanvas = createMockCanvas();
    
    // Add some mock objects to the canvas
    const regularObject = createMockObject({ type: 'rect', id: 'rect1' });
    const gridObject = createMockObject({ 
      type: 'line', 
      objectType: 'grid', 
      id: 'grid1'
    });
    const lineObject = createMockObject({
      type: 'polyline',
      id: 'line1'
    });
    
    // Setup mock objects array
    mockCanvas.getObjects = vi.fn().mockReturnValue([regularObject, gridObject, lineObject]);
    
    // Setup mock active objects
    mockCanvas.getActiveObjects = vi.fn().mockReturnValue([regularObject, lineObject]);
    
    fabricCanvasRef = { current: mockCanvas };
    saveCurrentState = vi.fn();
  });
  
  it('should delete selected objects', () => {
    const { result } = renderHook(() => useCanvasInteraction({
      fabricCanvasRef,
      tool: DrawingMode.SELECT,
      saveCurrentState
    }));
    
    act(() => {
      result.current.deleteSelectedObjects();
    });
    
    // Should save current state before deletion
    expect(saveCurrentState).toHaveBeenCalled();
    
    // Should call remove on the canvas with the active objects
    expect(mockCanvas.remove).toHaveBeenCalled();
    
    // Should discard active object
    expect(mockCanvas.discardActiveObject).toHaveBeenCalled();
    
    // Should render canvas
    expect(mockCanvas.requestRenderAll).toHaveBeenCalled();
    
    // Should show success toast
    expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('Deleted'));
  });
  
  it('should not delete grid objects', () => {
    // Override getActiveObjects to include grid object
    const regularObject = createMockObject({ type: 'rect', id: 'rect1' });
    const gridObject = createMockObject({ 
      type: 'line', 
      objectType: 'grid', 
      id: 'grid1'
    });
    
    mockCanvas.getActiveObjects = vi.fn().mockReturnValue([regularObject, gridObject]);
    
    const { result } = renderHook(() => useCanvasInteraction({
      fabricCanvasRef,
      tool: DrawingMode.SELECT,
      saveCurrentState
    }));
    
    act(() => {
      result.current.deleteSelectedObjects();
    });
    
    // Should filter out grid objects before deletion
    expect(mockCanvas.remove).toHaveBeenCalledWith(regularObject);
    expect(mockCanvas.remove).not.toHaveBeenCalledWith(gridObject);
  });
  
  it('should enable point selection mode', () => {
    const { result } = renderHook(() => useCanvasInteraction({
      fabricCanvasRef,
      tool: DrawingMode.SELECT,
      saveCurrentState
    }));
    
    act(() => {
      result.current.enablePointSelection();
    });
    
    // Should disable canvas selection (lasso)
    expect(mockCanvas.selection).toBe(false);
    
    // Should set appropriate cursors
    expect(mockCanvas.defaultCursor).toBe('default');
    expect(mockCanvas.hoverCursor).toBe('pointer');
    
    // Get objects from mock canvas
    const objects = mockCanvas.getObjects();
    
    // Check that objects are correctly configured for selection
    objects.forEach(obj => {
      if (obj.objectType && obj.objectType.includes('grid')) {
        // Grid objects should not be selectable
        expect(obj.selectable).toBe(false);
        expect(obj.evented).toBe(false);
      } else {
        // Non-grid objects should be selectable
        expect(obj.selectable).toBe(true);
        if (obj.type === 'polyline' || obj.type === 'line') {
          // Line types should have enhanced selection settings
          expect(obj.perPixelTargetFind).toBe(false);
          expect(obj.targetFindTolerance).toBe(10);
        }
      }
    });
    
    // Should render canvas
    expect(mockCanvas.requestRenderAll).toHaveBeenCalled();
  });
  
  it('should setup selection mode based on tool', () => {
    // Test with SELECT tool
    const { result, rerender } = renderHook(
      (props) => useCanvasInteraction({
        fabricCanvasRef,
        tool: props.tool,
        saveCurrentState
      }),
      { initialProps: { tool: DrawingMode.SELECT } }
    );
    
    act(() => {
      result.current.setupSelectionMode();
    });
    
    // Should enable point selection for SELECT tool
    expect(mockCanvas.selection).toBe(false); // Lasso disabled
    expect(mockCanvas.defaultCursor).toBe('default');
    
    // Reset mock
    vi.clearAllMocks();
    
    // Test with non-SELECT tool
    rerender({ tool: DrawingMode.DRAW });
    
    act(() => {
      result.current.setupSelectionMode();
    });
    
    // For non-SELECT tools, objects should not be selectable
    const objects = mockCanvas.getObjects();
    objects.forEach(obj => {
      expect(obj.selectable).toBe(false);
    });
  });
  
  it('should handle no selected objects gracefully', () => {
    // Override getActiveObjects to return empty array
    mockCanvas.getActiveObjects = vi.fn().mockReturnValue([]);
    
    const { result } = renderHook(() => useCanvasInteraction({
      fabricCanvasRef,
      tool: DrawingMode.SELECT,
      saveCurrentState
    }));
    
    act(() => {
      result.current.deleteSelectedObjects();
    });
    
    // Should not call saveCurrentState when no objects selected
    expect(saveCurrentState).not.toHaveBeenCalled();
    
    // Should not call remove
    expect(mockCanvas.remove).not.toHaveBeenCalled();
    
    // Should show info toast
    expect(toast.info).toHaveBeenCalledWith(expect.stringContaining('No objects selected'));
  });
  
  it('should handle missing canvas gracefully', () => {
    const emptyCanvasRef = { current: null };
    
    const { result } = renderHook(() => useCanvasInteraction({
      fabricCanvasRef: emptyCanvasRef,
      tool: DrawingMode.SELECT,
      saveCurrentState
    }));
    
    // These operations should not throw errors when canvas is null
    act(() => {
      result.current.deleteSelectedObjects();
      result.current.enablePointSelection();
      result.current.setupSelectionMode();
    });
    
    // No operations should be performed
    expect(saveCurrentState).not.toHaveBeenCalled();
  });
});
