
import { describe, it, expect, vi } from 'vitest';
import { Canvas, Object as FabricObject } from 'fabric';
import { 
  verifyGridExists,
  ensureGrid,
  retryWithBackoff,
  reorderGridObjects,
  createBasicEmergencyGrid
} from './gridCreationUtils';
import { useRef } from 'react';

describe('gridCreationUtils', () => {
  describe('verifyGridExists', () => {
    it('should return false when canvas is null', () => {
      // Create a mock ref object for testing
      const gridRef = { current: [] };
      
      // @ts-ignore - We're intentionally passing null for testing
      const result = verifyGridExists(null, gridRef);
      expect(result).toBe(false);
    });
    
    it('should return false when grid objects array is empty', () => {
      const canvas = new Canvas(null);
      // Create a mock ref object for testing
      const gridRef = { current: [] };
      
      const result = verifyGridExists(canvas, gridRef);
      expect(result).toBe(false);
    });
    
    it('should return false when grid objects are not on canvas', () => {
      const canvas = new Canvas(null);
      
      // Mock canvas.getObjects to return empty array
      canvas.getObjects = vi.fn().mockReturnValue([]);
      
      // Create a mock ref object for testing
      const gridRef = { current: [{ objectType: 'grid' } as unknown as FabricObject] };
      const result = verifyGridExists(canvas, gridRef);
      expect(result).toBe(false);
      expect(canvas.getObjects).toHaveBeenCalled();
    });
    
    it('should return true when grid objects are on canvas', () => {
      const canvas = new Canvas(null);
      
      // Mock canvas.getObjects to return objects with objectType='grid'
      canvas.getObjects = vi.fn().mockReturnValue([
        { objectType: 'grid' } as unknown as FabricObject
      ]);
      
      // Create a mock ref object for testing
      const gridRef = { current: [{ objectType: 'grid' } as unknown as FabricObject] };
      const result = verifyGridExists(canvas, gridRef);
      expect(result).toBe(true);
      expect(canvas.getObjects).toHaveBeenCalled();
    });
  });
  
  describe('ensureGrid', () => {
    it('should do nothing if grid already exists', () => {
      const canvas = new Canvas(null);
      // Create a mock ref object for testing
      const gridRef = { current: [{ objectType: 'grid' } as unknown as FabricObject] };
      
      // Mock verifyGridExists to return true
      vi.spyOn({ verifyGridExists }, 'verifyGridExists').mockReturnValue(true);
      
      // Mock createGrid
      const createGrid = vi.fn().mockReturnValue(gridRef.current);
      
      // Fixed: removed the third argument that was causing the error
      ensureGrid(canvas, gridRef, createGrid);
      expect(createGrid).not.toHaveBeenCalled();
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
