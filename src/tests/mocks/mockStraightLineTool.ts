
import { vi } from 'vitest';
import { UseStraightLineToolResult } from '@/hooks/useStraightLineTool.d';

/**
 * Creates a mock implementation of useStraightLineTool hook
 * @returns Mocked implementation
 */
export const createMockStraightLineTool = (): UseStraightLineToolResult => {
  return {
    isActive: true,
    currentLine: null,
    isToolInitialized: true,
    isDrawing: false,
    startDrawing: vi.fn(),
    continueDrawing: vi.fn(),
    endDrawing: vi.fn(),
    cancelDrawing: vi.fn()
  };
};
