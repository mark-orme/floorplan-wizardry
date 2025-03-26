
/**
 * Unit tests for geometry line operations
 * @module tests/geometry/lineOperations
 */
import { describe, it, expect } from "vitest";
import { 
  calculateDistance,
  calculateMidpoint,
  calculateAngle,
  formatDistance
} from "@/utils/geometry/lineOperations";

describe("Line Geometry Operations", () => {
  describe("calculateDistance", () => {
    it("should calculate distances correctly", () => {
      // Simple horizontal line (3 units)
      expect(calculateDistance({ x: 0, y: 0 }, { x: 3, y: 0 })).toBe(3);
      
      // Simple vertical line (4 units)
      expect(calculateDistance({ x: 0, y: 0 }, { x: 0, y: 4 })).toBe(4);
      
      // Diagonal line (5 units - Pythagorean triple 3-4-5)
      expect(calculateDistance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
    });
    
    it("should handle negative coordinates", () => {
      expect(calculateDistance({ x: -2, y: -3 }, { x: 2, y: 3 })).toBeCloseTo(7.21, 2);
    });
    
    it("should return 0 for identical points", () => {
      expect(calculateDistance({ x: 5, y: 5 }, { x: 5, y: 5 })).toBe(0);
    });
  });
  
  describe("calculateMidpoint", () => {
    it("should find the midpoint between two points", () => {
      expect(calculateMidpoint({ x: 0, y: 0 }, { x: 10, y: 20 })).toEqual({ x: 5, y: 10 });
      expect(calculateMidpoint({ x: -10, y: -10 }, { x: 10, y: 10 })).toEqual({ x: 0, y: 0 });
    });
  });
  
  describe("calculateAngle", () => {
    it("should calculate angles in degrees", () => {
      // Horizontal line to the right (0 degrees)
      expect(calculateAngle({ x: 0, y: 0 }, { x: 10, y: 0 })).toBe(0);
      
      // Vertical line upward (90 degrees)
      expect(calculateAngle({ x: 0, y: 0 }, { x: 0, y: 10 })).toBe(90);
      
      // Horizontal line to the left (180 degrees)
      expect(calculateAngle({ x: 0, y: 0 }, { x: -10, y: 0 })).toBe(180);
      
      // Vertical line downward (270 degrees)
      expect(calculateAngle({ x: 0, y: 0 }, { x: 0, y: -10 })).toBe(270);
      
      // 45 degree angle
      expect(calculateAngle({ x: 0, y: 0 }, { x: 10, y: 10 })).toBe(45);
    });
  });
  
  describe("formatDistance", () => {
    it("should format distances with appropriate units", () => {
      // Assuming meter-based units
      expect(formatDistance(3.2)).toBe("3.20m");
      expect(formatDistance(0.5)).toBe("0.50m");
      
      // Test rounding
      expect(formatDistance(3.257)).toBe("3.26m");
    });
  });
  
  // Removed the isPointOnLine tests since it's not exported from the module
});
