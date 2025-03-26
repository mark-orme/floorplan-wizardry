
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

/**
 * Constants for grid snapping tests
 */
const SNAPPING_TEST_CONSTANTS = {
  /**
   * Test grid size in pixels
   * @constant {number}
   */
  GRID_SIZE: 50,
  
  /**
   * Standard angle increment for testing
   * @constant {number}
   */
  ANGLE_INCREMENT_45: 45,
  
  /**
   * Standard angle increment for testing
   * @constant {number}
   */
  ANGLE_INCREMENT_90: 90,
  
  /**
   * Test points exact on grid
   */
  GRID_POINTS: {
    /**
     * Point exactly on grid
     */
    EXACT: { x: 100, y: 100 },
    
    /**
     * Point close to grid - should snap
     */
    CLOSE: { x: 103, y: 97 },
    
    /**
     * Point between grid points - should snap to nearest
     */
    BETWEEN: { x: 125, y: 125 },
    
    /**
     * Negative point near grid
     */
    NEGATIVE_CLOSE: { x: -23, y: -27 },
    
    /**
     * Negative point between grid points
     */
    NEGATIVE_BETWEEN: { x: -75, y: -80 }
  },
  
  /**
   * Test angles for snapping
   */
  TEST_ANGLES: {
    /**
     * Almost 45 degrees
     */
    ALMOST_45: 42,
    
    /**
     * Closer to 0 than 45
     */
    CLOSER_TO_0: 22,
    
    /**
     * Almost 90 degrees
     */
    ALMOST_90: 89,
    
    /**
     * Just over 90 degrees
     */
    JUST_OVER_90: 91,
    
    /**
     * Angle over 360
     */
    OVER_360: 362,
    
    /**
     * Angle at 405 (45 + 360)
     */
    AT_405: 405,
    
    /**
     * Negative angle at -45
     */
    NEGATIVE_45: -45,
    
    /**
     * Negative angle closer to 0
     */
    NEGATIVE_CLOSER_TO_0: -22
  },
  
  /**
   * Expected snapped angle results
   */
  EXPECTED_ANGLES: {
    /**
     * Expected 0 degrees
     */
    ZERO: 0,
    
    /**
     * Expected 45 degrees
     */
    ANGLE_45: 45,
    
    /**
     * Expected 90 degrees
     */
    ANGLE_90: 90
  },
  
  /**
   * Test threshold values
   */
  THRESHOLDS: {
    /**
     * Small threshold for testing (20%)
     */
    SMALL: 0.2,
    
    /**
     * Small threshold for testing (10%)
     */
    VERY_SMALL: 0.1
  },
  
  /**
   * Points for line straightening tests
   */
  LINE_POINTS: {
    /**
     * Starting point
     */
    START: { x: 100, y: 100 },
    
    /**
     * Almost horizontal end point
     */
    ALMOST_HORIZONTAL: { x: 200, y: 105 },
    
    /**
     * Almost 45 degrees end point
     */
    ALMOST_45: { x: 200, y: 195 },
    
    /**
     * Exactly vertical end point
     */
    EXACTLY_VERTICAL: { x: 100, y: 200 },
    
    /**
     * Exactly 45 degrees end point
     */
    EXACTLY_45: { x: 200, y: 200 }
  }
};

