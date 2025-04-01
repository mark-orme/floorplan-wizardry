
/**
 * Grid Regression Tests
 * 
 * These tests ensure that grid rendering works correctly
 * and doesn't regress with future changes.
 */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { Canvas } from 'fabric';
import { createGrid } from '@/utils/canvasGrid';

// Mock canvas
const createMockCanvas = () => {
  return {
    width: 800,
    height: 600,
    add: vi.fn(),
    remove: vi.fn(),
    getObjects: vi.fn().mockReturnValue([]),
    renderAll: vi.fn(),
    requestRenderAll: vi.fn(),
    contains: vi.fn().mockReturnValue(false),
    sendToBack: vi.fn()
  } as unknown as Canvas;
};

describe('Grid Rendering Regression Tests', () => {
  let mockCanvas: Canvas;
  
  beforeEach(() => {
    mockCanvas = createMockCanvas();
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    vi.resetAllMocks();
  });
  
  it('should create the grid with correct number of lines', () => {
    // Act
    const gridObjects = createGrid(mockCanvas);
    
    // Assert
    expect(gridObjects.length).toBeGreaterThan(0);
    expect(mockCanvas.add).toHaveBeenCalled();
    
    // Calculate expected grid lines
    // Grid lines = horizontal lines + vertical lines
    // For a canvas of 800x600 with a grid size of 20 (default):
    // Horizontal lines: Math.floor(600/20) + 1 = 31
    // Vertical lines: Math.floor(800/20) + 1 = 41
    // Total: 31 + 41 = 72
    const expectedMinimumLines = 70; // Give a small margin for implementation changes
    
    expect(gridObjects.length).toBeGreaterThanOrEqual(expectedMinimumLines);
  });
  
  it('should create grid objects with correct properties', () => {
    // Act
    const gridObjects = createGrid(mockCanvas);
    
    // Assert
    for (const obj of gridObjects) {
      expect(obj).toHaveProperty('objectType', 'grid');
      expect(obj).toHaveProperty('selectable', false);
      expect(obj).toHaveProperty('evented', false);
    }
  });
  
  it('should handle edge case: canvas with zero dimensions', () => {
    // Arrange
    const zeroCanvas = {
      ...mockCanvas,
      width: 0,
      height: 0
    } as unknown as Canvas;
    
    // Act & Assert
    expect(() => createGrid(zeroCanvas)).not.toThrow();
  });
  
  it('should handle edge case: extremely large canvas', () => {
    // Arrange
    const largeCanvas = {
      ...mockCanvas,
      width: 10000,
      height: 8000
    } as unknown as Canvas;
    
    // Act
    const gridObjects = createGrid(largeCanvas);
    
    // Assert
    expect(gridObjects.length).toBeGreaterThan(0);
  });
  
  it('should recreate grid if already exists', () => {
    // Arrange
    const getObjectsMock = vi.fn().mockReturnValue([
      { objectType: 'grid', type: 'line' },
      { objectType: 'grid', type: 'line' }
    ]);
    
    mockCanvas.getObjects = getObjectsMock;
    mockCanvas.contains = vi.fn().mockReturnValue(true);
    
    // Act
    const gridObjects = createGrid(mockCanvas);
    
    // Assert
    expect(mockCanvas.remove).toHaveBeenCalled();
    expect(gridObjects.length).toBeGreaterThan(0);
  });
});
