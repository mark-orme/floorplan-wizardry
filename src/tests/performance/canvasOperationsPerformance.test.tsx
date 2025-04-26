
/**
 * Performance tests for canvas operations
 * @module tests/performance/canvasOperationsPerformance
 */
import { renderHook } from '@testing-library/react-hooks';
import { useCanvasOperations } from '@/hooks/useCanvasOperations';
import { MockCanvas } from '@/utils/test/createMockCanvas';
import { vi, describe, it, expect } from 'vitest';
import { Canvas, Object as FabricObject } from 'fabric';

// Type definition for canvas operations result
interface CanvasOperationsResult {
  addShape: (type: string, options: Record<string, unknown>) => void;
  clearCanvas: () => void;
  getObjectCount: () => number;
  getPerformanceMetrics: () => PerformanceMetrics;
}

// Type definition for performance metrics
interface PerformanceMetrics {
  objectCount: number;
  renderTime: number;
  timestamp: number;
}

// Mock function to measure performance
const measurePerformance = vi.fn().mockReturnValue({
  objectCount: 0,
  renderTime: 10,
  timestamp: Date.now()
});

// Mock the hooks dependencies
vi.mock('@/hooks/useCanvasMetrics', () => ({
  useCanvasMetrics: () => ({
    measurePerformance
  })
}));

describe('Canvas Operations Performance', () => {
  // Create a mock canvas for testing
  let mockCanvas: MockCanvas;
  
  beforeEach(() => {
    mockCanvas = {
      add: vi.fn(),
      remove: vi.fn(),
      clear: vi.fn(),
      getObjects: vi.fn().mockReturnValue([]),
      renderAll: vi.fn()
    } as MockCanvas;
    
    vi.clearAllMocks();
    vi.useFakeTimers();
  });
  
  afterEach(() => {
    vi.useRealTimers();
  });
  
  it('should measure performance when adding objects', () => {
    // Create mock rectangle
    const mockRect = { type: 'rect' } as FabricObject;
    
    // Setup mock to return our mock rectangle
    const createRectMock = vi.fn().mockReturnValue(mockRect);
    
    // Test hooks with mocked canvas
    const { result } = renderHook<unknown, CanvasOperationsResult>(() => 
      useCanvasOperations({
        canvas: mockCanvas as Canvas,
        createRect: createRectMock
      })
    );
    
    // Act - add a shape
    result.current.addShape('rectangle', { width: 100, height: 100 });
    
    // Assert
    expect(createRectMock).toHaveBeenCalled();
    expect(mockCanvas.add).toHaveBeenCalledWith(mockRect);
    expect(measurePerformance).toHaveBeenCalled();
  });
  
  it('should measure object count correctly', () => {
    // Setup mock objects array
    const mockObjects = [
      { id: 'obj1', type: 'rect' },
      { id: 'obj2', type: 'circle' }
    ] as FabricObject[];
    
    // Make getObjects return our mock objects
    vi.mocked(mockCanvas.getObjects).mockReturnValue(mockObjects);
    
    // Test hooks with mocked canvas
    const { result } = renderHook<unknown, CanvasOperationsResult>(() => 
      useCanvasOperations({
        canvas: mockCanvas as Canvas
      })
    );
    
    // Act - get object count
    const count = result.current.getObjectCount();
    
    // Assert
    expect(count).toBe(mockObjects.length);
    expect(mockCanvas.getObjects).toHaveBeenCalled();
  });
  
  it('should measure performance when clearing canvas', () => {
    // Test hooks with mocked canvas
    const { result } = renderHook<unknown, CanvasOperationsResult>(() => 
      useCanvasOperations({
        canvas: mockCanvas as Canvas
      })
    );
    
    // Act - clear canvas
    result.current.clearCanvas();
    
    // Assert
    expect(mockCanvas.clear).toHaveBeenCalled();
    expect(measurePerformance).toHaveBeenCalled();
  });
});
