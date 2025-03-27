
/**
 * Tests for grid debug utilities
 * @jest-environment jsdom
 */
import { expect, describe, test, beforeEach, afterEach, vi } from "vitest";
import { Canvas, Object as FabricObject } from "fabric";
import { createBasicEmergencyGrid, dumpGridState, forceCreateGrid } from "./gridDebugUtils";

// Mock canvas and console methods
vi.mock("fabric", () => {
  return {
    Canvas: vi.fn().mockImplementation(() => ({
      width: 800,
      height: 600,
      getObjects: vi.fn().mockReturnValue([]),
      contains: vi.fn().mockReturnValue(true),
      remove: vi.fn(),
      add: vi.fn(),
      requestRenderAll: vi.fn(),
      sendObjectToBack: vi.fn(),
      getZoom: vi.fn().mockReturnValue(1)
    })),
    Line: vi.fn().mockImplementation(() => ({
      type: 'line'
    }))
  };
});

describe("Grid Debug Utilities", () => {
  let canvas: Canvas;
  let gridLayerRef: React.MutableRefObject<FabricObject[]>;
  
  beforeEach(() => {
    console.group = vi.fn();
    console.log = vi.fn();
    console.warn = vi.fn();
    console.error = vi.fn();
    console.groupEnd = vi.fn();
    
    canvas = new Canvas();
    gridLayerRef = { current: [] };
  });
  
  afterEach(() => {
    vi.clearAllMocks();
  });
  
  test("dumpGridState logs canvas and grid info", () => {
    dumpGridState(canvas, gridLayerRef.current);
    
    expect(console.group).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledTimes(3);
    expect(console.groupEnd).toHaveBeenCalled();
  });
  
  test("createBasicEmergencyGrid creates horizontal and vertical lines", () => {
    const result = createBasicEmergencyGrid(canvas, gridLayerRef);
    
    // For 800x600 canvas with 50px spacing:
    // Horizontal lines: Math.floor(600/50) + 1 = 13
    // Vertical lines: Math.floor(800/50) + 1 = 17
    // Total: 30 lines
    expect(result.length).toBeGreaterThan(0);
    expect(gridLayerRef.current).toBe(result);
  });
  
  test("forceCreateGrid removes existing grid and creates new one", () => {
    // Add some mock grid objects first
    gridLayerRef.current = [{} as FabricObject, {} as FabricObject];
    
    const result = forceCreateGrid(canvas, gridLayerRef);
    
    expect(canvas.remove).toHaveBeenCalledTimes(2);
    expect(result.length).toBeGreaterThan(0);
    expect(canvas.requestRenderAll).toHaveBeenCalled();
  });
  
  test("handles null canvas gracefully", () => {
    const result = createBasicEmergencyGrid(null as unknown as Canvas, gridLayerRef);
    
    expect(result).toEqual([]);
    expect(console.error).toHaveBeenCalled();
  });
});
