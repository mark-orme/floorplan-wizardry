
import { vi } from 'vitest';
import { UseDrawingHistoryResult } from '@/hooks/useDrawingHistory.d';

/**
 * Creates a mock implementation of useDrawingHistory hook
 * @returns Mocked implementation of UseDrawingHistoryResult
 */
export const createMockDrawingHistory = (): UseDrawingHistoryResult => {
  return {
    handleUndo: vi.fn(),
    handleRedo: vi.fn(),
    saveCurrentState: vi.fn(),
    canUndo: false,
    canRedo: false
  };
};
