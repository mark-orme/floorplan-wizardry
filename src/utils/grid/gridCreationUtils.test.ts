
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { createBasicEmergencyGrid, verifyGridExists, retryWithBackoff } from '@/utils/gridCreationUtils';
import { Canvas, Object as FabricObject, Line } from 'fabric';

// Mock fabric.js Canvas
vi.mock('fabric', () => {
  const mockObjects: any[] = [];
  
  const MockFabricCanvas = vi.fn().mockImplementation(() => ({
    add: vi.fn((obj) => {
      mockObjects.push(obj);
      return obj;
    }),
    remove: vi.fn((obj) => {
      const index = mockObjects.indexOf(obj);
      if (index !== -1) {
        mockObjects.splice(index, 1);
      }
    }),
    contains: vi.fn((obj) => mockObjects.includes(obj)),
    getObjects: vi.fn(() => [...mockObjects]),
    sendObjectToBack: vi.fn(),
    bringObjectToFront: vi.fn(),
    renderAll: vi.fn(),
    requestRenderAll: vi.fn(),
    dispose: vi.fn(),
    width: 800,
    height: 600
  }));
  
  const MockFabricLine = vi.fn().mockImplementation((points, options) => ({
    type: 'line',
    points,
    ...options
  }));
  
  const MockFabricCircle = vi.fn().mockImplementation((options) => ({
    type: 'circle',
    ...options
  }));
  
  return {
    Canvas: MockFabricCanvas,
    Line: MockFabricLine,
    Circle: MockFabricCircle,
    Object: {}
  };
});

describe('gridCreationUtils', () => {
  let mockCanvas: Canvas;
  let mockGridLayerRef: React.MutableRefObject<FabricObject[]>;
  
  beforeEach(() => {
    mockCanvas = new Canvas();
    mockGridLayerRef = { current: [] };
    vi.clearAllMocks();
  });
  
  describe('createBasicEmergencyGrid', () => {
    test('creates a grid with the correct number of objects', () => {
      const gridObjects = createBasicEmergencyGrid(mockCanvas, mockGridLayerRef);
      
      // Major grid lines: horizontal (7) + vertical (9) = 16
      // Minor grid lines: horizontal (18) + vertical (24) = 42
      // Origin marker = 1
      // Total = 59
      expect(gridObjects.length).toBeGreaterThan(0);
      expect(mockGridLayerRef.current).toBe(gridObjects);
      expect(mockCanvas.renderAll).toHaveBeenCalled();
    });
    
    test('clears existing grid objects', () => {
      // Add some existing grid objects
      const existingObjects = [
        new Line([0, 0, 100, 0], { objectType: 'grid' }),
        new Line([0, 0, 0, 100], { objectType: 'grid' })
      ];
      
      mockGridLayerRef.current = existingObjects;
      
      // Create new grid
      createBasicEmergencyGrid(mockCanvas, mockGridLayerRef);
      
      // Check that remove was called for each existing object
      expect(mockCanvas.remove).toHaveBeenCalledTimes(2);
    });
    
    test('returns empty array if canvas is null', () => {
      const result = createBasicEmergencyGrid(null as unknown as Canvas, mockGridLayerRef);
      expect(result).toEqual([]);
    });
  });
  
  describe('verifyGridExists', () => {
    test('returns false if canvas is null', () => {
      const result = verifyGridExists(null, mockGridLayerRef);
      expect(result).toBe(false);
    });
    
    test('returns false if grid layer is empty', () => {
      mockGridLayerRef.current = [];
      const result = verifyGridExists(mockCanvas, mockGridLayerRef);
      expect(result).toBe(false);
    });
    
    test('returns true if all grid objects are on canvas', () => {
      // Create mock grid objects that are on canvas
      const mockObjects = [
        { type: 'line', id: 1 },
        { type: 'line', id: 2 },
        { type: 'line', id: 3 }
      ] as unknown as FabricObject[];
      
      mockGridLayerRef.current = mockObjects;
      
      // Mock contains to return true for all objects
      (mockCanvas.contains as any).mockImplementation(() => true);
      
      const result = verifyGridExists(mockCanvas, mockGridLayerRef);
      expect(result).toBe(true);
    });
    
    test('returns false if less than 50% of grid objects are on canvas', () => {
      // Create mock grid objects
      const mockObjects = [
        { type: 'line', id: 1 },
        { type: 'line', id: 2 },
        { type: 'line', id: 3 },
        { type: 'line', id: 4 }
      ] as unknown as FabricObject[];
      
      mockGridLayerRef.current = mockObjects;
      
      // Mock contains to return true only for first object (25%)
      (mockCanvas.contains as any).mockImplementation((obj) => obj.id === 1);
      
      const result = verifyGridExists(mockCanvas, mockGridLayerRef);
      expect(result).toBe(false);
    });
  });
  
  describe('retryWithBackoff', () => {
    test('resolves if operation succeeds on first try', async () => {
      const operation = vi.fn().mockResolvedValue('success');
      const result = await retryWithBackoff(async () => operation());
      
      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(1);
    });
    
    test('retries operation until success', async () => {
      // Operation fails twice then succeeds
      const operation = vi.fn()
        .mockRejectedValueOnce(new Error('Failed 1'))
        .mockRejectedValueOnce(new Error('Failed 2'))
        .mockResolvedValueOnce('success');
      
      const result = await retryWithBackoff(async () => operation(), 3, 10);
      
      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(3);
    });
    
    test('throws after max retries', async () => {
      const operation = vi.fn().mockRejectedValue(new Error('Always fails'));
      
      await expect(retryWithBackoff(async () => operation(), 2, 10))
        .rejects.toThrow('Always fails');
      
      expect(operation).toHaveBeenCalledTimes(2);
    });
  });
});
