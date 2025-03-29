
import { describe, it, expect, vi } from 'vitest';
import { Canvas, Object as FabricObject } from 'fabric';
import { 
  validateGrid, 
  createCompleteGrid,
  ensureGrid,
  verifyGridExists,
  retryWithBackoff,
  reorderGridObjects
} from '../gridCreationUtils';

describe('gridCreationUtils', () => {
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
  
  describe('retryWithBackoff', () => {
    it('should return the result when operation succeeds on first try', async () => {
      const operation = vi.fn().mockResolvedValue('success');
      const result = await retryWithBackoff(operation);
      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(1);
    });
    
    it('should retry the operation when it fails', async () => {
      // Mock a function that fails once then succeeds
      const operation = vi.fn()
        .mockRejectedValueOnce(new Error('Fail'))
        .mockResolvedValueOnce('success');
      
      // Mock setTimeout to execute immediately
      vi.spyOn(global, 'setTimeout').mockImplementation((callback) => {
        callback();
        return 0 as any;
      });
      
      const result = await retryWithBackoff(operation, 2);
      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(2);
    });
    
    it('should throw after maximum retries', async () => {
      // Mock a function that always fails
      const operation = vi.fn().mockRejectedValue(new Error('Always fail'));
      
      // Mock setTimeout to execute immediately
      vi.spyOn(global, 'setTimeout').mockImplementation((callback) => {
        callback();
        return 0 as any;
      });
      
      await expect(retryWithBackoff(operation, 3)).rejects.toThrow('Always fail');
      expect(operation).toHaveBeenCalledTimes(3);
    });
  });
  
  // Additional tests for other functions
});
