
/**
 * Tests for grid creation utilities
 */
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { createBasicEmergencyGrid, validateGrid } from '../gridCreationUtils';
import { Canvas as FabricCanvas } from 'fabric';

// Mock Fabric to avoid DOM dependencies in tests
vi.mock('fabric', () => {
  // Create mock classes
  const MockLine = vi.fn().mockImplementation(() => ({
    type: 'line',
    visible: true
  }));
  
  const MockText = vi.fn().mockImplementation(() => ({
    type: 'text',
    visible: true
  }));
  
  // Create mock canvas
  const MockCanvas = vi.fn().mockImplementation(() => ({
    width: 800,
    height: 600,
    add: vi.fn(),
    remove: vi.fn(),
    contains: vi.fn().mockReturnValue(true),
    getObjects: vi.fn().mockReturnValue([]),
    sendObjectToBack: vi.fn(),
    bringObjectToFront: vi.fn(),
    requestRenderAll: vi.fn()
  }));
  
  return {
    Canvas: MockCanvas,
    Line: MockLine,
    Text: MockText
  };
});

// Mock console logs for cleaner test output
console.log = vi.fn();
console.error = vi.fn();

describe('gridCreationUtils', () => {
  let canvas: FabricCanvas;
  let gridLayerRef: { current: any[] };
  
  beforeEach(() => {
    // Create a mock canvas
    canvas = new FabricCanvas();
    
    // Create a mock grid layer ref
    gridLayerRef = { current: [] };
  });
  
  describe('createBasicEmergencyGrid', () => {
    test('should create grid objects and add them to canvas', () => {
      // Call the function
      const result = createBasicEmergencyGrid(canvas, gridLayerRef);
      
      // Verify grid was created
      expect(result.length).toBeGreaterThan(0);
      expect(gridLayerRef.current.length).toBeGreaterThan(0);
      
      // Check that canvas.add was called for each object
      expect(canvas.add).toHaveBeenCalled();
    });
    
    test('should handle errors gracefully', () => {
      // Mock canvas.add to throw an error
      (canvas.add as any).mockImplementation(() => {
        throw new Error('Mock error');
      });
      
      // Call the function
      const result = createBasicEmergencyGrid(canvas, gridLayerRef);
      
      // Verify it handled the error and returned empty array
      expect(result).toEqual([]);
    });
  });
  
  describe('validateGrid', () => {
    test('should validate grid correctly when valid', () => {
      // Create mock grid objects
      gridLayerRef.current = [
        { type: 'line', x1: 0, x2: 0, y1: 0, y2: 100 }, // vertical
        { type: 'line', x1: 0, x2: 100, y1: 0, y2: 0 }  // horizontal
      ];
      
      // Mock contains to return true
      (canvas.contains as any).mockReturnValue(true);
      
      // Validate the grid
      const isValid = validateGrid(canvas, gridLayerRef);
      
      // Should be valid
      expect(isValid).toBe(true);
    });
    
    test('should return false when no grid exists', () => {
      // Empty grid
      gridLayerRef.current = [];
      
      // Validate the grid
      const isValid = validateGrid(canvas, gridLayerRef);
      
      // Should be invalid
      expect(isValid).toBe(false);
    });
    
    test('should return false when canvas is null', () => {
      // Validate with null canvas
      const isValid = validateGrid(null, gridLayerRef);
      
      // Should be invalid
      expect(isValid).toBe(false);
    });
  });
});
