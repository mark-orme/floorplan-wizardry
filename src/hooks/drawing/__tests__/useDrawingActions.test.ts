
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useDrawingActions } from '../useDrawingActions';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingTool } from '@/types/core/DrawingTool';
import { toast } from 'sonner';

// Mock dependencies
vi.mock('sonner', () => ({
  toast: vi.fn()
}));

// Mock fabric
vi.mock('fabric', () => ({
  Canvas: vi.fn().mockImplementation(() => ({
    getObjects: vi.fn().mockReturnValue([
      { id: 'obj1', isGrid: false },
      { id: 'obj2', isGrid: false },
      { id: 'grid1', isGrid: true }
    ]),
    remove: vi.fn(),
    renderAll: vi.fn(),
    getActiveObjects: vi.fn().mockReturnValue([
      { id: 'active1', isGrid: false }
    ]),
    discardActiveObject: vi.fn(),
    requestRenderAll: vi.fn()
  }))
}));

describe('useDrawingActions', () => {
  let canvas: FabricCanvas;
  let canvasRef: React.MutableRefObject<FabricCanvas | null>;
  let saveCurrentState: () => void;
  let setTool: (tool: DrawingTool) => void;
  let setZoomLevel: (zoom: number) => void;
  
  beforeEach(() => {
    // Create a fresh canvas instance for each test
    canvas = new FabricCanvas();
    canvasRef = { current: canvas };
    
    // Create mock functions
    saveCurrentState = vi.fn();
    setTool = vi.fn();
    setZoomLevel = vi.fn();
    
    // Clear any previous mock calls
    vi.clearAllMocks();
  });
  
  it('should change tool correctly', () => {
    // Setup the hook
    const { result } = renderHook(() => useDrawingActions({
      fabricCanvasRef: canvasRef,
      saveCurrentState,
      tool: 'select' as DrawingTool,
      setTool,
      zoomLevel: 1,
      setZoomLevel
    }));
    
    // Call handleToolChange
    act(() => {
      result.current.handleToolChange('rectangle' as DrawingTool);
    });
    
    // Check that saveCurrentState was called
    expect(saveCurrentState).toHaveBeenCalled();
    
    // Check that setTool was called with the new tool
    expect(setTool).toHaveBeenCalledWith('rectangle');
    
    // Check that toast was shown
    expect(toast).toHaveBeenCalled();
  });
  
  it('should handle zoom changes', () => {
    // Setup the hook
    const { result } = renderHook(() => useDrawingActions({
      fabricCanvasRef: canvasRef,
      saveCurrentState,
      tool: 'select' as DrawingTool,
      setTool,
      zoomLevel: 1,
      setZoomLevel
    }));
    
    // Call handleZoom to zoom in
    act(() => {
      result.current.handleZoom(1.2);
    });
    
    // Check that setZoomLevel was called
    expect(setZoomLevel).toHaveBeenCalled();
  });
  
  it('should clear canvas correctly', () => {
    // Setup the hook
    const { result } = renderHook(() => useDrawingActions({
      fabricCanvasRef: canvasRef,
      saveCurrentState,
      tool: 'select' as DrawingTool,
      setTool,
      zoomLevel: 1,
      setZoomLevel
    }));
    
    // Call clearCanvas
    act(() => {
      result.current.clearCanvas();
    });
    
    // Check that saveCurrentState was called before clearing
    expect(saveCurrentState).toHaveBeenCalled();
    
    // Check that getObjects was called to find non-grid objects
    expect(canvas.getObjects).toHaveBeenCalled();
    
    // Check that remove was called for non-grid objects
    expect(canvas.remove).toHaveBeenCalled();
    
    // Check that renderAll was called
    expect(canvas.renderAll).toHaveBeenCalled();
  });
  
  it('should delete selected objects correctly', () => {
    // Setup the hook
    const { result } = renderHook(() => useDrawingActions({
      fabricCanvasRef: canvasRef,
      saveCurrentState,
      tool: 'select' as DrawingTool,
      setTool,
      zoomLevel: 1,
      setZoomLevel
    }));
    
    // Call deleteSelectedObjects
    act(() => {
      result.current.deleteSelectedObjects();
    });
    
    // Check that saveCurrentState was called
    expect(saveCurrentState).toHaveBeenCalled();
    
    // Check that getActiveObjects was called
    expect(canvas.getActiveObjects).toHaveBeenCalled();
    
    // Check that remove was called for selected objects
    expect(canvas.remove).toHaveBeenCalled();
    
    // Check that selection was cleared
    expect(canvas.discardActiveObject).toHaveBeenCalled();
    
    // Check that canvas was re-rendered
    expect(canvas.requestRenderAll).toHaveBeenCalled();
  });
  
  it('should handle null canvas gracefully', () => {
    // Setup the hook with null canvas
    const { result } = renderHook(() => useDrawingActions({
      fabricCanvasRef: { current: null },
      saveCurrentState,
      tool: 'select' as DrawingTool,
      setTool,
      zoomLevel: 1,
      setZoomLevel
    }));
    
    // Call functions - should not throw errors
    act(() => {
      result.current.handleToolChange('rectangle' as DrawingTool);
      result.current.handleZoom(1.2);
      result.current.clearCanvas();
      result.current.deleteSelectedObjects();
      result.current.saveCanvas();
    });
    
    // Check that saveCurrentState was not called
    expect(saveCurrentState).not.toHaveBeenCalled();
  });
});
