/**
 * Grid rendering tests
 * Validates that grid components render correctly under various conditions
 * @module tests/grid/gridRendering
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Canvas, Line, Object as FabricObject } from 'fabric';
import { createGridLines, calculateGridDimensions, createCompleteGrid, isGridObject } from '@/utils/gridUtils';
import { renderGridComponents } from '@/utils/gridRenderer';

// Mock fabric canvas and objects
vi.mock('fabric', () => {
  return {
    Canvas: vi.fn().mockImplementation(() => ({
      add: vi.fn(),
      remove: vi.fn(),
      contains: vi.fn().mockReturnValue(true),
      getObjects: vi.fn().mockReturnValue([]),
      sendObjectToBack: vi.fn(),
      bringObjectToFront: vi.fn(),
      sendObjectBackwards: vi.fn(),
      requestRenderAll: vi.fn(),
      dispose: vi.fn(),
      getWidth: vi.fn().mockReturnValue(800),
      getHeight: vi.fn().mockReturnValue(600)
    })),
    Line: vi.fn().mockImplementation(([x1, y1, x2, y2], options) => ({
      type: 'line',
      points: [x1, y1, x2, y2],
      objectType: options?.objectType || null,
      ...options
    })),
    Text: vi.fn().mockImplementation((text, options) => ({
      type: 'text',
      text,
      ...options
    }))
  };
});

describe('Grid Rendering', () => {
  let canvas: Canvas;
  
  beforeEach(() => {
    vi.clearAllMocks();
    canvas = new Canvas('test-canvas');
  });
  
  afterEach(() => {
    vi.resetAllMocks();
  });
  
  it('calculates grid dimensions correctly', () => {
    // Test with default cell size
    const dimensions1 = calculateGridDimensions(800, 600);
    expect(dimensions1).toEqual({
      width: 800,
      height: 600,
      cellSize: 20
    });
    
    // Test with custom cell size
    const dimensions2 = calculateGridDimensions(800, 600, 50);
    expect(dimensions2).toEqual({
      width: 800,
      height: 600,
      cellSize: 50
    });
  });
  
  it('creates correct number of grid lines', () => {
    const addSpy = vi.spyOn(canvas, 'add');
    const dimensions = { width: 100, height: 100, cellSize: 20 };
    
    // Creates lines at 0, 20, 40, 60, 80, 100 for both horizontal and vertical
    // Should create 6 horizontal + 6 vertical = 12 lines total
    const gridObjects = createGridLines(canvas, dimensions);
    
    expect(gridObjects.length).toBe(12);
    expect(addSpy).toHaveBeenCalledTimes(12);
    
    // Verify all created objects are marked as grid type
    gridObjects.forEach(obj => {
      expect(obj.objectType).toBe('grid');
      expect(obj.selectable).toBe(false);
      expect(obj.evented).toBe(false);
    });
  });
  
  it('creates a complete grid with all components', () => {
    const result = createCompleteGrid(canvas, 200, 150, 25);
    
    // Should have objects in the main gridObjects array
    expect(result.gridObjects.length).toBeGreaterThan(0);
    
    // Check that the grid result has the expected properties
    expect(result).toHaveProperty('gridObjects');
    expect(result).toHaveProperty('smallGridLines');
    expect(result).toHaveProperty('largeGridLines');
    expect(result).toHaveProperty('markers');
  });
  
  it('renders grid components with correct structure', () => {
    const width = 100;
    const height = 100;
    
    // Test the renderGridComponents function
    const result = renderGridComponents(canvas, width, height);
    
    // Check that the result contains all expected categories
    expect(result).toHaveProperty('gridObjects');
    expect(result).toHaveProperty('smallGridLines');
    expect(result).toHaveProperty('largeGridLines');
    expect(result).toHaveProperty('markers');
    
    // The combined gridObjects should contain all items from the other arrays
    const totalComponents = 
      result.smallGridLines.length + 
      result.largeGridLines.length + 
      result.markers.length;
      
    expect(result.gridObjects.length).toBeGreaterThanOrEqual(totalComponents);
  });
  
  it('correctly identifies grid objects', () => {
    // Create mock objects
    const gridObject = { objectType: 'grid' } as FabricObject;
    const nonGridObject = { objectType: 'wall' } as FabricObject;
    const noTypeObject = {} as FabricObject;
    
    // Test isGridObject function
    expect(isGridObject(gridObject)).toBe(true);
    expect(isGridObject(nonGridObject)).toBe(false);
    expect(isGridObject(noTypeObject)).toBe(false);
  });
});
