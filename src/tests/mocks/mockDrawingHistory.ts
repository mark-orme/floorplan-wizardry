
/**
 * Mock implementation of useDrawingHistory for testing
 */
import { vi } from 'vitest';
import type { UseDrawingHistoryResult } from '@/hooks/useDrawingHistory.d';

/**
 * Create a mock implementation of useDrawingHistory
 */
export function createMockDrawingHistory(): UseDrawingHistoryResult {
  return {
    handleUndo: vi.fn(),
    handleRedo: vi.fn(),
    saveCurrentState: vi.fn(),
    canUndo: false,
    canRedo: false
  };
}
