
/**
 * Mock implementation of useStraightLineTool for testing
 */
import { vi } from 'vitest';
import type { UseStraightLineToolResult } from '@/hooks/straightLineTool/useStraightLineTool.d';

/**
 * Create a mock implementation of useStraightLineTool
 */
export function createMockStraightLineTool(): UseStraightLineToolResult {
  return {
    isToolInitialized: true,
    isDrawing: false,
    startDrawing: vi.fn(),
    continueDrawing: vi.fn(),
    endDrawing: vi.fn(),
    cancelDrawing: vi.fn()
  };
}
