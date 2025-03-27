
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Canvas, Object as FabricObject } from "fabric";
import { dumpGridState, createBasicEmergencyGrid } from "./gridDebugUtils";

// Mock console methods
const originalConsoleLog = console.log;
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

beforeEach(() => {
  // Mock console methods
  console.log = vi.fn();
  console.warn = vi.fn();
  console.error = vi.fn();
});

afterEach(() => {
  // Restore console methods
  console.log = originalConsoleLog;
  console.warn = originalConsoleWarn;
  console.error = originalConsoleError;
});

describe("gridDebugUtils", () => {
  describe("dumpGridState", () => {
    it("should log canvas and grid state", () => {
      // Create a mock canvas
      const canvas = new Canvas(null);
      canvas.width = 800;
      canvas.height = 600;
      
      // Create a mock grid layer reference
      const gridLayerRef = { current: [] };
      
      // Call the function
      dumpGridState(canvas, gridLayerRef);
      
      // Verify console.log was called with canvas state
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining("Canvas state:"),
        expect.objectContaining({
          width: 800,
          height: 600,
          objectCount: expect.any(Number),
          gridObjectCount: 0
        })
      );
    });
  });
  
  // Add more tests as needed
});

