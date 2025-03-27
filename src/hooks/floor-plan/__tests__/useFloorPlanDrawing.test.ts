
import { renderHook, act } from '@testing-library/react-hooks';
import { useFloorPlanDrawing } from '../useFloorPlanDrawing';
import { Canvas as FabricCanvas, Path as FabricPath } from 'fabric';
import { createPoint } from '@/types/core/Point';
import { createFloorPlan } from '@/types/floorPlanTypes';

// Mock FabricCanvas and FabricPath
jest.mock('fabric', () => {
  const mockCanvas = {
    add: jest.fn(),
    remove: jest.fn(),
    clear: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
    requestRenderAll: jest.fn(),
    getZoom: jest.fn().mockReturnValue(1),
    viewportTransform: [1, 0, 0, 1, 0, 0],
    absolutePointer: jest.fn().mockReturnValue({ x: 0, y: 0 }),
    relativePointer: jest.fn().mockReturnValue({ x: 0, y: 0 }),
    getObjects: jest.fn().mockReturnValue([]),
    toJSON: jest.fn().mockReturnValue({ objects: [] }),
    loadFromJSON: jest.fn(),
    getCenter: jest.fn().mockReturnValue({ x: 0, y: 0 }),
    setViewportTransform: jest.fn(),
    dispose: jest.fn(),
    freeDrawingBrush: {
      color: '#000000',
      width: 2,
    },
  };

  const mockPath = {
    toObject: jest.fn().mockReturnValue({ type: 'path' }),
    toJSON: jest.fn().mockReturnValue({ type: 'path' }),
  };

  return {
    Canvas: jest.fn(() => mockCanvas),
    Path: jest.fn(() => mockPath),
    __esModule: true,
  };
});

describe('useFloorPlanDrawing', () => {
  let fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  let setFloorPlan: jest.Mock;
  let setGia: jest.Mock;

  beforeEach(() => {
    fabricCanvasRef = { current: new FabricCanvas() } as any;
    setFloorPlan = jest.fn();
    setGia = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize without errors', () => {
    const { result } = renderHook(() =>
      useFloorPlanDrawing({
        fabricCanvasRef,
        setFloorPlan,
        currentFloor: 0,
        setGia,
      })
    );

    expect(result.current).toBeDefined();
  });

  it('should process a created path and update floor plans', () => {
    const { result } = renderHook(() =>
      useFloorPlanDrawing({
        fabricCanvasRef,
        setFloorPlan,
        currentFloor: 0,
        setGia,
      })
    );

    const mockPath = new FabricPath('M 0 0 L 10 10');
    act(() => {
      result.current.processCreatedPath(mockPath);
    });

    expect(setFloorPlan).toHaveBeenCalled();
  });

  it('should calculate GIA when processing a path', () => {
    const { result } = renderHook(() =>
      useFloorPlanDrawing({
        fabricCanvasRef,
        setFloorPlan,
        currentFloor: 0,
        setGia,
      })
    );

    const mockPath = new FabricPath('M 0 0 L 10 10');
    act(() => {
      result.current.processCreatedPath(mockPath);
    });

    expect(setGia).toHaveBeenCalled();
  });

  it('should handle errors when processing a path', () => {
    const { result } = renderHook(() =>
      useFloorPlanDrawing({
        fabricCanvasRef,
        setFloorPlan,
        currentFloor: 0,
        setGia,
      })
    );

    const mockPath = new FabricPath('M 0 0 L 10 10');
    (mockPath.toObject as jest.Mock).mockImplementation(() => {
      throw new Error('Test error');
    });

    act(() => {
      result.current.processCreatedPath(mockPath);
    });

    expect(setFloorPlan).not.toHaveBeenCalled();
  });

  it('should update floor plans with new stroke data', () => {
    const { result } = renderHook(() =>
      useFloorPlanDrawing({
        fabricCanvasRef,
        setFloorPlan,
        currentFloor: 0,
        setGia,
      })
    );

    const mockPath = new FabricPath('M 0 0 L 10 10');
    act(() => {
      result.current.processCreatedPath(mockPath);
    });

    expect(setFloorPlan).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should handle floor plans with existing strokes', () => {
    // Mock floor plan data
    const testFloorPlan = {
      id: "test-id",
      name: "Test Floor Plan",
      label: "Test Floor Plan",
      walls: [] as undefined[],
      rooms: [] as undefined[],
      strokes: [] as undefined[],
      canvasData: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      gia: 0, 
      level: 0
    };

    const { result } = renderHook(() =>
      useFloorPlanDrawing({
        fabricCanvasRef,
        floorPlan: testFloorPlan,
        setFloorPlan,
        currentFloor: 0,
        setGia,
      })
    );

    const mockPath = new FabricPath('M 0 0 L 10 10');
    act(() => {
      result.current.processCreatedPath(mockPath);
    });

    expect(setFloorPlan).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should handle floor plans with existing strokes', () => {
    // Mock floor plan data
    const testFloorPlanWithStrokes = {
      id: "test-id",
      name: "Test Floor Plan",
      label: "Test Floor Plan",
      walls: [] as undefined[],
      rooms: [] as undefined[],
      strokes: [{
        id: "stroke-1",
        points: [{ x: 10, y: 10 }, { x: 20, y: 20 }],
        type: "line",
        color: "#000000",
        thickness: 1
      }],
      canvasData: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      gia: 0,
      level: 0
    };

    const { result } = renderHook(() =>
      useFloorPlanDrawing({
        fabricCanvasRef,
        floorPlan: testFloorPlanWithStrokes,
        setFloorPlan,
        currentFloor: 0,
        setGia,
      })
    );

    const mockPath = new FabricPath('M 0 0 L 10 10');
    act(() => {
      result.current.processCreatedPath(mockPath);
    });

    expect(setFloorPlan).toHaveBeenCalledWith(expect.any(Function));
  });
});
