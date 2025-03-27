
/**
 * Tests for line straightening functionality
 * @module tests/geometry/straightening
 */
import { describe, it, expect } from "vitest";
import { 
  straightenLine,
  straightenPolygon,
  hasAlignedWalls,
  straightenStroke
} from "@/utils/geometry/straightening";
import { Point } from "@/types/geometryTypes";
import { 
  DEFAULT_STRAIGHTENING_THRESHOLD,
  WALL_ALIGNMENT_THRESHOLD
} from "@/utils/geometry/constants";

describe("Line Straightening Utilities", () => {
  describe("straightenLine", () => {
    it("should straighten lines close to cardinal angles", () => {
      const start: Point = { x: 100, y: 100 };
      
      // Almost horizontal line
      const almostHorizontal: Point = { x: 200, y: 103 };
      const straightenedHorizontal = straightenLine(start, almostHorizontal, DEFAULT_STRAIGHTENING_THRESHOLD);
      expect(straightenedHorizontal.y).toBe(100);
      
      // Almost vertical line
      const almostVertical: Point = { x: 103, y: 200 };
      const straightenedVertical = straightenLine(start, almostVertical, DEFAULT_STRAIGHTENING_THRESHOLD);
      expect(straightenedVertical.x).toBe(100);
    });
    
    it("should straighten lines close to 45 degree angles", () => {
      const start: Point = { x: 100, y: 100 };
      
      // Almost 45 degrees
      const almost45: Point = { x: 200, y: 195 };
      const straightened45 = straightenLine(start, almost45, DEFAULT_STRAIGHTENING_THRESHOLD);
      
      // Should now be exactly 45 degrees
      const dx = straightened45.x - start.x;
      const dy = straightened45.y - start.y;
      expect(Math.abs(dx)).toBeCloseTo(Math.abs(dy), 0);
    });
    
    it("should not modify lines that don't need straightening", () => {
      const start: Point = { x: 100, y: 100 };
      const end: Point = { x: 183, y: 142 };
      
      // Line not close to any standard angle
      const straightened = straightenLine(start, end, DEFAULT_STRAIGHTENING_THRESHOLD);
      expect(straightened).toEqual(end);
    });

    it("should respect the custom threshold parameter", () => {
      const start: Point = { x: 100, y: 100 };
      
      // Line that's 8 degrees off horizontal
      const almostHorizontal: Point = { x: 200, y: 114 };
      
      // With default threshold (5 degrees), should NOT straighten
      const notStraightened = straightenLine(start, almostHorizontal, 5);
      expect(notStraightened).toEqual(almostHorizontal);
      
      // With higher threshold (10 degrees), SHOULD straighten
      const straightened = straightenLine(start, almostHorizontal, 10);
      expect(straightened.y).toBe(100);
    });
  });
  
  describe("straightenStroke", () => {
    it("should straighten a two-point stroke", () => {
      const points: Point[] = [
        { x: 100, y: 100 },
        { x: 200, y: 95 }
      ];
      
      const straightened = straightenStroke(points, DEFAULT_STRAIGHTENING_THRESHOLD);
      expect(straightened.length).toBe(2);
      expect(straightened[0]).toEqual(points[0]);
      expect(straightened[1].y).toBe(100);
    });
    
    it("should straighten a multi-point stroke into a direct line", () => {
      const points: Point[] = [
        { x: 100, y: 100 },
        { x: 150, y: 140 },
        { x: 180, y: 150 },
        { x: 200, y: 195 }
      ];
      
      const straightened = straightenStroke(points, DEFAULT_STRAIGHTENING_THRESHOLD);
      expect(straightened.length).toBe(2);
      expect(straightened[0]).toEqual(points[0]);
      // Should snap to 45 degrees
      const dx = straightened[1].x - straightened[0].x;
      const dy = straightened[1].y - straightened[0].y;
      expect(Math.abs(dx)).toBeCloseTo(Math.abs(dy), 0);
    });
    
    it("should handle empty or single-point strokes", () => {
      expect(straightenStroke([])).toEqual([]);
      
      const singlePoint: Point[] = [{ x: 100, y: 100 }];
      expect(straightenStroke(singlePoint)).toEqual(singlePoint);
    });

    it("should preserve the original stroke if no straightening is needed", () => {
      // Perfectly straight horizontal line
      const straightLine: Point[] = [
        { x: 100, y: 100 },
        { x: 200, y: 100 }
      ];
      
      const result = straightenStroke(straightLine, DEFAULT_STRAIGHTENING_THRESHOLD);
      expect(result).toEqual(straightLine);
    });
  });
  
  describe("hasAlignedWalls", () => {
    it("should identify polygons with aligned walls", () => {
      const rectangularRoom: Point[] = [
        { x: 100, y: 100 },
        { x: 200, y: 100 },
        { x: 200, y: 200 },
        { x: 100, y: 200 }
      ];
      
      expect(hasAlignedWalls(rectangularRoom, WALL_ALIGNMENT_THRESHOLD)).toBe(true);
    });
    
    it("should identify polygons with non-aligned walls", () => {
      const nonAlignedRoom: Point[] = [
        { x: 100, y: 100 },
        { x: 200, y: 110 },
        { x: 200, y: 200 },
        { x: 100, y: 200 }
      ];
      
      expect(hasAlignedWalls(nonAlignedRoom, WALL_ALIGNMENT_THRESHOLD)).toBe(false);
    });
    
    it("should handle L-shaped rooms with aligned walls", () => {
      const lShapedRoom: Point[] = [
        { x: 100, y: 100 },
        { x: 200, y: 100 },
        { x: 200, y: 150 },
        { x: 150, y: 150 },
        { x: 150, y: 200 },
        { x: 100, y: 200 }
      ];
      
      expect(hasAlignedWalls(lShapedRoom, WALL_ALIGNMENT_THRESHOLD)).toBe(true);
    });

    it("should handle polygons with fewer than 3 points", () => {
      // Empty array
      expect(hasAlignedWalls([], WALL_ALIGNMENT_THRESHOLD)).toBe(false);
      
      // Single point
      expect(hasAlignedWalls([{ x: 100, y: 100 }], WALL_ALIGNMENT_THRESHOLD)).toBe(false);
      
      // Two points (a line)
      expect(hasAlignedWalls([
        { x: 100, y: 100 },
        { x: 200, y: 100 }
      ], WALL_ALIGNMENT_THRESHOLD)).toBe(false);
    });

    it("should respect the custom threshold parameter", () => {
      // Room with walls that are 5 degrees off alignment
      const slightlyOffRoom: Point[] = [
        { x: 100, y: 100 },
        { x: 200, y: 108 }, // ~5 degrees off horizontal
        { x: 200, y: 200 },
        { x: 100, y: 200 }
      ];
      
      // Should not be aligned with 3 degree threshold
      expect(hasAlignedWalls(slightlyOffRoom, 3)).toBe(false);
      
      // Should be aligned with 6 degree threshold
      expect(hasAlignedWalls(slightlyOffRoom, 6)).toBe(true);
    });
  });

  describe("straightenPolygon", () => {
    it("should straighten a polygon with near-straight walls", () => {
      const almostRectangle: Point[] = [
        { x: 100, y: 100 },
        { x: 200, y: 103 }, // slightly off horizontal
        { x: 198, y: 200 }, // slightly off vertical
        { x: 100, y: 198 }  // slightly off horizontal
      ];
      
      const straightened = straightenPolygon(almostRectangle, DEFAULT_STRAIGHTENING_THRESHOLD);
      
      // Should be a perfect rectangle now
      expect(straightened).toEqual([
        { x: 100, y: 100 },
        { x: 200, y: 100 },
        { x: 200, y: 200 },
        { x: 100, y: 200 }
      ]);
    });
    
    it("should handle empty or too small polygons", () => {
      // Empty array
      expect(straightenPolygon([], DEFAULT_STRAIGHTENING_THRESHOLD)).toEqual([]);
      
      // Single point
      const singlePoint: Point[] = [{ x: 100, y: 100 }];
      expect(straightenPolygon(singlePoint, DEFAULT_STRAIGHTENING_THRESHOLD)).toEqual(singlePoint);
      
      // Two points
      const twoPoints: Point[] = [
        { x: 100, y: 100 },
        { x: 200, y: 103 }
      ];
      const straightenedTwo = straightenPolygon(twoPoints, DEFAULT_STRAIGHTENING_THRESHOLD);
      expect(straightenedTwo.length).toBe(2);
      expect(straightenedTwo[0]).toEqual(twoPoints[0]);
      expect(straightenedTwo[1].y).toBe(100);
    });

    it("should preserve complex polygons with intentional angles", () => {
      // Polygon with irregular but intentional angles
      const complexPolygon: Point[] = [
        { x: 100, y: 100 },
        { x: 150, y: 50 },
        { x: 200, y: 100 },
        { x: 150, y: 150 }
      ];
      
      // None of these angles should be straightened as they're all intentional
      const result = straightenPolygon(complexPolygon, DEFAULT_STRAIGHTENING_THRESHOLD);
      expect(result).toEqual(complexPolygon);
    });
  });
});
