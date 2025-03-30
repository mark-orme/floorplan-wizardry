
import { describe, it, expect, vi } from 'vitest';
import { Canvas, Object as FabricObject } from 'fabric';
import { 
  verifyGridExists,
  ensureGrid,
  retryWithBackoff,
  reorderGridObjects
} from './gridCreationUtils';

describe('gridCreationUtils', () => {
  describe('verifyGridExists', () => {
    it('should return false when canvas is null', () => {
      // @ts-ignore - We're intentionally passing null for testing
      const result = verifyGridExists(null, []);
      expect(result).toBe(false);
    });
    
    it('should return false when grid objects array is empty', () => {
      const canvas = new Canvas(null);
      const result = verifyGridExists(canvas, []);
      expect(result).toBe(false);
    });
    
    it('should return false when grid objects are not on canvas', () => {
      const canvas = new Canvas(null);
      
      // Mock canvas.getObjects to return empty array
      canvas.getObjects = vi.fn().mockReturnValue([]);
      
      const gridObjects = [{ objectType: 'grid' } as unknown as FabricObject];
      const result = verifyGridExists(canvas, gridObjects);
      expect(result).toBe(false);
      expect(canvas.getObjects).toHaveBeenCalled();
    });
    
    it('should return true when grid objects are on canvas', () => {
      const canvas = new Canvas(null);
      
      // Mock canvas.getObjects to return objects with objectType='grid'
      canvas.getObjects = vi.fn().mockReturnValue([
        { objectType: 'grid' } as unknown as FabricObject
      ]);
      
      const gridObjects = [{ objectType: 'grid' } as unknown as FabricObject];
      const result = verifyGridExists(canvas, gridObjects);
      expect(result).toBe(true);
      expect(canvas.getObjects).toHaveBeenCalled();
    });
  });
  
  describe('ensureGrid', () => {
    it('should do nothing if grid already exists', () => {
      const canvas = new Canvas(null);
      const gridObjects = [{ objectType: 'grid' } as unknown as FabricObject];
      
      // Mock verifyGridExists to return true
      vi.spyOn({ verifyGridExists }, 'verifyGridExists').mockReturnValue(true);
      
      // Mock createGrid
      const createGrid = vi.fn().mockReturnValue(gridObjects);
      
      ensureGrid(canvas, createGrid, gridObjects);
      expect(createGrid).not.toHaveBeenCalled();
    });
    
    it('should create grid if it does not exist', () => {
      const canvas = new Canvas(null);
      const gridObjects: FabricObject[] = [];
      
      // Mock verifyGridExists to return false
      vi.spyOn({ verifyGridExists }, 'verifyGridExists').mockReturnValue(false);
      
      // Mock createGrid
      const newGridObjects = [{ objectType: 'grid' } as unknown as FabricObject];
      const createGrid = vi.fn().mockReturnValue(newGridObjects);
      
      ensureGrid(canvas, createGrid, gridObjects);
      expect(createGrid).toHaveBeenCalledWith(canvas, gridObjects);
    });
  });
  
  describe('retryWithBackoff', () => {
    it('should retry the function until success', async () => {
      const mockFn = vi.fn();
      let attempts = 0;
      
      mockFn.mockImplementation(() => {
        attempts++;
        if (attempts < 3) {
          throw new Error('Test error');
        }
        return 'success';
      });
      
      const result = await retryWithBackoff(mockFn, 3, 10);
      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledTimes(3);
    });
    
    it('should throw after max retries', async () => {
      const mockFn = vi.fn().mockRejectedValue(new Error('Test error'));
      
      await expect(retryWithBackoff(mockFn, 3, 10)).rejects.toThrow('Test error');
      expect(mockFn).toHaveBeenCalledTimes(3);
    });
  });
});
