
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useFloorPlanDrawing } from '../useFloorPlanDrawing';
import { FloorPlan, StrokeType } from '@/types/floorPlanTypes';
import { createFloorPlan } from '@/types/core/FloorPlan';

// Mock canvas
const mockCanvas = {
  on: vi.fn(),
  off: vi.fn(),
  add: vi.fn(),
  remove: vi.fn(),
  getActiveObject: vi.fn(),
  discardActiveObject: vi.fn(),
  renderAll: vi.fn()
};

// Mock gesture handler
const mockGestureHandler = {
  register: vi.fn(),
  unregister: vi.fn()
};

// Update interface to match actual implementation
interface MockUseFloorPlanDrawingProps {
  fabricCanvasRef: { current: any };
  refState: any;
  gestureHandler: any;
}

describe('useFloorPlanDrawing', () => {
  let mockFabricCanvasRef: any;
  let mockRefState: any;

  beforeEach(() => {
    mockFabricCanvasRef = { current: mockCanvas };
    mockRefState = { 
      history: { past: [], future: [] },
      currentFloor: 0
    };
    
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should initialize drawing state', () => {
    const { result } = renderHook(() => useFloorPlanDrawing({
      fabricCanvasRef: mockFabricCanvasRef,
      refState: mockRefState,
      gestureHandler: mockGestureHandler
    } as MockUseFloorPlanDrawingProps));

    // Update these expectations to match the actual implementation
    expect(result.current.isDrawing).toBe(false);
    expect(result.current.activeTool).toBe('select');
  });

  it('should update drawing tool', () => {
    const { result } = renderHook(() => useFloorPlanDrawing({
      fabricCanvasRef: mockFabricCanvasRef,
      refState: mockRefState,
      gestureHandler: mockGestureHandler
    } as MockUseFloorPlanDrawingProps));

    act(() => {
      result.current.setActiveTool?.('wall');
    });

    expect(result.current.activeTool).toBe('wall');
  });

  it('should add stroke to floor plan', () => {
    // Create a valid floor plan
    const testFloorPlan: FloorPlan = createFloorPlan('test-floor-plan', 'Test Floor Plan', 0);
    
    mockRefState.floorPlans = [testFloorPlan];
    mockRefState.setFloorPlans = vi.fn();

    const { result } = renderHook(() => useFloorPlanDrawing({
      fabricCanvasRef: mockFabricCanvasRef,
      refState: mockRefState,
      gestureHandler: mockGestureHandler
    } as MockUseFloorPlanDrawingProps));

    const stroke = {
      id: 'test-stroke',
      points: [{ x: 0, y: 0 }, { x: 100, y: 100 }],
      type: 'line' as StrokeType,
      color: '#000000',
      thickness: 2
    };

    act(() => {
      result.current.addStroke(stroke);
    });

    expect(mockRefState.setFloorPlans).toHaveBeenCalled();
  });

  it('should handle drawing start and end', () => {
    const { result } = renderHook(() => useFloorPlanDrawing({
      fabricCanvasRef: mockFabricCanvasRef,
      refState: mockRefState,
      gestureHandler: mockGestureHandler
    } as MockUseFloorPlanDrawingProps));

    act(() => {
      result.current.startDrawingAt({ x: 0, y: 0 });
    });

    expect(result.current.isDrawing).toBe(true);
    expect(result.current.currentPoint).toEqual({ x: 0, y: 0 });

    act(() => {
      result.current.endDrawing({ x: 100, y: 100 });
    });

    expect(result.current.isDrawing).toBe(false);
  });
});
