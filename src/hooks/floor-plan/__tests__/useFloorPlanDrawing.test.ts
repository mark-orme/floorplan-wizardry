
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useFloorPlanDrawing } from '../useFloorPlanDrawing';
import { FloorPlan, StrokeType } from '@/types/floorPlanTypes';
import { createFloorPlan } from '@/utils/floorPlanUtils';

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

describe('useFloorPlanDrawing', () => {
  let mockCanvasRef: any;
  let mockRefState: any;

  beforeEach(() => {
    mockCanvasRef = { current: mockCanvas };
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
      canvasRef: mockCanvasRef,
      refState: mockRefState,
      gestureHandler: mockGestureHandler
    }));

    expect(result.current.isDrawing).toBe(false);
    expect(result.current.currentTool).toBe('select');
  });

  it('should update drawing tool', () => {
    const { result } = renderHook(() => useFloorPlanDrawing({
      canvasRef: mockCanvasRef,
      refState: mockRefState,
      gestureHandler: mockGestureHandler
    }));

    act(() => {
      result.current.setTool('wall');
    });

    expect(result.current.currentTool).toBe('wall');
  });

  it('should add stroke to floor plan', () => {
    // Create a valid floor plan
    const testFloorPlan: FloorPlan = {
      id: 'test-floor-plan',
      name: 'Test Floor Plan',
      label: 'Ground Floor',
      walls: [],
      rooms: [],
      strokes: [],
      canvasData: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      gia: 0,
      level: 0
    };
    
    mockRefState.floorPlans = [testFloorPlan];
    mockRefState.setFloorPlans = vi.fn();

    const { result } = renderHook(() => useFloorPlanDrawing({
      canvasRef: mockCanvasRef,
      refState: mockRefState,
      gestureHandler: mockGestureHandler
    }));

    const stroke = {
      id: 'test-stroke',
      points: [{ x: 0, y: 0 }, { x: 100, y: 100 }],
      type: 'line' as StrokeType,
      color: '#000000',
      thickness: 2
    };

    act(() => {
      result.current.addStrokeToFloorPlan(stroke);
    });

    expect(mockRefState.setFloorPlans).toHaveBeenCalled();
  });

  it('should handle drawing start and end', () => {
    const { result } = renderHook(() => useFloorPlanDrawing({
      canvasRef: mockCanvasRef,
      refState: mockRefState,
      gestureHandler: mockGestureHandler
    }));

    act(() => {
      result.current.startDrawing({ x: 0, y: 0 });
    });

    expect(result.current.isDrawing).toBe(true);
    expect(result.current.startPoint).toEqual({ x: 0, y: 0 });

    act(() => {
      result.current.endDrawing({ x: 100, y: 100 });
    });

    expect(result.current.isDrawing).toBe(false);
  });
});
