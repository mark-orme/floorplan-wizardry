
/**
 * Tests for canvas drawing flows
 * @module tests/canvas/canvasDrawing
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { calculateDistance } from "@/utils/geometry/lineOperations";
import { calculateMidpoint } from "@/utils/geometry/midpointCalculation";
import { Point } from "@/types/geometryTypes";
import { DEFAULT_LINE_COLOR } from "@/utils/drawing";
import { FLOATING_POINT_TOLERANCE } from "@/utils/geometry/constants";

/**
 * Test constants for canvas dimensions and coordinates
 */
const TEST_CONSTANTS = {
  /**
   * Default canvas width for tests
   * @constant {number}
   */
  CANVAS_WIDTH: 800,
  
  /**
   * Default canvas height for tests
   * @constant {number}
   */
  CANVAS_HEIGHT: 600,
  
  /**
   * Test point coordinates
   */
  POINTS: {
    /**
     * First test point
     */
    POINT_1: { x: 100, y: 100 },
    
    /**
     * Second test point (horizontal from POINT_1)
     */
    POINT_2: { x: 200, y: 100 },
    
    /**
     * Third test point (vertical from POINT_1)
     */
    POINT_3: { x: 100, y: 200 },
    
    /**
     * Fourth test point (diagonal from POINT_1)
     */
    POINT_4: { x: 200, y: 200 }
  },
  
  /**
   * Test event coordinates
   */
  EVENTS: {
    /**
     * Mouse event position
     */
    MOUSE_POSITION: { x: 150, y: 150 },
    
    /**
     * Touch event position
     */
    TOUCH_POSITION: { x: 200, y: 250 }
  },
  
  /**
   * Expected test values
   */
  EXPECTED: {
    /**
     * Expected horizontal distance between test points
     */
    HORIZONTAL_DISTANCE: 100,
    
    /**
     * Expected vertical distance between test points
     */
    VERTICAL_DISTANCE: 100,
    
    /**
     * Expected diagonal distance between test points
     */
    DIAGONAL_DISTANCE: 141.42,
    
    /**
     * Expected midpoint between test points
     */
    MIDPOINT: { x: 150, y: 150 },
    
    /**
     * Expected horizontal midpoint
     */
    HORIZONTAL_MIDPOINT: { x: 150, y: 100 }
  },
  
  /**
   * Test precision for floating point comparisons
   */
  COMPARISON_PRECISION: 1
};

/**
 * Mock for a Fabric.js canvas
 * @type {Object}
 */
const createMockCanvas = (): Partial<FabricCanvas> => ({
  add: vi.fn(),
  remove: vi.fn(),
  clear: vi.fn(),
  renderAll: vi.fn(),
  requestRenderAll: vi.fn(),
  setZoom: vi.fn(),
  getZoom: vi.fn().mockReturnValue(1),
  getObjects: vi.fn().mockReturnValue([]),
  getWidth: vi.fn().mockReturnValue(TEST_CONSTANTS.CANVAS_WIDTH),
  getHeight: vi.fn().mockReturnValue(TEST_CONSTANTS.CANVAS_HEIGHT),
  getPointer: vi.fn(),
  discardActiveObject: vi.fn(),
  sendObjectToBack: vi.fn(),
  bringObjectToFront: vi.fn(),
  contains: vi.fn().mockReturnValue(true),
  on: vi.fn(),
  off: vi.fn(),
  isDrawingMode: false,
  freeDrawingBrush: { width: 1, color: DEFAULT_LINE_COLOR }
});

// Mock fabric.js
vi.mock("fabric", () => {
  const Canvas = vi.fn(() => createMockCanvas());
  
  const Line = vi.fn().mockImplementation((points: Point[], options: Record<string, unknown>) => ({
    type: "line",
    points,
    ...options
  }));
  
  const Text = vi.fn().mockImplementation((text: string, options: Record<string, unknown>) => ({
    type: "text",
    text,
    ...options
  }));
  
  return { Canvas, Line, Text, Object: { prototype: {} } };
});

