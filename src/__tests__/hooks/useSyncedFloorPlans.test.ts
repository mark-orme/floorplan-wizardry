
import { renderHook, act } from '@testing-library/react-hooks';
import { useSyncedFloorPlans } from '@/hooks/useSyncedFloorPlans';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Canvas as FabricCanvas } from 'fabric';
import { FloorPlan } from '@/types/floorPlanTypes';

// Mock the FabricCanvas type for testing
vi.mock('fabric', () => {
  return {
    Canvas: vi.fn().mockImplementation(() => ({
      toJSON: vi.fn().mockReturnValue({ objects: [] }),
      requestRenderAll: vi.fn()
    }))
  };
});

// Mocked FabricCanvas ref that satisfies the type constraints
const createMockCanvasRef = () => ({
  current: {
    toJSON: vi.fn().mockReturnValue({ objects: [] }),
    requestRenderAll: vi.fn()
  } as unknown as FabricCanvas
});

describe('useSyncedFloorPlans', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Clear localStorage mock
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => null);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
  });

  it('should initialize with empty floor plans', () => {
    const mockCanvasRef = createMockCanvasRef();
    
    const { result } = renderHook(() => useSyncedFloorPlans({
      fabricCanvasRef: mockCanvasRef
    }));

    expect(result.current.floorPlans).toEqual([]);
    expect(result.current.currentFloorIndex).toBe(0);
  });

  it('should initialize with provided floor plans', () => {
    const mockCanvasRef = createMockCanvasRef();
    
    const initialFloorPlans: FloorPlan[] = [
      {
        id: 'test-1',
        name: 'Floor 1',
        label: 'Floor 1',
        walls: [],
        rooms: [],
        strokes: [],
        gia: 0,
        level: 0,
        index: 0,
        canvasData: null,
        canvasJson: null,
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
        metadata: {
          createdAt: '2023-01-01',
          updatedAt: '2023-01-01',
          paperSize: 'A4',
          level: 0
        },
        data: {},
        userId: 'test-user'
      }
    ];

    const { result } = renderHook(() => useSyncedFloorPlans({
      initialFloorPlans,
      fabricCanvasRef: mockCanvasRef
    }));

    expect(result.current.floorPlans).toEqual(initialFloorPlans);
    expect(result.current.currentFloorIndex).toBe(0);
  });

  it('should add a new floor plan', () => {
    const mockCanvasRef = createMockCanvasRef();
    
    const { result } = renderHook(() => useSyncedFloorPlans({
      fabricCanvasRef: mockCanvasRef
    }));

    act(() => {
      result.current.addFloorPlan();
    });

    expect(result.current.floorPlans.length).toBe(1);
    expect(result.current.floorPlans[0].name).toBe('Floor 1');
    expect(result.current.currentFloorIndex).toBe(0);
  });

  it('should remove a floor plan', () => {
    const mockCanvasRef = createMockCanvasRef();
    
    const initialFloorPlans: FloorPlan[] = [
      {
        id: 'test-1',
        name: 'Floor 1',
        label: 'Floor 1',
        walls: [],
        rooms: [],
        strokes: [],
        gia: 0,
        level: 0,
        index: 0,
        canvasData: null,
        canvasJson: null,
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
        metadata: {
          createdAt: '2023-01-01',
          updatedAt: '2023-01-01',
          paperSize: 'A4',
          level: 0
        },
        data: {},
        userId: 'test-user'
      },
      {
        id: 'test-2',
        name: 'Floor 2',
        label: 'Floor 2',
        walls: [],
        rooms: [],
        strokes: [],
        gia: 0,
        level: 1,
        index: 1,
        canvasData: null,
        canvasJson: null,
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
        metadata: {
          createdAt: '2023-01-01',
          updatedAt: '2023-01-01',
          paperSize: 'A4',
          level: 1
        },
        data: {},
        userId: 'test-user'
      }
    ];

    const { result } = renderHook(() => useSyncedFloorPlans({
      initialFloorPlans,
      fabricCanvasRef: mockCanvasRef
    }));

    // Set current floor to second floor
    act(() => {
      result.current.setCurrentFloorIndex(1);
    });

    expect(result.current.currentFloorIndex).toBe(1);

    // Remove the second floor
    act(() => {
      result.current.removeFloorPlan(1);
    });

    expect(result.current.floorPlans.length).toBe(1);
    expect(result.current.floorPlans[0].id).toBe('test-1');
    expect(result.current.currentFloorIndex).toBe(0);
  });

  it('should update a floor plan', () => {
    const mockCanvasRef = createMockCanvasRef();
    
    const initialFloorPlans: FloorPlan[] = [
      {
        id: 'test-1',
        name: 'Floor 1',
        label: 'Floor 1',
        walls: [],
        rooms: [],
        strokes: [],
        gia: 0,
        level: 0,
        index: 0,
        canvasData: null,
        canvasJson: null,
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
        metadata: {
          createdAt: '2023-01-01',
          updatedAt: '2023-01-01',
          paperSize: 'A4',
          level: 0
        },
        data: {},
        userId: 'test-user'
      }
    ];

    const { result } = renderHook(() => useSyncedFloorPlans({
      initialFloorPlans,
      fabricCanvasRef: mockCanvasRef
    }));

    const updatedFloorPlan: FloorPlan = {
      ...initialFloorPlans[0],
      name: 'Updated Floor',
      label: 'Updated Floor'
    };

    act(() => {
      result.current.updateFloorPlan(updatedFloorPlan);
    });

    expect(result.current.floorPlans[0].name).toBe('Updated Floor');
    expect(result.current.floorPlans[0].label).toBe('Updated Floor');
  });

  it('should save floor plan with canvas state', async () => {
    const mockCanvasRef = createMockCanvasRef();
    mockCanvasRef.current.toJSON = vi.fn().mockReturnValue({ objects: [{ id: 'obj-1' }] });
    
    const initialFloorPlans: FloorPlan[] = [
      {
        id: 'test-1',
        name: 'Floor 1',
        label: 'Floor 1',
        walls: [],
        rooms: [],
        strokes: [],
        gia: 0,
        level: 0,
        index: 0,
        canvasData: null,
        canvasJson: null,
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
        metadata: {
          createdAt: '2023-01-01',
          updatedAt: '2023-01-01',
          paperSize: 'A4',
          level: 0
        },
        data: {},
        userId: 'test-user'
      }
    ];

    const { result } = renderHook(() => useSyncedFloorPlans({
      initialFloorPlans,
      fabricCanvasRef: mockCanvasRef
    }));

    let savedId: string | null = null;

    await act(async () => {
      savedId = await result.current.saveFloorPlan();
    });

    expect(savedId).toBe('test-1');
    expect(result.current.floorPlans[0].canvasJson).toBeTruthy();
    expect(JSON.parse(result.current.floorPlans[0].canvasJson!).objects).toEqual([{ id: 'obj-1' }]);
  });
});
