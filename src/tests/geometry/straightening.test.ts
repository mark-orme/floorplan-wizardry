
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

describe("Line Straightening Utilities", () => {
  describe("straightenLine", () => {
    it("should straighten lines close to cardinal angles", () => {
      const start = { x: 100, y: 100 };
      
      // Almost horizontal line
      const almostHorizontal = { x: 200, y: 103 };
      const straightenedHorizontal = straightenLine(start, almostHorizontal, 5);
      expect(straightenedHorizontal.y).toBe(100);
      
      // Almost vertical line
      const almostVertical = { x: 103, y: 200 };
      const straightenedVertical = straightenLine(start, almostVertical, 5);
      expect(straightenedVertical.x).toBe(100);
    });
    
    it("should straighten lines close to 45 degree angles", () => {
      const start = { x: 100, y: 100 };
      
      // Almost 45 degrees
      const almost45 = { x: 200, y: 195 };
      const straightened45 = straightenLine(start, almost45, 5);
      
      // Should now be exactly 45 degrees
      const dx = straightened45.x - start.x;
      const dy = straightened45.y - start.y;
      expect(Math.abs(dx)).toBeCloseTo(Math.abs(dy));
    });
    
    it("should not modify lines that don't need straightening", () => {
      const start = { x: 100, y: 100 };
      const end = { x: 183, y: 142 };
      
      // Line not close to any standard angle
      const straightened = straightenLine(start, end, 5);
      expect(straightened).toEqual(end);
    });
  });
  
  describe("straightenStroke", () => {
    it("should straighten a two-point stroke", () => {
      const points = [
        { x: 100, y: 100 },
        { x: 200, y: 95 }
      ];
      
      const straightened = straightenStroke(points, 5);
      expect(straightened.length).toBe(2);
      expect(straightened[0]).toEqual(points[0]);
      expect(straightened[1].y).toBe(100);
    });
    
    it("should straighten a multi-point stroke into a direct line", () => {
      const points = [
        { x: 100, y: 100 },
        { x: 150, y: 140 },
        { x: 180, y: 150 },
        { x: 200, y: 195 }
      ];
      
      const straightened = straightenStroke(points, 5);
      expect(straightened.length).toBe(2);
      expect(straightened[0]).toEqual(points[0]);
      // Should snap to 45 degrees
      const dx = straightened[1].x - straightened[0].x;
      const dy = straightened[1].y - straightened[0].y;
      expect(Math.abs(dx)).toBeCloseTo(Math.abs(dy));
    });
    
    it("should handle empty or single-point strokes", () => {
      expect(straightenStroke([])).toEqual([]);
      
      const singlePoint = [{ x: 100, y: 100 }];
      expect(straightenStroke(singlePoint)).toEqual(singlePoint);
    });
  });
  
  describe("hasAlignedWalls", () => {
    it("should identify polygons with aligned walls", () => {
      const rectangularRoom = [
        { x: 100, y: 100 },
        { x: 200, y: 100 },
        { x: 200, y: 200 },
        { x: 100, y: 200 }
      ];
      
      expect(hasAlignedWalls(rectangularRoom)).toBe(true);
    });
    
    it("should identify polygons with non-aligned walls", () => {
      const nonAlignedRoom = [
        { x: 100, y: 100 },
        { x: 200, y: 110 },
        { x: 200, y: 200 },
        { x: 100, y: 200 }
      ];
      
      expect(hasAlignedWalls(nonAlignedRoom)).toBe(false);
    });
    
    it("should handle L-shaped rooms with aligned walls", () => {
      const lShapedRoom = [
        { x: 100, y: 100 },
        { x: 200, y: 100 },
        { x: 200, y: 150 },
        { x: 150, y: 150 },
        { x: 150, y: 200 },
        { x: 100, y: 200 }
      ];
      
      expect(hasAlignedWalls(lShapedRoom)).toBe(true);
    });
  });
});
