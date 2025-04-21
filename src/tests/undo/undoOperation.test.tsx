
import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useDrawingHistory } from '@/hooks/useDrawingHistory';
import { createCanvasRef } from './testUtils';

describe('Undo Operation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not undo when history is empty', () => {
    const canvasRef = createCanvasRef();
    
    const { result } = renderHook(() => useDrawingHistory({
      fabricCanvasRef: canvasRef
    }));
    
    act(() => {
      result.current.undo();
    });
    
    expect(result.current.canUndo).toBe(false);
    expect(canvasRef.current.clear).not.toHaveBeenCalled();
  });

  it('should perform undo operation when history exists', () => {
    const canvasRef = createCanvasRef();
    
    const { result } = renderHook(() => useDrawingHistory({
      fabricCanvasRef: canvasRef
    }));
    
    // Save initial state
    act(() => {
      result.current.saveState();
    });
    
    // Save another state
    act(() => {
      canvasRef.current.getObjects.mockReturnValue([{ id: 'object-1' }]);
      result.current.saveState();
    });
    
    // Now undo should work
    act(() => {
      result.current.undo();
    });
    
    expect(result.current.canRedo).toBe(true);
    expect(result.current.historyRef.current.future).toHaveLength(1);
    expect(canvasRef.current.clear).toHaveBeenCalled();
  });

  it('should track undo/redo state correctly', () => {
    const canvasRef = createCanvasRef();
    
    const { result } = renderHook(() => useDrawingHistory({
      fabricCanvasRef: canvasRef
    }));
    
    // Save states
    act(() => {
      canvasRef.current.getObjects.mockReturnValue([]);
      result.current.saveState();
    });
    
    act(() => {
      canvasRef.current.getObjects.mockReturnValue([{ id: 'object-1' }]);
      result.current.saveState();
    });
    
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);
    
    // Perform undo
    act(() => {
      result.current.undo();
    });
    
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(true);
  });
});
