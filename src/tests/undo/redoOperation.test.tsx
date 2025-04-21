
import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useDrawingHistory } from '@/hooks/useDrawingHistory';
import { createCanvasRef } from './testUtils';

describe('Redo Operation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not redo when future is empty', () => {
    const canvasRef = createCanvasRef();
    
    const { result } = renderHook(() => useDrawingHistory({
      fabricCanvasRef: canvasRef
    }));
    
    act(() => {
      result.current.redo();
    });
    
    expect(result.current.canRedo).toBe(false);
    expect(canvasRef.current.clear).not.toHaveBeenCalled();
  });

  it('should perform redo operation after undo', () => {
    const canvasRef = createCanvasRef();
    
    const { result } = renderHook(() => useDrawingHistory({
      fabricCanvasRef: canvasRef
    }));
    
    // Create history
    act(() => {
      canvasRef.current.getObjects.mockReturnValue([]);
      result.current.saveState();
    });
    
    act(() => {
      canvasRef.current.getObjects.mockReturnValue([{ id: 'object-1' }]);
      result.current.saveState();
    });
    
    // Undo
    act(() => {
      result.current.undo();
    });
    
    // Now redo should work
    act(() => {
      canvasRef.current.clear.mockClear(); // Reset mock
      result.current.redo();
    });
    
    expect(result.current.canRedo).toBe(false);
    expect(canvasRef.current.clear).toHaveBeenCalled();
  });

  it('should keep track of redo state correctly', () => {
    const canvasRef = createCanvasRef();
    
    const { result } = renderHook(() => useDrawingHistory({
      fabricCanvasRef: canvasRef
    }));
    
    // Create history with multiple states
    act(() => {
      canvasRef.current.getObjects.mockReturnValue([]);
      result.current.saveState();
    });
    
    act(() => {
      canvasRef.current.getObjects.mockReturnValue([{ id: 'object-1' }]);
      result.current.saveState();
    });
    
    act(() => {
      canvasRef.current.getObjects.mockReturnValue([{ id: 'object-1' }, { id: 'object-2' }]);
      result.current.saveState();
    });
    
    // Undo twice
    act(() => {
      result.current.undo();
      result.current.undo();
    });
    
    expect(result.current.canRedo).toBe(true);
    
    // Redo once
    act(() => {
      result.current.redo();
    });
    
    expect(result.current.canRedo).toBe(true);
    
    // Redo again
    act(() => {
      result.current.redo();
    });
    
    expect(result.current.canRedo).toBe(false);
  });
});
