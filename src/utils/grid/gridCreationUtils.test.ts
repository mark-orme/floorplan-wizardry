
import { describe, it, expect, vi } from 'vitest';
import { Canvas, Object as FabricObject } from 'fabric';
import { 
  verifyGridExists,
  ensureGrid,
  retryWithBackoff,
  reorderGridObjects
} from '../gridCreationUtils';

describe('gridCreationUtils', () => {
  describe('verifyGridExists', () => {
    it('should return false when canvas is null', () => {
      // @ts-ignore - We're intentionally passing null for testing
      const result = verifyGridExists(null);
      expect(result).toBe(false);
    });
    
    it('should return false when grid objects array is empty', () => {
      const canvas = new Canvas(null);
      
      // Mock canvas.getObjects to return empty array
      canvas.getObjects = vi.fn().mockReturnValue([]);
      
      const result = verifyGridExists(canvas);
      expect(result).toBe(false);
      expect(canvas.getObjects).toHaveBeenCalled();
    });
    
    it('should return false when grid objects are not on canvas', () => {
      const canvas = new Canvas(null);
      
      // Mock canvas.getObjects to return empty array
      canvas.getObjects = vi.fn().mockReturnValue([]);
      
      const result = verifyGridExists(canvas);
      expect(result).toBe(false);
      expect(canvas.getObjects).toHaveBeenCalled();
    });
    
    it('should return true when grid objects are on canvas', () => {
      const canvas = new Canvas(null);
      
      // Mock canvas.getObjects to return objects with objectType='grid'
      canvas.getObjects = vi.fn().mockReturnValue([
        { objectType: 'grid' } as unknown as FabricObject
      ]);
      
      const result = verifyGridExists(canvas);
      expect(result).toBe(true);
      expect(canvas.getObjects).toHaveBeenCalled();
    });
  });
  
  // Add more test suites as needed
});
