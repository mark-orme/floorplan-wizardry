
import { vi } from 'vitest';
import { Canvas as FabricCanvas } from 'fabric';
import { Point } from '@/types/core/Geometry';

/**
 * Creates a mock straight line tool for testing
 * @returns Mock straight line tool with key methods
 */
export function createMockStraightLineTool() {
  return {
    startDrawing: vi.fn((canvas: FabricCanvas, point: Point) => {
      // Mock implementation
      return { x: point.x, y: point.y };
    }),
    
    continueDrawing: vi.fn((canvas: FabricCanvas, point: Point) => {
      // Mock implementation
      return { x: point.x, y: point.y };
    }),
    
    endDrawing: vi.fn((canvas: FabricCanvas) => {
      // Mock implementation
      return true;
    }),
    
    cancelDrawing: vi.fn((canvas: FabricCanvas) => {
      // Mock implementation
      return true;
    })
  };
}

/**
 * Creates the types required for straight line tool tests
 * These should match your actual types if possible
 */
export type MockStraightLineTool = ReturnType<typeof createMockStraightLineTool>;
