
/**
 * Unit tests for grid utility functions
 * @module grid/__tests__/gridUtils
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  calculateGridDimensions, 
  createGridLines, 
  createCompleteGrid,
  hasExistingGrid,
  removeGrid,
  setGridVisibility,
  isGridObject,
  filterGridObjects,
  getNearestGridPoint
} from '../../gridUtils';
import { Canvas, Object as FabricObject, Line } from 'fabric';

// Mock Fabric.js classes
vi.mock('fabric', () => {
  const MockLine = vi.fn().mockImplementation((points, options) => ({
    ...options,
    points,
    objectType: options?.objectType,
    visible: true
  }));
  
  const MockCanvas = vi.fn().mockImplementation(() => ({
    add: vi.fn(),
    remove: vi.fn(),
    contains: vi.fn().mockReturnValue(true),
    getObjects: vi.fn().mockReturnValue([]),
    requestRenderAll: vi.fn()
  }));
  
  return {
    Canvas: MockCanvas,
    Line: MockLine,
    Object: {
      prototype: {}
    }
  };
});

describe('gridUtils', () => {
  let canvas: Canvas;
  
  beforeEach(() => {
    vi.clearAllMocks();
    canvas = new Canvas();
  });
  
  describe('calculateGridDimensions', () => {
    it('should calculate correct grid dimensions', () => {
      const result = calculateGridDimensions(800, 600, 20);
      
      expect(result).toEqual({
        width: 800,
        height: 600,
        cellSize: 20
      });
    });
    
    it('should use default cell size when not provided', () => {
      const result = calculateGridDimensions(800, 600);
      
      expect(result.cellSize).toBe(20);
    });
  });
  
  describe('createGridLines', () => {
    it('should create horizontal and vertical grid lines', () => {
      const dimensions = {
        width: 100,
        height: 100,
        cellSize: 50
      };
      
      const result = createGridLines(canvas, dimensions);
      
      // Should create 3 horizontal lines (0, 50, 100) and 3 vertical lines (0, 50, 100)
      expect(result.length).toBe(6);
      
      // Verify canvas.add was called for each line
      expect(canvas.add).toHaveBeenCalledTimes(6);
    });
    
    it('should set the correct properties on grid lines', () => {
      const dimensions = {
        width: 100,
        height: 100,
        cellSize: 100
      };
      
      const result = createGridLines(canvas, dimensions);
      
      // Check one of the created lines
      const line = result[0];
      expect(line).toMatchObject({
        stroke: '#ccc',
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
    });
  });
  
  describe('createCompleteGrid', () => {
    it('should return existing grid if it already exists', () => {
      // Mock hasExistingGrid to return true
      const mockObjects = [{ objectType: 'grid' }];
      (canvas.getObjects as ReturnType<typeof vi.fn>).mockReturnValue(mockObjects);
      
      const result = createCompleteGrid(canvas, 800, 600);
      
      // Should not call add
      expect(canvas.add).not.toHaveBeenCalled();
      
      // Should return filtered grid objects
      expect(result.gridObjects).toEqual(mockObjects);
    });
    
    it('should create a new grid when one does not exist', () => {
      // Mock hasExistingGrid to return false
      (canvas.getObjects as ReturnType<typeof vi.fn>).mockReturnValue([]);
      
      const result = createCompleteGrid(canvas, 200, 150, 10);
      
      // Should have lines
      expect(result.gridObjects.length).toBeGreaterThan(0);
      
      // Should have called requestRenderAll
      expect(canvas.requestRenderAll).toHaveBeenCalledTimes(1);
    });
  });
  
  describe('hasExistingGrid', () => {
    it('should return false when canvas is null', () => {
      const result = hasExistingGrid(null as unknown as Canvas);
      
      expect(result).toBe(false);
    });
    
    it('should return true when grid objects exist', () => {
      // Mock objects with a grid object
      (canvas.getObjects as ReturnType<typeof vi.fn>).mockReturnValue([{ objectType: 'grid' }]);
      
      const result = hasExistingGrid(canvas);
      
      expect(result).toBe(true);
    });
    
    it('should return false when no grid objects exist', () => {
      // Mock objects with no grid objects
      (canvas.getObjects as ReturnType<typeof vi.fn>).mockReturnValue([{ objectType: 'not-grid' }]);
      
      const result = hasExistingGrid(canvas);
      
      expect(result).toBe(false);
    });
  });
  
  describe('removeGrid', () => {
    it('should remove each grid object from canvas', () => {
      // Create mock grid objects
      const gridObjects = [
        { id: 'grid1' },
        { id: 'grid2' }
      ];
      
      removeGrid(canvas, gridObjects as unknown as FabricObject[]);
      
      // Should call remove for each grid object
      expect(canvas.remove).toHaveBeenCalledTimes(2);
      
      // Should call requestRenderAll
      expect(canvas.requestRenderAll).toHaveBeenCalledTimes(1);
    });
  });
  
  describe('getNearestGridPoint', () => {
    it('should snap to the nearest grid point', () => {
      const result = getNearestGridPoint({ x: 23, y: 38 }, 20);
      
      expect(result).toEqual({ x: 20, y: 40 });
    });
    
    it('should handle null points', () => {
      const result = getNearestGridPoint(null as any, 20);
      
      expect(result).toEqual({ x: 0, y: 0 });
    });
  });
});
