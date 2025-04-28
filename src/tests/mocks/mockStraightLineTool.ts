
import { vi } from 'vitest';
import { Canvas as FabricCanvas } from 'fabric';
import { Point } from '@/types/core/Point';

/**
 * Creates a mock straight line tool for testing
 * @returns Mock straight line tool
 */
export function createMockStraightLineTool() {
  return {
    startDrawing: vi.fn(),
    continueDrawing: vi.fn(),
    endDrawing: vi.fn(),
    cancelDrawing: vi.fn(),
    getCurrentLine: vi.fn().mockReturnValue(null),
    setSnapToGrid: vi.fn(),
    setConstrainAngle: vi.fn()
  };
}

/**
 * Hook return type mock
 */
export interface MockStraightLineTool {
  startDrawing: (canvas: FabricCanvas, point: Point) => void;
  continueDrawing: (canvas: FabricCanvas, point: Point) => void;
  endDrawing: (canvas: FabricCanvas) => void;
  cancelDrawing: () => void;
  getCurrentLine: () => any;
  setSnapToGrid: (snap: boolean) => void;
  setConstrainAngle: (constrain: boolean) => void;
}
