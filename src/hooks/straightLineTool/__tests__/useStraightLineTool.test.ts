
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useStraightLineTool } from '../useStraightLineTool';

// Mock dependencies
vi.mock('@/utils/logger', () => ({
  toolsLogger: {
    debug: vi.fn(),
    error: vi.fn(),
    info: vi.fn()
  }
}));

vi.mock('../useLineEvents', () => ({
  useLineEvents: () => ({
    handleMouseDown: vi.fn(),
    handleMouseMove: vi.fn(),
    handleMouseUp: vi.fn(),
    handleKeyDown: vi.fn(),
    cancelDrawing: vi.fn()
  })
}));

vi.mock('../useLineDistance', () => ({
  useLineDistance: () => ({
    calculateDistance: vi.fn((start, end) => Math.sqrt(
      Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
    )),
    updateDistanceTooltip: vi.fn(),
    getMidpoint: vi.fn((start, end) => ({
      x: (start.x + end.x) / 2,
      y: (start.y + end.y) / 2
    }))
  })
}));

describe('useStraightLineTool', () => {
  // Basic initialization test
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useStraightLineTool({
      isEnabled: true,
      canvas: null,
      lineColor: '#000000',
      lineThickness: 2
    }));
    
    expect(result.current).toBeDefined();
    expect(result.current.isActive).toBe(true);
    expect(result.current.snapEnabled).toBe(true);
  });
  
  // Basic mock tests - avoid using skip
  it('handles drawing operations', () => {
    const mockCanvas = {
      add: vi.fn(),
      remove: vi.fn(),
      renderAll: vi.fn()
    } as any;
    
    const { result } = renderHook(() => useStraightLineTool({
      isEnabled: true,
      canvas: mockCanvas,
      lineColor: '#000000',
      lineThickness: 2
    }));
    
    // Test grid snapping toggle
    act(() => {
      if (result.current.toggleGridSnapping) {
        result.current.toggleGridSnapping();
      }
    });
    
    expect(result.current.snapEnabled).toBe(false);
  });
});
