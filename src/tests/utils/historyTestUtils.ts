
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
