import { renderHook, act } from '@testing-library/react';
import { Canvas as FabricCanvas } from 'fabric';
import { useFloorPlanDrawing } from '@/hooks/floor-plan/useFloorPlanDrawing';
import { createEmptyFloorPlan } from '@/types/floorPlan';
import { DrawingMode } from '@/constants/drawingModes';

describe('useFloorPlanDrawing', () => {
  const mockCanvas = {} as FabricCanvas;
  const fabricCanvasRef = { current: mockCanvas };
  const floorPlan = createEmptyFloorPlan();
  const onFloorPlanUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useFloorPlanDrawing({
      fabricCanvasRef,
      floorPlan,
      tool: DrawingMode.SELECT,
      onFloorPlanUpdate
    }));

    expect(result.current.isDrawing).toBe(false);
  });

  it('should handle tool change (mock test only)', () => {
    const { result } = renderHook(() => useFloorPlanDrawing({
      fabricCanvasRef,
      floorPlan,
      tool: DrawingMode.SELECT,
      onFloorPlanUpdate
    }));

    expect(result.current.isDrawing).toBe(false);
    
    act(() => {
      result.current.setIsDrawing(true);
    });
    
    expect(result.current.isDrawing).toBe(true);
  });

  it('should create strokes with the correct type', () => {
    const { result } = renderHook(() => useFloorPlanDrawing({
      fabricCanvasRef,
      floorPlan,
      tool: DrawingMode.DRAW,
      onFloorPlanUpdate
    }));

    act(() => {
      result.current.addStroke();
    });

    expect(mockCanvas.add).toHaveBeenCalled();
  });

  it('should update floor plan when changes occur', () => {
    const { result } = renderHook(() => useFloorPlanDrawing({
      fabricCanvasRef,
      floorPlan,
      tool: DrawingMode.SELECT,
      onFloorPlanUpdate
    }));

    act(() => {
      result.current.addStroke();
    });

    expect(onFloorPlanUpdate).toHaveBeenCalled();
  });

  it('should handle adding a wall', () => {
    const { result } = renderHook(() => useFloorPlanDrawing({
      fabricCanvasRef,
      floorPlan,
      tool: DrawingMode.WALL,
      onFloorPlanUpdate
    }));

    act(() => {
      result.current.addWall();
    });

    expect(mockCanvas.add).toHaveBeenCalled();
  });
});
