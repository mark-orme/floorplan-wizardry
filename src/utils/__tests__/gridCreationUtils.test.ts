import { describe, it, expect, vi } from 'vitest';
import { Canvas, Object as FabricObject } from 'fabric';
import { 
  verifyGridExists, 
  createCompleteGrid,
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
      const result = verifyGridExists(canvas);
      expect(result).toBe(false);
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
