
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
import { Point } from "@/types/geometryTypes";
import { DISTANCE_PRECISION } from "@/utils/geometry/constants";

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

    it("should calculate fractional distances accurately", () => {
      // Points that will result in non-integer distance
      expect(calculateDistance({ x: 1.5, y: 2.5 }, { x: 4.5, y: 6.5 })).toBeCloseTo(5, 2);
    });
  });
  
  describe("calculateMidpoint", () => {
    it("should find the midpoint between two points", () => {
      expect(calculateMidpoint({ x: 0, y: 0 }, { x: 10, y: 20 })).toEqual({ x: 5, y: 10 });
      expect(calculateMidpoint({ x: -10, y: -10 }, { x: 10, y: 10 })).toEqual({ x: 0, y: 0 });
    });

    it("should handle fractional coordinates", () => {
      expect(calculateMidpoint({ x: 1.5, y: 2.5 }, { x: 4.5, y: 6.5 })).toEqual({ x: 3, y: 4.5 });
    });

    it("should return the same point when both inputs are identical", () => {
      const point: Point = { x: 5, y: 5 };
      expect(calculateMidpoint(point, point)).toEqual(point);
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

    it("should handle same point edge case", () => {
      // Same points should return 0 degrees
      expect(calculateAngle({ x: 5, y: 5 }, { x: 5, y: 5 })).toBe(0);
    });

    it("should handle all quadrants correctly", () => {
      // First quadrant (0-90 degrees)
      expect(calculateAngle({ x: 0, y: 0 }, { x: 10, y: 5 })).toBeCloseTo(26.57, 1);
      
      // Second quadrant (90-180 degrees)
      expect(calculateAngle({ x: 0, y: 0 }, { x: -10, y: 5 })).toBeCloseTo(153.43, 1);
      
      // Third quadrant (180-270 degrees)
      expect(calculateAngle({ x: 0, y: 0 }, { x: -10, y: -5 })).toBeCloseTo(206.57, 1);
      
      // Fourth quadrant (270-360 degrees)
      expect(calculateAngle({ x: 0, y: 0 }, { x: 10, y: -5 })).toBeCloseTo(333.43, 1);
    });
  });
  
  describe("formatDistance", () => {
    it("should format distances with appropriate units", () => {
      // Using default precision from constants
      expect(formatDistance(3.2)).toBe(`3.${DISTANCE_PRECISION === 2 ? '20' : '2'}m`);
      expect(formatDistance(0.5)).toBe(`0.${DISTANCE_PRECISION === 2 ? '50' : '5'}m`);
      
      // Test rounding
      expect(formatDistance(3.257)).toBe(`3.${DISTANCE_PRECISION === 2 ? '26' : '3'}m`);
    });

    it("should handle zero and negative values", () => {
      expect(formatDistance(0)).toBe(`0.${'0'.repeat(DISTANCE_PRECISION)}m`);
      
      // Negative distances should be formatted as positive
      expect(formatDistance(-3.2)).toBe(formatDistance(3.2));
    });

    it("should format with custom precision", () => {
      // Custom precision of 3 decimal places
      expect(formatDistance(3.2567, 3)).toBe("3.257m");
      
      // Custom precision of 1 decimal place
      expect(formatDistance(3.2567, 1)).toBe("3.3m");
      
      // Custom precision of 0 decimal places
      expect(formatDistance(3.2567, 0)).toBe("3m");
    });
  });
});
