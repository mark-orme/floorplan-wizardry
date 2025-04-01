
import { Canvas } from 'fabric';
import { vi } from 'vitest';
import { UseDrawingHistoryProps } from '@/hooks/useDrawingHistory.d';

/**
 * Create mock props for the useDrawingHistory hook
 * @returns Mock props for testing
 */
export const createMockDrawingHistoryProps = (): UseDrawingHistoryProps => {
  return {
    fabricCanvasRef: { current: null as Canvas | null },
    gridLayerRef: { current: [] },
    historyRef: { current: { past: [], future: [] } },
    clearDrawings: vi.fn(),
    recalculateGIA: vi.fn()
  };
};

/**
 * Create mock result for the useDrawingHistory hook
 * @returns Mock result for testing
 */
export const createMockDrawingHistoryResult = () => {
  return {
    handleUndo: vi.fn(),
    handleRedo: vi.fn(),
    saveCurrentState: vi.fn(),
    canUndo: false,
    canRedo: false
  };
};
