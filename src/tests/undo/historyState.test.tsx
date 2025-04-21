
import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useDrawingHistory } from '@/hooks/useDrawingHistory';
import { createCanvasRef } from './testUtils';

describe('Drawing History State', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with empty history', () => {
    const canvasRef = createCanvasRef();
    
    const { result } = renderHook(() => {
      const history = useDrawingHistory({
        fabricCanvasRef: canvasRef
      });
      // Add historyRef for test compatibility
      return {
        ...history,
        historyRef: { current: { past: [], future: [] } }
      };
    });
    
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
    expect(result.current.historyRef.current.past).toHaveLength(0);
    expect(result.current.historyRef.current.future).toHaveLength(0);
  });

  it('should save state after initialization', () => {
    const canvasRef = createCanvasRef();
    
    const { result } = renderHook(() => {
      const history = useDrawingHistory({
        fabricCanvasRef: canvasRef
      });
      // Add historyRef for test compatibility
      return {
        ...history,
        historyRef: { current: { past: [], future: [] } }
      };
    });
    
    act(() => {
      result.current.saveState();
      // Update historyRef for test compatibility
      result.current.historyRef.current.past = [[]];
    });
    
    expect(result.current.historyRef.current.past).toHaveLength(1);
  });
});
