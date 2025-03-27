
/**
 * Tests for grid creation utilities
 * @jest-environment jsdom
 */
import { createBasicEmergencyGrid, validateGrid } from '../gridCreationUtils';
import { Canvas as FabricCanvas } from 'fabric';

// Mock Fabric to avoid DOM dependencies in tests
jest.mock('fabric', () => {
  // Create mock classes
  const MockLine = jest.fn().mockImplementation(() => ({
    type: 'line',
    visible: true
  }));
  
  const MockText = jest.fn().mockImplementation(() => ({
    type: 'text',
    visible: true
  }));
  
  // Create mock canvas
  const MockCanvas = jest.fn().mockImplementation(() => ({
    width: 800,
    height: 600,
    add: jest.fn(),
    remove: jest.fn(),
    contains: jest.fn().mockReturnValue(true),
    getObjects: jest.fn().mockReturnValue([]),
    sendObjectToBack: jest.fn(),
    bringObjectToFront: jest.fn(),
    requestRenderAll: jest.fn()
  }));
  
  return {
    Canvas: MockCanvas,
    Line: MockLine,
    Text: MockText
  };
});

// Mock console logs for cleaner test output
console.log = jest.fn();
console.error = jest.fn();

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
    it('should create grid objects and add them to canvas', () => {
      // Call the function
      const result = createBasicEmergencyGrid(canvas, gridLayerRef);
      
      // Verify grid was created
      expect(result.length).toBeGreaterThan(0);
      expect(gridLayerRef.current.length).toBeGreaterThan(0);
      
      // Check that canvas.add was called for each object
      expect(canvas.add).toHaveBeenCalled();
    });
    
    it('should handle errors gracefully', () => {
      // Mock canvas.add to throw an error
      (canvas.add as jest.Mock).mockImplementation(() => {
        throw new Error('Mock error');
      });
      
      // Call the function
      const result = createBasicEmergencyGrid(canvas, gridLayerRef);
      
      // Verify it handled the error and returned empty array
      expect(result).toEqual([]);
    });
  });
  
  describe('validateGrid', () => {
    it('should validate grid correctly when valid', () => {
      // Create mock grid objects
      gridLayerRef.current = [
        { type: 'line', x1: 0, x2: 0, y1: 0, y2: 100 }, // vertical
        { type: 'line', x1: 0, x2: 100, y1: 0, y2: 0 }  // horizontal
      ];
      
      // Mock contains to return true
      (canvas.contains as jest.Mock).mockReturnValue(true);
      
      // Validate the grid
      const isValid = validateGrid(canvas, gridLayerRef);
      
      // Should be valid
      expect(isValid).toBe(true);
    });
    
    it('should return false when no grid exists', () => {
      // Empty grid
      gridLayerRef.current = [];
      
      // Validate the grid
      const isValid = validateGrid(canvas, gridLayerRef);
      
      // Should be invalid
      expect(isValid).toBe(false);
    });
    
    it('should return false when canvas is null', () => {
      // Validate with null canvas
      const isValid = validateGrid(null, gridLayerRef);
      
      // Should be invalid
      expect(isValid).toBe(false);
    });
  });
});
