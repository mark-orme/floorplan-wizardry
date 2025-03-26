
/**
 * Tests for grid snapping functionality
 * @module tests/grid/snapping
 */
import { describe, it, expect } from "vitest";
import { 
  snapToGrid, 
  snapToAngle, 
  snapWithThreshold,
  getNearestGridIntersection,
  snapLineToStandardAngles
} from "@/utils/grid/snapping";
import { GRID_SPACING } from "@/constants/numerics";

describe("Grid Snapping Utilities", () => {
  describe("snapToGrid", () => {
    it("should snap points to nearest grid intersection", () => {
      // Test exact grid point
      expect(snapToGrid({ x: 100, y: 100 }, 50)).toEqual({ x: 100, y: 100 });
      
      // Test close to grid point - should snap
      expect(snapToGrid({ x: 103, y: 97 }, 50)).toEqual({ x: 100, y: 100 });
      
      // Test exactly between grid points - should snap to nearest
      expect(snapToGrid({ x: 125, y: 125 }, 50)).toEqual({ x: 150, y: 150 });
    });
    
    it("should handle negative coordinates", () => {
      expect(snapToGrid({ x: -23, y: -27 }, 50)).toEqual({ x: 0, y: -50 });
      expect(snapToGrid({ x: -75, y: -80 }, 50)).toEqual({ x: -50, y: -100 });
    });
    
    it("should use default grid size when none provided", () => {
      const result = snapToGrid({ x: GRID_SPACING * 2.2, y: GRID_SPACING * 1.8 });
      expect(result).toEqual({ x: GRID_SPACING * 2, y: GRID_SPACING * 2 });
    });
  });
  
  describe("snapToAngle", () => {
    it("should snap angles to the nearest increment", () => {
      expect(snapToAngle(42, 45)).toBe(45);
      expect(snapToAngle(22, 45)).toBe(0);
      expect(snapToAngle(89, 90)).toBe(90);
      expect(snapToAngle(91, 90)).toBe(90);
    });
    
    it("should handle angles greater than 360 degrees", () => {
      expect(snapToAngle(362, 45)).toBe(0);
      expect(snapToAngle(405, 45)).toBe(405);
    });
    
    it("should handle negative angles", () => {
      expect(snapToAngle(-45, 45)).toBe(-45);
      expect(snapToAngle(-22, 45)).toBe(0);
    });
    
    it("should default to 45 degree increments", () => {
      expect(snapToAngle(22)).toBe(0);
      expect(snapToAngle(44)).toBe(45);
      expect(snapToAngle(89)).toBe(90);
    });
  });
  
  describe("snapWithThreshold", () => {
    it("should only snap when within threshold distance", () => {
      const gridSize = 50;
      
      // Within threshold - should snap
      expect(snapWithThreshold({ x: 97, y: 97 }, gridSize, 0.2)).toEqual({ x: 100, y: 100 });
      
      // Outside threshold - should not snap
      expect(snapWithThreshold({ x: 90, y: 90 }, gridSize, 0.1)).toEqual({ x: 90, y: 90 });
    });
    
    it("should use default threshold when none provided", () => {
      // Default threshold is 0.5 (meaning it will snap if within 25% of gridSize in either direction)
      const gridSize = 100;
      
      // Within default threshold - should snap
      expect(snapWithThreshold({ x: 88, y: 88 }, gridSize)).toEqual({ x: 100, y: 100 });
      
      // Outside default threshold - should not snap
      expect(snapWithThreshold({ x: 70, y: 70 }, gridSize)).toEqual({ x: 70, y: 70 });
    });
  });
  
  describe("snapLineToStandardAngles", () => {
    it("should align lines to standard angles", () => {
      const start = { x: 100, y: 100 };
      
      // Almost horizontal
      const almostHorizontal = { x: 200, y: 105 };
      const snappedHorizontal = snapLineToStandardAngles(start, almostHorizontal);
      expect(snappedHorizontal.y).toBeCloseTo(100);
      
      // Almost 45 degrees
      const almost45 = { x: 200, y: 195 };
      const snapped45 = snapLineToStandardAngles(start, almost45);
      // Should be exactly at 45 degrees
      expect(snapped45.x - start.x).toBeCloseTo(snapped45.y - start.y);
    });
    
    it("should not modify lines that are already aligned", () => {
      const start = { x: 100, y: 100 };
      
      // Exactly vertical
      const exactlyVertical = { x: 100, y: 200 };
      const snappedVertical = snapLineToStandardAngles(start, exactlyVertical);
      expect(snappedVertical).toEqual(exactlyVertical);
      
      // Exactly 45 degrees
      const exactly45 = { x: 200, y: 200 };
      const snapped45 = snapLineToStandardAngles(start, exactly45);
      expect(snapped45).toEqual(exactly45);
    });
  });
});
