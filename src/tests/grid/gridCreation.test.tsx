
/**
 * Tests for grid creation functionality
 * These tests ensure grid is created correctly and fixes issues with grid disappearing
 */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { createGrid, GridOptions } from '@/utils/canvasGrid';
import { Canvas, Object as FabricObject } from 'fabric';
import { createMockCanvas } from '@/tests/utils/canvasTestUtils';

describe('Grid Creation', () => {
  let mockCanvas: Canvas;
  
  beforeEach(() => {
    // Create a fresh mock canvas for each test
    mockCanvas = createMockCanvas() as unknown as Canvas;
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    vi.resetAllMocks();
  });
  
  it('should create a grid with default options', () => {
    // Call the function
    const gridObjects = createGrid(mockCanvas);
    
    // Verify grid was created
    expect(gridObjects.length).toBeGreaterThan(0);
    expect(mockCanvas.add).toHaveBeenCalled();
    
    // Check if all objects have grid properties
    gridObjects.forEach(obj => {
      expect(obj).toHaveProperty('objectType', 'grid');
      expect(obj).toHaveProperty('selectable', false);
      expect(obj).toHaveProperty('evented', false);
    });
  });
  
  it('should create a grid with custom options', () => {
    // Define custom grid options
    const options: GridOptions = {
      // Fixed: Replaced 'size' with appropriate property names from GridOptions
      gridSize: 30,
      stroke: '#ff0000',
      strokeWidth: 2,
      showMajorLines: true,
      majorStroke: '#0000ff',
      majorStrokeWidth: 3,
      majorInterval: 3
    };
    
    // Call the function with custom options
    const gridObjects = createGrid(mockCanvas, options);
    
    // Verify grid was created
    expect(gridObjects.length).toBeGreaterThan(0);
    expect(mockCanvas.add).toHaveBeenCalled();
    
    // Check if objects have correct properties
    // Number of calls to add should match the number of grid objects
    expect(mockCanvas.add).toHaveBeenCalledTimes(gridObjects.length);
  });
  
  it('should remove existing grid objects before creating new ones', () => {
    // Setup existing grid objects
    const existingGridObjects = [
      { objectType: 'grid', id: 'existing-1' },
      { objectType: 'grid', id: 'existing-2' }
    ];
    
    // Mock getObjects to return existing grid objects
    mockCanvas.getObjects = vi.fn().mockReturnValue(existingGridObjects);
    
    // Call the function
    createGrid(mockCanvas);
    
    // Verify existing grid objects were removed
    expect(mockCanvas.remove).toHaveBeenCalledTimes(existingGridObjects.length);
  });
  
  it('should handle canvas with zero dimensions gracefully', () => {
    // Create a canvas with zero dimensions
    const zeroCanvas = {
      ...mockCanvas,
      width: 0,
      height: 0
    } as unknown as Canvas;
    
    // Call the function
    const result = createGrid(zeroCanvas);
    
    // Should return empty array
    expect(result).toEqual([]);
  });
  
  it('should send grid objects to back of canvas', () => {
    // Call the function
    const gridObjects = createGrid(mockCanvas);
    
    // Verify sendToBack was called for each grid object
    gridObjects.forEach(() => {
      expect(mockCanvas.sendToBack).toHaveBeenCalled();
    });
  });
});
