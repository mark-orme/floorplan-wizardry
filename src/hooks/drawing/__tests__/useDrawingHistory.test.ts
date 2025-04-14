
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useDrawingHistory } from '../useDrawingHistory';
import { Canvas as FabricCanvas } from 'fabric';

// Mock fabric
vi.mock('fabric', () => ({
  Canvas: vi.fn().mockImplementation(() => ({
    getObjects: vi.fn().mockReturnValue([
      { id: 'obj1', isGrid: false },
      { id: 'obj2', isGrid: false },
      { id: 'grid1', isGrid: true }
    ]),
    remove: vi.fn(),
    add: vi.fn(),
    renderAll: vi.fn()
  }))
}));

describe('useDrawingHistory', () => {
  let canvas: FabricCanvas;
  let canvasRef: React.MutableRefObject<FabricCanvas | null>;
  let historyRef: React.MutableRefObject<{past: any[][], future: any[][]}>;
  
  beforeEach(() => {
    // Create a fresh canvas instance for each test
    canvas = new FabricCanvas();
    canvasRef = { current: canvas };
    
    // Initialize history ref
    historyRef = { current: { past: [], future: [] } };
    
    // Clear any previous mock calls
    vi.clearAllMocks();
  });
  
  it('should save current state correctly', () => {
    // Setup the hook
    const { result } = renderHook(() => useDrawingHistory({
      fabricCanvasRef: canvasRef,
      historyRef
    }));
    
    // Call saveCurrentState
    act(() => {
      result.current.saveCurrentState();
    });
    
    // Check that getObjects was called
    expect(canvas.getObjects).toHaveBeenCalled();
    
    // Past should have one state with non-grid objects
    expect(historyRef.current.past.length).toBe(1);
    
    // Future should be cleared
    expect(historyRef.current.future.length).toBe(0);
  });
  
  it('should perform undo correctly', () => {
    // Setup initial state
    historyRef.current.past = [
      [{ id: 'past-obj1' }, { id: 'past-obj2' }]
    ];
    
    // Setup the hook
    const { result } = renderHook(() => useDrawingHistory({
      fabricCanvasRef: canvasRef,
      historyRef
    }));
    
    // Call undo
    act(() => {
      result.current.undo();
    });
    
    // Check objects were removed
    expect(canvas.remove).toHaveBeenCalled();
    
    // Check past objects were added back
    expect(canvas.add).toHaveBeenCalled();
    
    // Check past state was moved to future
    expect(historyRef.current.past.length).toBe(0);
    expect(historyRef.current.future.length).toBe(1);
    
    // Check canvas was rendered
    expect(canvas.renderAll).toHaveBeenCalled();
  });
  
  it('should perform redo correctly', () => {
    // Setup initial state
    historyRef.current.future = [
      [{ id: 'future-obj1' }, { id: 'future-obj2' }]
    ];
    
    // Setup the hook
    const { result } = renderHook(() => useDrawingHistory({
      fabricCanvasRef: canvasRef,
      historyRef
    }));
    
    // Call redo
    act(() => {
      result.current.redo();
    });
    
    // Check objects were removed
    expect(canvas.remove).toHaveBeenCalled();
    
    // Check future objects were added back
    expect(canvas.add).toHaveBeenCalled();
    
    // Check future state was moved to past
    expect(historyRef.current.future.length).toBe(0);
    expect(historyRef.current.past.length).toBe(1);
    
    // Check canvas was rendered
    expect(canvas.renderAll).toHaveBeenCalled();
  });
  
  it('should handle empty history gracefully', () => {
    // Setup the hook with empty history
    const { result } = renderHook(() => useDrawingHistory({
      fabricCanvasRef: canvasRef,
      historyRef: { current: { past: [], future: [] } }
    }));
    
    // Call undo and redo - should not throw errors
    act(() => {
      result.current.undo();
      result.current.redo();
    });
    
    // Check that canvas.remove was not called
    expect(canvas.remove).not.toHaveBeenCalled();
  });
  
  it('should handle null canvas gracefully', () => {
    // Setup the hook with null canvas
    const { result } = renderHook(() => useDrawingHistory({
      fabricCanvasRef: { current: null },
      historyRef
    }));
    
    // Call functions - should not throw errors
    act(() => {
      result.current.saveCurrentState();
      result.current.undo();
      result.current.redo();
    });
    
    // No assertions needed, just ensuring no errors are thrown
  });
});
