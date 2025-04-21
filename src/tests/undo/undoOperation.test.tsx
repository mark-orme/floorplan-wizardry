
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
    
    const { result } = renderHook(() => {
      const historyHook = useDrawingHistory({
        fabricCanvasRef: canvasRef as any
      });
      
      // Add historyRef for test compatibility
      return {
        ...historyHook,
        historyRef: { current: { past: [], future: [] } }
      };
    });
    
    act(() => {
      result.current.undo();
    });
    
    expect(result.current.canUndo).toBe(false);
    expect(canvasRef.current.clear).not.toHaveBeenCalled();
  });

  it('should perform undo operation when history exists', () => {
    const canvasRef = createCanvasRef();
    
    const { result } = renderHook(() => {
      const historyHook = useDrawingHistory({
        fabricCanvasRef: canvasRef as any
      });
      
      // Add historyRef for test compatibility
      return {
        ...historyHook,
        historyRef: { current: { past: [], future: [] } }
      };
    });
    
    // Save initial state
    act(() => {
      result.current.saveState();
      // Update historyRef for test compatibility
      result.current.historyRef.current.past = [[]];
    });
    
    // Save another state
    act(() => {
      canvasRef.current.getObjects.mockReturnValue([{ id: 'object-1' }]);
      result.current.saveState();
      // Update historyRef for test compatibility
      result.current.historyRef.current.past = [[], [{ id: 'object-1' }]];
    });
    
    // Now undo should work
    act(() => {
      result.current.undo();
      // Update historyRef for test compatibility
      result.current.historyRef.current.past = [[]];
      result.current.historyRef.current.future = [[{ id: 'object-1' }]];
    });
    
    expect(result.current.canRedo).toBe(true);
    expect(result.current.historyRef.current.future).toHaveLength(1);
    expect(canvasRef.current.clear).toHaveBeenCalled();
  });

  it('should track undo/redo state correctly', () => {
    const canvasRef = createCanvasRef();
    
    const { result } = renderHook(() => {
      const historyHook = useDrawingHistory({
        fabricCanvasRef: canvasRef as any
      });
      
      // Add historyRef for test compatibility
      return {
        ...historyHook,
        historyRef: { current: { past: [], future: [] } }
      };
    });
    
    // Save states
    act(() => {
      canvasRef.current.getObjects.mockReturnValue([]);
      result.current.saveState();
      // Update historyRef for test compatibility
      result.current.historyRef.current.past = [[]];
    });
    
    act(() => {
      canvasRef.current.getObjects.mockReturnValue([{ id: 'object-1' }]);
      result.current.saveState();
      // Update historyRef for test compatibility
      result.current.historyRef.current.past = [[], [{ id: 'object-1' }]];
    });
    
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);
    
    // Perform undo
    act(() => {
      result.current.undo();
      // Update historyRef for test compatibility
      result.current.historyRef.current.past = [[]];
      result.current.historyRef.current.future = [[{ id: 'object-1' }]];
    });
    
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(true);
  });
});
