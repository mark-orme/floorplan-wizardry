import { describe, it, expect, vi } from 'vitest';
import { Canvas, Object as FabricObject } from 'fabric';
import { 
  validateGrid,
  ensureGrid,
  verifyGridExists,
  retryWithBackoff,
  reorderGridObjects
} from '../gridCreationUtils';

describe('gridCreationUtils', () => {
  // Same tests as in src/utils/__tests__/gridCreationUtils.test.ts
  describe('verifyGridExists', () => {
    it('should return false when canvas is null', () => {
      const gridLayerRef = { current: [] };
      const result = verifyGridExists(null, gridLayerRef);
      expect(result).toBe(false);
    });
    
    it('should return false when grid objects array is empty', () => {
      const canvas = new Canvas(null);
      const gridLayerRef = { current: [] };
      const result = verifyGridExists(canvas, gridLayerRef);
      expect(result).toBe(false);
    });
    
    it('should return false when grid objects are not on canvas', () => {
      const canvas = new Canvas(null);
      const mockObjects = [{ id: 'grid1' }, { id: 'grid2' }] as unknown as FabricObject[];
      const gridLayerRef = { current: mockObjects };
      
      // Mock canvas.contains to return false
      canvas.contains = vi.fn().mockReturnValue(false);
      
      const result = verifyGridExists(canvas, gridLayerRef);
      expect(result).toBe(false);
      expect(canvas.contains).toHaveBeenCalled();
    });
    
    it('should return true when grid objects are on canvas', () => {
      const canvas = new Canvas(null);
      const mockObjects = [{ id: 'grid1' }, { id: 'grid2' }] as unknown as FabricObject[];
      const gridLayerRef = { current: mockObjects };
      
      // Mock canvas.contains to return true
      canvas.contains = vi.fn().mockReturnValue(true);
      
      const result = verifyGridExists(canvas, gridLayerRef);
      expect(result).toBe(true);
      expect(canvas.contains).toHaveBeenCalled();
    });
  });
  
  // Add more test suites as needed
});
