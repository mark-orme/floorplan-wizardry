
/**
 * Unit tests for grid snapping utilities
 * @module tests/grid/snapping
 */
import { describe, it, expect } from "vitest";
import { 
  snapToGrid, 
  snapWithThreshold,
  snapLineToStandardAngles,
  getNearestGridIntersection,
  distanceToNearestGridLine
} from "@/utils/grid/snapping";
import { GRID_SPACING } from "@/utils/drawing";

describe("Grid Snapping Utilities", () => {
  describe("snapToGrid", () => {
    it("should snap points to the nearest grid intersection", () => {
      // Test basic snapping
      expect(snapToGrid({ x: 23, y: 19 })).toEqual({ x: 20, y: 20 });
      expect(snapToGrid({ x: 17, y: 22 })).toEqual({ x: 20, y: 20 });
      
      // Test with custom grid size
      expect(snapToGrid({ x: 23, y: 19 }, 10)).toEqual({ x: 20, y: 20 });
      expect(snapToGrid({ x: 46, y: 42 }, 10)).toEqual({ x: 50, y: 40 });
    });
    
    it("should handle edge cases gracefully", () => {
      // Test with undefined/null handling
      expect(snapToGrid({ x: 0, y: 0 })).toEqual({ x: 0, y: 0 });
      
      // Test with negative coordinates
      expect(snapToGrid({ x: -23, y: -19 })).toEqual({ x: -20, y: -20 });
      
      // Test exactly on grid point
      expect(snapToGrid({ x: 20, y: 20 })).toEqual({ x: 20, y: 20 });
    });
  });
  
  describe("snapWithThreshold", () => {
    it("should only snap when within threshold", () => {
      // Should snap (within threshold)
      expect(snapWithThreshold({ x: 22, y: 21 }, 10, 0.5)).toEqual({ x: 20, y: 20 });
      
      // Should not snap (beyond threshold)
      expect(snapWithThreshold({ x: 24, y: 24 }, 10, 0.3)).toEqual({ x: 24, y: 24 });
    });
    
    it("should respect different threshold values", () => {
      // Higher threshold = more snapping
      expect(snapWithThreshold({ x: 24, y: 24 }, 10, 0.8)).toEqual({ x: 20, y: 20 });
      
      // Lower threshold = less snapping
      expect(snapWithThreshold({ x: 22, y: 22 }, 10, 0.1)).toEqual({ x: 22, y: 22 });
    });
  });
  
  describe("snapLineToStandardAngles", () => {
    it("should straighten lines to standard angles", () => {
      const start = { x: 100, y: 100 };
      
      // Almost horizontal
      expect(snapLineToStandardAngles(
        start, 
        { x: 200, y: 105 }
      )).toEqual({ x: 200, y: 100 });
      
      // Almost 45 degrees
      expect(snapLineToStandardAngles(
        start, 
        { x: 200, y: 195 }
      )).toEqual({ x: 200, y: 200 });
    });
    
    it("should honor custom angles", () => {
      const start = { x: 100, y: 100 };
      
      // Only allow horizontal/vertical (0, 90, 180, 270)
      expect(snapLineToStandardAngles(
        start,
        { x: 150, y: 150 },
        [0, 90, 180, 270]
      )).toEqual({ x: 150, y: 100 }); // Should snap to horizontal
    });
  });
  
  describe("getNearestGridIntersection", () => {
    it("should find the closest grid intersection", () => {
      expect(getNearestGridIntersection({ x: 23, y: 19 })).toEqual({ x: 20, y: 20 });
      expect(getNearestGridIntersection({ x: 46, y: 42 }, 10)).toEqual({ x: 50, y: 40 });
    });
  });
  
  describe("distanceToNearestGridLine", () => {
    it("should calculate correct distances to grid lines", () => {
      // Point at (15, 25) with grid size 10:
      // - Distance to horizontal lines: min(5, 5) = 5
      // - Distance to vertical lines: min(5, 5) = 5
      expect(distanceToNearestGridLine({ x: 15, y: 25 }, 10)).toEqual({ x: 5, y: 5 });
      
      // Point at (12, 18) with grid size 10:
      // - Distance to horizontal lines: min(2, 8) = 2
      // - Distance to vertical lines: min(2, 8) = 2
      expect(distanceToNearestGridLine({ x: 12, y: 18 }, 10)).toEqual({ x: 2, y: 2 });
    });
  });
});
