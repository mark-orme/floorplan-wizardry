
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
import { Point } from "@/types/geometryTypes";
import { STANDARD_ANGLES } from "@/utils/geometry/constants";

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

    it("should correctly snap points with different grid sizes", () => {
      // Test with larger grid size
      expect(snapToGrid({ x: 42, y: 37 }, 20)).toEqual({ x: 40, y: 40 });
      
      // Test with smaller grid size
      expect(snapToGrid({ x: 11, y: 9 }, 5)).toEqual({ x: 10, y: 10 });
      
      // Test with odd grid size
      expect(snapToGrid({ x: 16, y: 14 }, 7)).toEqual({ x: 14, y: 14 });
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

    it("should snap only one dimension if the other exceeds threshold", () => {
      // X is within threshold, Y is not
      expect(snapWithThreshold({ x: 22, y: 27 }, 10, 0.3)).toEqual({ x: 20, y: 27 });
      
      // Y is within threshold, X is not
      expect(snapWithThreshold({ x: 27, y: 22 }, 10, 0.3)).toEqual({ x: 27, y: 20 });
    });
  });
  
  describe("snapLineToStandardAngles", () => {
    it("should straighten lines to standard angles", () => {
      const start: Point = { x: 100, y: 100 };
      
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
      const start: Point = { x: 100, y: 100 };
      
      // Only allow horizontal/vertical (0, 90, 180, 270)
      expect(snapLineToStandardAngles(
        start,
        { x: 150, y: 150 },
        [0, 90, 180, 270]
      )).toEqual({ x: 150, y: 100 }); // Should snap to horizontal
    });

    it("should not modify lines already aligned with standard angles", () => {
      const start: Point = { x: 100, y: 100 };
      
      // Exactly horizontal
      const horizontalEnd: Point = { x: 200, y: 100 };
      expect(snapLineToStandardAngles(start, horizontalEnd)).toEqual(horizontalEnd);
      
      // Exactly 45 degrees
      const diagonalEnd: Point = { x: 200, y: 200 };
      expect(snapLineToStandardAngles(start, diagonalEnd)).toEqual(diagonalEnd);
    });

    it("should preserve point distance while snapping", () => {
      const start: Point = { x: 100, y: 100 };
      
      // Almost vertical but not quite
      const end: Point = { x: 105, y: 200 };
      const snapped = snapLineToStandardAngles(start, end);
      
      // Should snap to vertical (x=100)
      expect(snapped.x).toBe(100);
      
      // But should preserve distance
      const originalDistance = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
      const snappedDistance = Math.sqrt(Math.pow(snapped.x - start.x, 2) + Math.pow(snapped.y - start.y, 2));
      
      expect(snappedDistance).toBeCloseTo(originalDistance, 0);
    });
  });
  
  describe("getNearestGridIntersection", () => {
    it("should find the closest grid intersection", () => {
      expect(getNearestGridIntersection({ x: 23, y: 19 })).toEqual({ x: 20, y: 20 });
      expect(getNearestGridIntersection({ x: 46, y: 42 }, 10)).toEqual({ x: 50, y: 40 });
    });

    it("should use the default grid size when not specified", () => {
      // Using the GRID_SPACING constant (likely 10)
      expect(getNearestGridIntersection({ x: 23, y: 19 }))
        .toEqual(snapToGrid({ x: 23, y: 19 }, GRID_SPACING));
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

    it("should handle points exactly on grid lines", () => {
      // Point exactly on vertical grid line
      expect(distanceToNearestGridLine({ x: 20, y: 15 }, 10)).toEqual({ x: 0, y: 5 });
      
      // Point exactly on horizontal grid line
      expect(distanceToNearestGridLine({ x: 15, y: 20 }, 10)).toEqual({ x: 5, y: 0 });
      
      // Point exactly on grid intersection
      expect(distanceToNearestGridLine({ x: 20, y: 20 }, 10)).toEqual({ x: 0, y: 0 });
    });

    it("should work with different grid sizes", () => {
      // Using grid size of 5
      expect(distanceToNearestGridLine({ x: 12, y: 18 }, 5)).toEqual({ x: 2, y: 2 });
      
      // Using grid size of 25
      expect(distanceToNearestGridLine({ x: 35, y: 45 }, 25)).toEqual({ x: 10, y: 5 });
    });
  });
});
