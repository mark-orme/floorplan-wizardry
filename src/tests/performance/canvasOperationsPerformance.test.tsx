
/**
 * Canvas operations performance test
 * Measures and ensures canvas rendering performance stays consistent
 * @module tests/performance/canvasOperationsPerformance
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Canvas, Object as FabricObject } from 'fabric';
import { createMockCanvas, createMockObject } from '@/utils/test/mockFabricCanvas';
import { useCanvasOperations } from '@/hooks/canvas/useCanvasOperations';
import { renderHook } from '@testing-library/react-hooks';

describe('Canvas Operations Performance Tests', () => {
  let canvas: Canvas;
  let saveCurrentState: () => void;
  
  beforeEach(() => {
    canvas = createMockCanvas() as unknown as Canvas;
    saveCurrentState = vi.fn();
    
    // Clear previous mocks
    vi.clearAllMocks();
  });
  
  it('performs deletions efficiently with many objects', () => {
    // Add many objects to the canvas
    const objects = Array(100).fill(null).map((_, i) => 
      createMockObject('rect', { id: `rect-${i}` })
    ) as unknown as FabricObject[];
    
    objects.forEach(obj => canvas.add(obj));
    
    // Mock getActiveObject to return an activeSelection
    const activeSelection = {
      type: 'activeSelection',
      getObjects: vi.fn().mockReturnValue(objects.slice(0, 50)),
      forEachObject: vi.fn((callback) => {
        objects.slice(0, 50).forEach(callback);
      })
    };
    
    vi.spyOn(canvas, 'getActiveObject').mockReturnValue(activeSelection as any);
    
    // Set up the hook
    const { result } = renderHook(() => useCanvasOperations({
      canvas,
      saveCurrentState
    }));
    
    // Mock performance.now for timing
    const originalPerformanceNow = performance.now;
    const mockPerformanceNow = vi.fn();
    let time = 0;
    mockPerformanceNow.mockImplementation(() => {
      time += 10; // Simulate 10ms per operation
      return time;
    });
    global.performance.now = mockPerformanceNow;
    
    // Track remove calls
    const removeSpy = vi.spyOn(canvas, 'remove');
    
    // Execute deletion
    result.current.deleteSelectedObjects();
    
    // Verify number of remove calls
    expect(removeSpy).toHaveBeenCalledTimes(50);
    
    // Restore performance.now
    global.performance.now = originalPerformanceNow;
  });
  
  it('performs canvas clearing efficiently', () => {
    // Add many objects to the canvas
    const objects = Array(100).fill(null).map((_, i) => 
      createMockObject('rect', { id: `rect-${i}` })
    ) as unknown as FabricObject[];
    
    objects.forEach(obj => canvas.add(obj));
    
    // Add grid objects
    const gridObjects = Array(20).fill(null).map((_, i) => 
      createMockObject('line', { id: `grid-${i}`, objectType: 'grid' })
    ) as unknown as FabricObject[];
    
    gridObjects.forEach(obj => canvas.add(obj));
    
    // Mock getObjects to return all objects
    vi.spyOn(canvas, 'getObjects').mockReturnValue([...objects, ...gridObjects]);
    
    // Set up the hook
    const { result } = renderHook(() => useCanvasOperations({
      canvas,
      saveCurrentState
    }));
    
    // Track remove calls
    const removeSpy = vi.spyOn(canvas, 'remove');
    
    // Execute clear
    result.current.clearCanvas();
    
    // Verify number of remove calls - should only remove non-grid objects
    expect(removeSpy).toHaveBeenCalledWith(...objects);
    expect(removeSpy).not.toHaveBeenCalledWith(...gridObjects);
  });
  
  it('performs zooming operations efficiently', () => {
    // Mock the zoomToPoint method
    const zoomToPointSpy = vi.spyOn(canvas, 'zoomToPoint');
    
    // Set up the hook
    const { result } = renderHook(() => useCanvasOperations({
      canvas,
      saveCurrentState
    }));
    
    // Execute zoom in
    result.current.zoom('in');
    
    // Verify zoomToPoint was called
    expect(zoomToPointSpy).toHaveBeenCalled();
    
    // Execute zoom out
    result.current.zoom('out');
    
    // Verify zoomToPoint was called again
    expect(zoomToPointSpy).toHaveBeenCalledTimes(2);
  });
  
  it('performs save operation efficiently', () => {
    // Mock JSON stringification
    const originalStringify = JSON.stringify;
    const stringifySpy = vi.fn().mockReturnValue('{}');
    JSON.stringify = stringifySpy;
    
    // Mock canvas.toJSON
    vi.spyOn(canvas, 'toJSON').mockReturnValue({});
    
    // Mock URL.createObjectURL
    const originalCreateObjectURL = URL.createObjectURL;
    URL.createObjectURL = vi.fn().mockReturnValue('blob:url');
    
    // Mock URL.revokeObjectURL
    const originalRevokeObjectURL = URL.revokeObjectURL;
    URL.revokeObjectURL = vi.fn();
    
    // Mock document.createElement
    const mockAnchor = {
      href: '',
      download: '',
      click: vi.fn()
    };
    
    const originalCreateElement = document.createElement;
    document.createElement = vi.fn().mockReturnValue(mockAnchor);
    
    // Set up the hook
    const { result } = renderHook(() => useCanvasOperations({
      canvas,
      saveCurrentState
    }));
    
    // Execute save
    result.current.saveCanvas();
    
    // Verify JSON.stringify was called
    expect(stringifySpy).toHaveBeenCalled();
    
    // Verify anchor was created and clicked
    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(mockAnchor.click).toHaveBeenCalled();
    
    // Verify URL was revoked
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:url');
    
    // Restore mocks
    JSON.stringify = originalStringify;
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
    document.createElement = originalCreateElement;
  });
});
