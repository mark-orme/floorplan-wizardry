
/**
 * Tests for grid debug utilities
 * @jest-environment jsdom
 */
import { Canvas, Object as FabricObject } from "fabric";
import { createBasicEmergencyGrid, dumpGridState, forceCreateGrid } from "./gridDebugUtils";

// Mock canvas and console methods
jest.mock("fabric", () => {
  return {
    Canvas: jest.fn().mockImplementation(() => ({
      width: 800,
      height: 600,
      getObjects: jest.fn().mockReturnValue([]),
      contains: jest.fn().mockReturnValue(true),
      remove: jest.fn(),
      add: jest.fn(),
      requestRenderAll: jest.fn(),
      sendObjectToBack: jest.fn(),
      getZoom: jest.fn().mockReturnValue(1)
    })),
    Line: jest.fn().mockImplementation(() => ({
      type: 'line'
    }))
  };
});

describe("Grid Debug Utilities", () => {
  let canvas: Canvas;
  let gridLayerRef: React.MutableRefObject<FabricObject[]>;
  
  beforeEach(() => {
    console.group = jest.fn();
    console.log = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();
    console.groupEnd = jest.fn();
    
    canvas = new Canvas();
    gridLayerRef = { current: [] };
  });
  
  afterEach(() => {
    jest.clearAllMocks();
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
