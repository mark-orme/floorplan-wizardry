
import { renderHook, act } from '@testing-library/react-hooks';
import { useFloorPlanDrawing } from '@/hooks/floor-plan/useFloorPlanDrawing';
import { DrawingMode } from '@/constants/drawingModes';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Canvas } from 'fabric';

describe('useFloorPlanDrawing', () => {
  const mockCanvas = {
    isDrawingMode: false,
    clear: vi.fn(),
    backgroundColor: '#ffffff',
    renderAll: vi.fn(),
  } as unknown as Canvas;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useFloorPlanDrawing({
      fabricCanvasRef: { current: mockCanvas },
      initialTool: DrawingMode.SELECT,
      initialColor: '#000000',
      initialThickness: 2
    }));

    expect(result.current.currentTool).toBe(DrawingMode.SELECT);
    expect(result.current.lineColor).toBe('#000000');
    expect(result.current.lineThickness).toBe(2);
    expect(result.current.isDrawing).toBe(false);
  });

  it('should update tool when setCurrentTool is called', () => {
    const { result } = renderHook(() => useFloorPlanDrawing({
      fabricCanvasRef: { current: mockCanvas },
      initialTool: DrawingMode.SELECT,
      initialColor: '#000000',
      initialThickness: 2
    }));

    act(() => {
      result.current.setCurrentTool(DrawingMode.DRAW);
    });

    expect(result.current.currentTool).toBe(DrawingMode.DRAW);
  });

  it('should update line properties correctly', () => {
    const { result } = renderHook(() => useFloorPlanDrawing({
      fabricCanvasRef: { current: mockCanvas },
      initialTool: DrawingMode.SELECT,
      initialColor: '#000000',
      initialThickness: 2
    }));

    act(() => {
      result.current.setLineColor('#FF0000');
      result.current.setLineThickness(5);
    });

    expect(result.current.lineColor).toBe('#FF0000');
    expect(result.current.lineThickness).toBe(5);
  });

  it('should provide access to canvas instance', () => {
    const { result } = renderHook(() => useFloorPlanDrawing({
      fabricCanvasRef: { current: mockCanvas },
      initialTool: DrawingMode.SELECT
    }));

    expect(result.current.canvas).toBe(mockCanvas);
  });

  it('should handle undo/redo operations', () => {
    const { result } = renderHook(() => useFloorPlanDrawing({
      fabricCanvasRef: { current: mockCanvas },
      initialHistory: [{ id: '1' }] as any[],
      initialTool: DrawingMode.SELECT
    }));

    act(() => {
      result.current.undo();
    });

    expect(result.current.canUndo).toBe(false);

    act(() => {
      result.current.redo();
    });

    expect(result.current.canRedo).toBe(false);
  });
});