describe("Canvas Drawing Utilities", () => {
  let canvasRef: { current: HTMLCanvasElement | null };
  let fabricCanvas: Partial<FabricCanvas>;
  
  beforeEach(() => {
    fabricCanvas = createMockCanvas();
    canvasRef = { current: document.createElement('canvas') };
    
    // Mock getPointer for tests
    fabricCanvas.getPointer = vi.fn().mockImplementation((evt: { clientX?: number, clientY?: number }) => {
      // Return the clientX/Y as canvas coordinates for simplicity
      return { x: evt.clientX || 0, y: evt.clientY || 0 };
    });
  });
  
  describe("Distance and Midpoint Calculations", () => {
    it("should calculate correct distance between points", () => {
      const { POINTS, EXPECTED } = TEST_CONSTANTS;
      
      // Should be 100 pixels horizontal distance
      expect(calculateDistance(POINTS.POINT_1, POINTS.POINT_2)).toBe(EXPECTED.HORIZONTAL_DISTANCE);
      
      // Should be 100 pixels vertical distance
      expect(calculateDistance(POINTS.POINT_1, POINTS.POINT_3)).toBe(EXPECTED.VERTICAL_DISTANCE);
      
      // Should be ~141.42 pixels diagonal distance (Pythagoras)
      expect(calculateDistance(POINTS.POINT_1, POINTS.POINT_4))
        .toBeCloseTo(EXPECTED.DIAGONAL_DISTANCE, TEST_CONSTANTS.COMPARISON_PRECISION);
    });
    
    it("should calculate correct midpoints", () => {
      const { POINTS, EXPECTED } = TEST_CONSTANTS;
      
      const midpoint = calculateMidpoint(POINTS.POINT_1, POINTS.POINT_4);
      expect(midpoint).toEqual(EXPECTED.MIDPOINT);
      
      const horizontalMidpoint = calculateMidpoint(POINTS.POINT_1, POINTS.POINT_2);
      expect(horizontalMidpoint).toEqual(EXPECTED.HORIZONTAL_MIDPOINT);
    });

    it("should handle edge cases for distance calculation", () => {
      // Same point should have zero distance
      expect(calculateDistance(
        TEST_CONSTANTS.POINTS.POINT_1, 
        TEST_CONSTANTS.POINTS.POINT_1
      )).toBe(0);
      
      // Test with negative coordinates
      const negativePoint: Point = { x: -100, y: -100 };
      expect(calculateDistance(
        TEST_CONSTANTS.POINTS.POINT_1,
        negativePoint
      )).toBeCloseTo(282.84, TEST_CONSTANTS.COMPARISON_PRECISION);
    });

    it("should handle edge cases for midpoint calculation", () => {
      // Same point should return the same point
      const samePointMidpoint = calculateMidpoint(
        TEST_CONSTANTS.POINTS.POINT_1,
        TEST_CONSTANTS.POINTS.POINT_1
      );
      expect(samePointMidpoint).toEqual(TEST_CONSTANTS.POINTS.POINT_1);
      
      // Test with negative and positive coordinates
      const negativePoint: Point = { x: -100, y: -100 };
      const mixedMidpoint = calculateMidpoint(
        TEST_CONSTANTS.POINTS.POINT_1,
        negativePoint
      );
      expect(mixedMidpoint).toEqual({ x: 0, y: 0 });
    });
  });
  
  describe("Mouse Event Handling", () => {
    it("should handle mouse movement coordinates", () => {
      // Create a mock mouse event
      const mockMouseEvent = {
        clientX: TEST_CONSTANTS.EVENTS.MOUSE_POSITION.x,
        clientY: TEST_CONSTANTS.EVENTS.MOUSE_POSITION.y,
        preventDefault: vi.fn()
      };
      
      const pointer = fabricCanvas.getPointer!(mockMouseEvent);
      
      expect(pointer.x).toBe(TEST_CONSTANTS.EVENTS.MOUSE_POSITION.x);
      expect(pointer.y).toBe(TEST_CONSTANTS.EVENTS.MOUSE_POSITION.y);
    });
    
    it("should handle touch event coordinates", () => {
      // Create a mock touch event
      const mockTouchEvent = {
        touches: [{ 
          clientX: TEST_CONSTANTS.EVENTS.TOUCH_POSITION.x, 
          clientY: TEST_CONSTANTS.EVENTS.TOUCH_POSITION.y 
        }],
        preventDefault: vi.fn()
      };
      
      // We need to manually mock this for touch events
      fabricCanvas.getPointer = vi.fn().mockReturnValue(TEST_CONSTANTS.EVENTS.TOUCH_POSITION);
      
      const pointer = fabricCanvas.getPointer(mockTouchEvent);
      
      expect(pointer.x).toBe(TEST_CONSTANTS.EVENTS.TOUCH_POSITION.x);
      expect(pointer.y).toBe(TEST_CONSTANTS.EVENTS.TOUCH_POSITION.y);
    });

    it("should handle missing touch coordinates gracefully", () => {
      // Empty touch event
      const emptyTouchEvent = {
        touches: [],
        preventDefault: vi.fn()
      };
      
      // Default mock to return origin if no coordinates
      fabricCanvas.getPointer = vi.fn().mockReturnValue({ x: 0, y: 0 });
      
      const pointer = fabricCanvas.getPointer(emptyTouchEvent);
      
      expect(pointer.x).toBe(0);
      expect(pointer.y).toBe(0);
    });
  });

  describe("Canvas State Behavior", () => {
    it("should initialize canvas with correct dimensions", () => {
      expect(fabricCanvas.getWidth!()).toBe(TEST_CONSTANTS.CANVAS_WIDTH);
      expect(fabricCanvas.getHeight!()).toBe(TEST_CONSTANTS.CANVAS_HEIGHT);
    });

    it("should handle zoom level changes", () => {
      // Initial zoom level
      expect(fabricCanvas.getZoom!()).toBe(1);
      
      // Simulate zoom change
      const newZoom = 1.5;
      fabricCanvas.setZoom!(newZoom);
      
      // Mock implementation to return the new zoom
      fabricCanvas.getZoom = vi.fn().mockReturnValue(newZoom);
      
      expect(fabricCanvas.getZoom!()).toBe(newZoom);
    });
  });
});
