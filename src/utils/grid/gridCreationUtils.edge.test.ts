
/**
 * Edge case tests for grid creation utilities
 * Tests boundary conditions, error handling, and performance optimizations
 * 
 * @module utils/grid/gridCreationUtils.edge
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Canvas, Object as FabricObject } from 'fabric';
import { 
  createBasicEmergencyGrid, 
  validateGrid,
  verifyGridExists,
  ensureGrid,
  retryWithBackoff
} from './gridCreationUtils';
import { MockCanvas } from '@/utils/test/createMockCanvas';

// Mock timeout for faster tests
vi.useFakeTimers();

describe('Grid Creation Utils Edge Cases', () => {
  let canvas: MockCanvas;
  let gridLayerRef: { current: FabricObject[] };
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Create mock canvas with minimal implementation
    canvas = {
      width: 800,
      height: 600,
      add: vi.fn(),
      sendToBack: vi.fn(),
      getObjects: vi.fn().mockReturnValue([]),
      contains: vi.fn().mockReturnValue(true),
      remove: vi.fn(),
      requestRenderAll: vi.fn()
    } as MockCanvas;
    
    gridLayerRef = { current: [] };
  });

  it('should handle canvas with zero dimensions', () => {
    // Setup canvas with zero dimensions
    canvas.width = 0;
    canvas.height = 0;
    
    // Should still create at least some kind of grid without errors
    const gridObjects = createBasicEmergencyGrid(canvas as Canvas);
    
    // Even with zero dimensions, we should get some fallback grid
    expect(gridObjects.length).toBeGreaterThan(0);
    expect(canvas.add).toHaveBeenCalled();
  });
  
  it('should handle extremely large canvas dimensions', () => {
    // Setup canvas with extremely large dimensions
    canvas.width = 100000;
    canvas.height = 100000;
    
    // Performance optimization: Should limit the number of grid lines
    const gridObjects = createBasicEmergencyGrid(canvas as Canvas);
    
    // Should have created grid lines, but not an excessive amount
    expect(gridObjects.length).toBeGreaterThan(0);
    expect(gridObjects.length).toBeLessThan(10000); // Arbitrary reasonable limit
  });

  it('should validate grid even with missing objects', () => {
    // Setup a partially valid grid (some objects exist, some don't)
    const partialGridObjects = [
      { id: 'grid1', objectType: 'grid' } as FabricObject,
      null as FabricObject,  // Simulating a missing object
      { id: 'grid3', objectType: 'grid' } as FabricObject
    ];
    
    canvas.contains = vi.fn().mockImplementation((obj) => {
      return obj && obj.id === 'grid1'; // Only first object exists
    });
    
    // Should handle null/missing objects gracefully
    const result = validateGrid(canvas as Canvas, partialGridObjects);
    
    // Should return false because not all grid objects exist
    expect(result).toBe(false);
  });

  it('should retry with exponential backoff on failure', async () => {
    // Mock operation that fails twice, then succeeds
    const mockOperation = vi.fn()
      .mockRejectedValueOnce(new Error('First failure'))
      .mockRejectedValueOnce(new Error('Second failure'))
      .mockResolvedValueOnce('success');
    
    // Start the retry operation with default values
    const retryPromise = retryWithBackoff(mockOperation);
    
    // Fast-forward through the retries
    vi.runAllTimers();
    
    // Await the result
    const result = await retryPromise;
    
    // Should have called the operation multiple times
    expect(mockOperation).toHaveBeenCalledTimes(3);
    
    // Should eventually succeed
    expect(result).toBe('success');
  });

  it('should handle case where grid exists but reference is empty', () => {
    // Setup: Grid exists in canvas but not in ref
    canvas.getObjects = vi.fn().mockReturnValue([
      { objectType: 'grid', id: 'existingGrid1' } as FabricObject,
      { objectType: 'grid', id: 'existingGrid2' } as FabricObject
    ]);
    
    // Empty reference
    gridLayerRef.current = [];
    
    // Should detect existing grid despite empty reference
    const exists = verifyGridExists(canvas as Canvas, gridLayerRef.current);
    
    expect(exists).toBe(true);
  });

  it('should recover gracefully when ensure grid fails', () => {
    // Mock canvas with errors
    canvas.add = vi.fn().mockImplementation(() => {
      throw new Error('Canvas add failed');
    });
    
    // Should not throw despite canvas errors
    const result = ensureGrid(canvas as Canvas, gridLayerRef);
    
    // Should return an empty grid rather than throwing
    expect(Array.isArray(result)).toBe(true);
  });
});
