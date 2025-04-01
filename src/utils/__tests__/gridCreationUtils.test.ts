
/**
 * Tests for grid creation utilities
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createGrid, createBasicEmergencyGrid } from '../grid/gridRenderers';
import { Canvas as FabricCanvas } from 'fabric';

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
    sendObjectToBack: vi.fn()
  } as unknown as FabricCanvas;
};

describe('Grid Creation Utilities', () => {
  let mockCanvas: FabricCanvas;
  
  beforeEach(() => {
    mockCanvas = createMockCanvas();
    vi.clearAllMocks();
  });
  
  it('should create grid with default settings', () => {
    const result = createGrid(mockCanvas);
    
    expect(result.length).toBeGreaterThan(0);
    expect(mockCanvas.add).toHaveBeenCalled();
    expect(mockCanvas.sendObjectToBack).toHaveBeenCalled();
  });
  
  it('should not create grid for invalid canvas', () => {
    const invalidCanvas = { ...mockCanvas, width: 0, height: 0 } as FabricCanvas;
    const result = createGrid(invalidCanvas);
    
    expect(result.length).toBe(0);
    expect(invalidCanvas.add).not.toHaveBeenCalled();
  });
  
  it('should create emergency grid when needed', () => {
    const result = createBasicEmergencyGrid(mockCanvas);
    
    expect(result.length).toBeGreaterThan(0);
    expect(mockCanvas.add).toHaveBeenCalled();
  });
  
  it('should remove existing grid before creating new one', () => {
    // Setup mock with existing grid objects
    const existingGridObjects = [
      { objectType: 'grid' },
      { objectType: 'grid' }
    ];
    
    mockCanvas.getObjects = vi.fn().mockReturnValue(existingGridObjects);
    
    createGrid(mockCanvas);
    
    // Check that remove was called for each existing grid object
    expect(mockCanvas.remove).toHaveBeenCalledTimes(existingGridObjects.length);
  });
});
