
/**
 * Grid regression tests
 * These tests ensure that the grid functionality doesn't break across updates
 */
import { createGrid } from '@/utils/canvasGrid';
import { Canvas as FabricCanvas } from 'fabric';
import { vi } from 'vitest';

// Mock fabric
vi.mock('fabric', () => {
  return {
    Canvas: vi.fn().mockImplementation(() => ({
      add: vi.fn(),
      remove: vi.fn(),
      getObjects: vi.fn().mockReturnValue([]),
      renderAll: vi.fn(),
      requestRenderAll: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
      width: 800,
      height: 600,
      sendToBack: vi.fn()
    })),
    Line: vi.fn().mockImplementation((points, options) => ({
      type: 'line',
      points,
      ...options,
      set: vi.fn(),
      setCoords: vi.fn()
    }))
  };
});

describe('Grid Regression Tests', () => {
  let mockCanvas: FabricCanvas;
  
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Create fresh mock canvas
    mockCanvas = new FabricCanvas(null as any);
    mockCanvas.width = 800;
    mockCanvas.height = 600;
  });
  
  it('should create grid objects successfully', () => {
    const gridObjects = createGrid(mockCanvas);
    
    // Grid objects should be created
    expect(gridObjects.length).toBeGreaterThan(0);
    
    // Canvas.add should be called for each grid object
    expect(mockCanvas.add).toHaveBeenCalled();
    
    // SendToBack should be called to position grid properly
    expect(mockCanvas.sendToBack).toHaveBeenCalled();
  });
  
  it('should handle canvas with invalid dimensions', () => {
    // Set invalid dimensions
    (mockCanvas as any).width = 0;
    (mockCanvas as any).height = 0;
    
    // This should not throw an error
    const gridObjects = createGrid(mockCanvas);
    
    // Should return an empty array
    expect(gridObjects).toEqual([]);
  });
  
  it('should create a grid with major and minor lines', () => {
    const gridObjects = createGrid(mockCanvas, {
      showMajorLines: true,
      majorInterval: 5
    });
    
    // Grid objects should be created
    expect(gridObjects.length).toBeGreaterThan(0);
    
    // Canvas.add should be called for each grid object
    expect(mockCanvas.add).toHaveBeenCalled();
  });
});