describe("Grid Snapping Utilities", () => {
  describe("snapToGrid", () => {
    it("should snap points to nearest grid intersection", () => {
      const { GRID_POINTS, GRID_SIZE } = SNAPPING_TEST_CONSTANTS;
      
      // Test exact grid point
      expect(snapToGrid(GRID_POINTS.EXACT, GRID_SIZE)).toEqual(GRID_POINTS.EXACT);
      
      // Test close to grid point - should snap
      expect(snapToGrid(GRID_POINTS.CLOSE, GRID_SIZE)).toEqual(GRID_POINTS.EXACT);
      
      // Test exactly between grid points - should snap to nearest
      expect(snapToGrid(GRID_POINTS.BETWEEN, GRID_SIZE)).toEqual({ x: 150, y: 150 });
    });
    
    it("should handle negative coordinates", () => {
      const { GRID_POINTS, GRID_SIZE } = SNAPPING_TEST_CONSTANTS;
      
      expect(snapToGrid(GRID_POINTS.NEGATIVE_CLOSE, GRID_SIZE)).toEqual({ x: 0, y: -50 });
      expect(snapToGrid(GRID_POINTS.NEGATIVE_BETWEEN, GRID_SIZE)).toEqual({ x: -50, y: -100 });
    });
    
    it("should use default grid size when none provided", () => {
      const result = snapToGrid({ x: GRID_SPACING * 2.2, y: GRID_SPACING * 1.8 });
      expect(result).toEqual({ x: GRID_SPACING * 2, y: GRID_SPACING * 2 });
    });
  });
  
  describe("snapToAngle", () => {
    it("should snap angles to the nearest increment", () => {
      const { TEST_ANGLES, EXPECTED_ANGLES, ANGLE_INCREMENT_45, ANGLE_INCREMENT_90 } = SNAPPING_TEST_CONSTANTS;
      
      expect(snapToAngle(TEST_ANGLES.ALMOST_45, ANGLE_INCREMENT_45)).toBe(EXPECTED_ANGLES.ANGLE_45);
      expect(snapToAngle(TEST_ANGLES.CLOSER_TO_0, ANGLE_INCREMENT_45)).toBe(EXPECTED_ANGLES.ZERO);
      expect(snapToAngle(TEST_ANGLES.ALMOST_90, ANGLE_INCREMENT_90)).toBe(EXPECTED_ANGLES.ANGLE_90);
      expect(snapToAngle(TEST_ANGLES.JUST_OVER_90, ANGLE_INCREMENT_90)).toBe(EXPECTED_ANGLES.ANGLE_90);
    });
    
    it("should handle angles greater than 360 degrees", () => {
      const { TEST_ANGLES, EXPECTED_ANGLES, ANGLE_INCREMENT_45 } = SNAPPING_TEST_CONSTANTS;
      
      expect(snapToAngle(TEST_ANGLES.OVER_360, ANGLE_INCREMENT_45)).toBe(EXPECTED_ANGLES.ZERO);
      expect(snapToAngle(TEST_ANGLES.AT_405, ANGLE_INCREMENT_45)).toBe(TEST_ANGLES.AT_405);
    });
    
    it("should handle negative angles", () => {
      const { TEST_ANGLES, EXPECTED_ANGLES, ANGLE_INCREMENT_45 } = SNAPPING_TEST_CONSTANTS;
      
      expect(snapToAngle(TEST_ANGLES.NEGATIVE_45, ANGLE_INCREMENT_45)).toBe(TEST_ANGLES.NEGATIVE_45);
      expect(snapToAngle(TEST_ANGLES.NEGATIVE_CLOSER_TO_0, ANGLE_INCREMENT_45)).toBe(EXPECTED_ANGLES.ZERO);
    });
    
    it("should default to 45 degree increments", () => {
      const { TEST_ANGLES, EXPECTED_ANGLES } = SNAPPING_TEST_CONSTANTS;
      
      expect(snapToAngle(TEST_ANGLES.CLOSER_TO_0)).toBe(EXPECTED_ANGLES.ZERO);
      expect(snapToAngle(TEST_ANGLES.ALMOST_45)).toBe(EXPECTED_ANGLES.ANGLE_45);
      expect(snapToAngle(TEST_ANGLES.ALMOST_90)).toBe(EXPECTED_ANGLES.ANGLE_90);
    });
  });
  
  describe("snapWithThreshold", () => {
    it("should only snap when within threshold distance", () => {
      const { GRID_POINTS, GRID_SIZE, THRESHOLDS } = SNAPPING_TEST_CONSTANTS;
      
      // Within threshold - should snap
      expect(snapWithThreshold({ x: 97, y: 97 }, GRID_SIZE, THRESHOLDS.SMALL)).toEqual(GRID_POINTS.EXACT);
      
      // Outside threshold - should not snap
      expect(snapWithThreshold({ x: 90, y: 90 }, GRID_SIZE, THRESHOLDS.VERY_SMALL)).toEqual({ x: 90, y: 90 });
    });
    
    it("should use default threshold when none provided", () => {
      // Default threshold is 0.5 (meaning it will snap if within 25% of gridSize in either direction)
      const customGridSize = 100;
      
      // Within default threshold - should snap
      expect(snapWithThreshold({ x: 88, y: 88 }, customGridSize)).toEqual({ x: 100, y: 100 });
      
      // Outside default threshold - should not snap
      expect(snapWithThreshold({ x: 70, y: 70 }, customGridSize)).toEqual({ x: 70, y: 70 });
    });
  });
  
  describe("snapLineToStandardAngles", () => {
    it("should align lines to standard angles", () => {
      const { LINE_POINTS } = SNAPPING_TEST_CONSTANTS;
      
      // Almost horizontal
      const snappedHorizontal = snapLineToStandardAngles(LINE_POINTS.START, LINE_POINTS.ALMOST_HORIZONTAL);
      expect(snappedHorizontal.y).toBeCloseTo(LINE_POINTS.START.y);
      
      // Almost 45 degrees
      const snapped45 = snapLineToStandardAngles(LINE_POINTS.START, LINE_POINTS.ALMOST_45);
      // Should be exactly at 45 degrees
      expect(snapped45.x - LINE_POINTS.START.x).toBeCloseTo(snapped45.y - LINE_POINTS.START.y);
    });
    
    it("should not modify lines that are already aligned", () => {
      const { LINE_POINTS } = SNAPPING_TEST_CONSTANTS;
      
      // Exactly vertical
      const snappedVertical = snapLineToStandardAngles(LINE_POINTS.START, LINE_POINTS.EXACTLY_VERTICAL);
      expect(snappedVertical).toEqual(LINE_POINTS.EXACTLY_VERTICAL);
      
      // Exactly 45 degrees
      const snapped45 = snapLineToStandardAngles(LINE_POINTS.START, LINE_POINTS.EXACTLY_45);
      expect(snapped45).toEqual(LINE_POINTS.EXACTLY_45);
    });
  });
});
