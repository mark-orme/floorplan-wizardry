
import { vi } from 'vitest';
import { UseStraightLineToolResult } from '@/hooks/straightLineTool/useStraightLineTool.d';
import { Point } from '@/types/core/Geometry';

/**
 * Creates a mock implementation of the useStraightLineTool hook
 * @returns A mocked implementation of UseStraightLineToolResult
 */
export const createMockStraightLineTool = (): UseStraightLineToolResult => {
  return {
    isActive: true,
    isToolInitialized: true,
    isDrawing: false,
    currentLine: null,
    cancelDrawing: vi.fn(),
    startDrawing: vi.fn((point: Point) => {}),
    continueDrawing: vi.fn((point: Point) => {}),
    endDrawing: vi.fn(() => {})
  };
};
