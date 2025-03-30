
/**
 * Tests for grid debug utilities
 * @jest-environment jsdom
 */
import { expect, describe, test, beforeEach, afterEach, vi } from "vitest";
import { Canvas, Object as FabricObject } from "fabric";
import { 
  dumpGridState, 
  createBasicEmergencyGrid, 
  forceCreateGrid 
} from "./gridDebugUtils";

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
    const result = createBasicEmergencyGrid(canvas);
    
    // For a real canvas with appropriate dimensions, we'd expect grid objects to be created
    expect(result.length).toBeGreaterThan(0);
  });
  
  test("forceCreateGrid removes existing grid and creates new one", () => {
    // Add some mock grid objects first
    const mockGridObjects = [{} as FabricObject, {} as FabricObject];
    vi.spyOn(canvas, 'getObjects').mockReturnValue(
      mockGridObjects.map(obj => ({ ...obj, objectType: 'grid' } as FabricObject))
    );
    
    const result = forceCreateGrid(canvas);
    
    expect(canvas.remove).toHaveBeenCalledTimes(2);
    expect(result.length).toBeGreaterThan(0);
    expect(canvas.requestRenderAll).toHaveBeenCalled();
  });
  
  test("handles null canvas gracefully", () => {
    const result = createBasicEmergencyGrid(null as unknown as Canvas);
    
    expect(result).toEqual([]);
    expect(console.error).toHaveBeenCalled();
  });
});
