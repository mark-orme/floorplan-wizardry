
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createGrid, clearGrid, toggleGridVisibility } from '../gridUtils';
import { Line, Canvas } from 'fabric';
import { MockCanvas } from '@/utils/test/createMockCanvas';
import { GridConfig, GridObjects } from '../gridTypes';
import { FabricObject } from '@/types/fabric';

describe('Grid Utils', () => {
  let mockCanvas: MockCanvas;
  
  beforeEach(() => {
    mockCanvas = {
      add: vi.fn(),
      remove: vi.fn(),
      getObjects: vi.fn().mockReturnValue([]),
      renderAll: vi.fn(),
      requestRenderAll: vi.fn()
    } as MockCanvas;
  });
  
  describe('createGrid', () => {
    it('should create grid lines with default settings', () => {
      const gridObjects = createGrid(mockCanvas as Canvas, {
        gridSize: 20,
        color: '#cccccc'
      });
      
      expect(gridObjects).toBeDefined();
      expect(gridObjects.length).toBeGreaterThan(0);
      expect(mockCanvas.add).toHaveBeenCalled();
    });
    
    it('should create grid lines with custom settings', () => {
      const config: GridConfig = {
        gridSize: 50,
        color: '#ff0000',
        opacity: 0.8,
        showGrid: true
      };
      
      const gridObjects = createGrid(mockCanvas as Canvas, config);
      
      expect(gridObjects).toBeDefined();
      expect(gridObjects.length).toBeGreaterThan(0);
      expect(mockCanvas.add).toHaveBeenCalled();
    });
    
    it('should not create grid if showGrid is false', () => {
      const config: GridConfig = {
        gridSize: 20,
        color: '#cccccc',
        showGrid: false
      };
      
      const gridObjects = createGrid(mockCanvas as Canvas, config);
      
      expect(gridObjects.length).toBe(0);
      expect(mockCanvas.add).not.toHaveBeenCalled();
    });
  });
  
  describe('clearGrid', () => {
    it('should remove grid objects from canvas', () => {
      // Setup mock grid objects
      const mockGridObjects: GridObjects = [
        { id: 'grid-1', gridType: 'small' } as FabricObject,
        { id: 'grid-2', gridType: 'large' } as FabricObject
      ];
      
      // Call clearGrid
      clearGrid(mockCanvas as Canvas, mockGridObjects);
      
      // Verify all grid objects were removed
      expect(mockCanvas.remove).toHaveBeenCalledTimes(mockGridObjects.length);
    });
    
    it('should handle empty grid objects array', () => {
      const emptyGridObjects: GridObjects = [];
      
      clearGrid(mockCanvas as Canvas, emptyGridObjects);
      
      expect(mockCanvas.remove).not.toHaveBeenCalled();
    });
  });
  
  describe('toggleGridVisibility', () => {
    it('should toggle grid visibility', () => {
      // Setup mock grid objects with visible property
      const mockGridObjects: GridObjects = [
        { id: 'grid-1', gridType: 'small', visible: true, set: vi.fn() } as FabricObject,
        { id: 'grid-2', gridType: 'large', visible: true, set: vi.fn() } as FabricObject
      ];
      
      // Toggle visibility to false
      toggleGridVisibility(mockCanvas as Canvas, mockGridObjects, false);
      
      // Verify visibility was set to false for all objects
      mockGridObjects.forEach(obj => {
        expect(obj.set).toHaveBeenCalledWith('visible', false);
      });
      expect(mockCanvas.requestRenderAll).toHaveBeenCalled();
    });
  });
});
