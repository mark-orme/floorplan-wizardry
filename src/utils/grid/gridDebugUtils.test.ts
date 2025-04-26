
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { dumpGridState, analyzeGridIssues } from './gridDebugUtils';
import { Canvas, Object as FabricObject } from 'fabric';
import { MockCanvas } from '@/utils/test/createMockCanvas';

describe('gridDebugUtils', () => {
  let mockCanvas: MockCanvas;
  let consoleSpy: ReturnType<typeof vi.spyOn>;
  
  beforeEach(() => {
    // Setup mock canvas
    mockCanvas = {
      width: 800,
      height: 600,
      getObjects: vi.fn().mockReturnValue([]),
      getZoom: vi.fn().mockReturnValue(1),
      toJSON: vi.fn().mockReturnValue({ objects: [] })
    } as MockCanvas;
    
    // Spy on console.log
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });
  
  afterEach(() => {
    consoleSpy.mockRestore();
  });
  
  describe('dumpGridState', () => {
    it('should log grid state information', () => {
      // Setup mock grid objects
      const mockGridObjects = [
        { objectType: 'grid', visible: true, left: 10, top: 10 },
        { objectType: 'grid', visible: false, left: 20, top: 20 }
      ];
      
      mockCanvas.getObjects.mockReturnValue(mockGridObjects as unknown as FabricObject[]);
      
      // Call dumpGridState
      dumpGridState(mockCanvas as Canvas);
      
      // Verify console logs
      expect(consoleSpy).toHaveBeenCalledWith('---- GRID STATE DUMP ----');
      expect(consoleSpy).toHaveBeenCalledWith('Total canvas objects: 2');
      expect(consoleSpy).toHaveBeenCalledWith('Grid objects: 2');
    });
    
    it('should handle null canvas', () => {
      // Call with null canvas
      dumpGridState(null as unknown as Canvas);
      
      // Verify error log
      expect(consoleSpy).toHaveBeenCalledWith('Cannot dump grid state: Canvas is null');
    });
  });
  
  describe('analyzeGridIssues', () => {
    it('should report no issues for valid grid', () => {
      // Setup valid grid objects
      const gridObjects = [
        { visible: true },
        { visible: true }
      ] as FabricObject[];
      
      mockCanvas.getObjects.mockReturnValue(gridObjects);
      
      // Call analyze function
      const result = analyzeGridIssues(mockCanvas as Canvas, gridObjects);
      
      // Verify result
      expect(result.hasIssues).toBe(false);
      expect(result.issues.length).toBe(0);
    });
    
    it('should report issues for invalid canvas dimensions', () => {
      // Setup invalid canvas dimensions
      mockCanvas.width = 0;
      mockCanvas.height = 0;
      
      // Call analyze function
      const result = analyzeGridIssues(mockCanvas as Canvas, []);
      
      // Verify result
      expect(result.hasIssues).toBe(true);
      expect(result.issues).toContain('Canvas has invalid dimensions');
      expect(result.issues).toContain('No grid objects found');
    });
    
    it('should report issues for invisible grid objects', () => {
      // Setup grid objects with invisibility
      const gridObjects = [
        { visible: false },
        { visible: false }
      ] as FabricObject[];
      
      mockCanvas.getObjects.mockReturnValue(gridObjects);
      
      // Call analyze function
      const result = analyzeGridIssues(mockCanvas as Canvas, gridObjects);
      
      // Verify result
      expect(result.hasIssues).toBe(true);
      expect(result.issues).toContain('2 grid objects are invisible');
    });
  });
});
