
/**
 * Tests for the floor plan drawing hook
 * @module __tests__/hooks/useFloorPlanDrawing.test
 */
import { renderHook, act } from '@testing-library/react-hooks';
import { useFloorPlanDrawing } from '@/hooks/floor-plan/useFloorPlanDrawing';
import { Canvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { FloorPlan } from '@/types/floorPlanTypes';
import { createEmptyFloorPlan } from '@/types/floor-plan/factoryFunctions';

// Mock fabric.js
jest.mock('fabric');

// Create a mock floor plan that matches the FloorPlan interface
const mockFloorPlan = createEmptyFloorPlan({
  id: 'floor-1',
  name: 'Floor 1',
  label: 'First Floor',
  index: 0,
  strokes: [],
  walls: [],
  rooms: [],
  level: 0,
  gia: 0,
  canvasData: null,
  canvasJson: null,
  metadata: {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    paperSize: 'A4',
    level: 0
  },
  data: {},
  userId: 'test-user-id'
});

// Create mock setFloorPlan function
const mockSetFloorPlan = jest.fn();

describe('useFloorPlanDrawing', () => {
  let canvas: Canvas;
  let canvasRef: React.MutableRefObject<Canvas | null>;
  
  beforeEach(() => {
    // Create a new canvas instance for each test
    canvas = new Canvas(document.createElement('canvas'));
    canvasRef = { current: canvas };
    
    // Reset mocks
    mockSetFloorPlan.mockReset();
  });
  
  afterEach(() => {
    canvas = null as unknown as Canvas;
    canvasRef.current = null;
  });
  
  it('should initialize with isDrawing set to false', () => {
    const { result } = renderHook(() => useFloorPlanDrawing({
      fabricCanvasRef: canvasRef,
      tool: DrawingMode.STRAIGHT_LINE,
      floorPlan: mockFloorPlan,
      setFloorPlan: mockSetFloorPlan
    }));
    
    expect(result.current.isDrawing).toBe(false);
    expect(result.current.drawingPoints).toEqual([]);
    expect(result.current.currentPoint).toBeNull();
  });
  
  it('should start drawing when startDrawing is called', () => {
    const { result } = renderHook(() => useFloorPlanDrawing({
      fabricCanvasRef: canvasRef,
      tool: DrawingMode.STRAIGHT_LINE,
      floorPlan: mockFloorPlan,
      setFloorPlan: mockSetFloorPlan
    }));
    
    const point = { x: 100, y: 100 };
    
    act(() => {
      result.current.startDrawing(point);
    });
    
    expect(result.current.isDrawing).toBe(true);
    expect(result.current.drawingPoints).toEqual([point]);
    expect(result.current.currentPoint).toEqual(point);
  });
  
  it('should continue drawing when continueDrawing is called', () => {
    const { result } = renderHook(() => useFloorPlanDrawing({
      fabricCanvasRef: canvasRef,
      tool: DrawingMode.STRAIGHT_LINE,
      floorPlan: mockFloorPlan,
      setFloorPlan: mockSetFloorPlan
    }));
    
    const startPoint = { x: 100, y: 100 };
    const movePoint = { x: 150, y: 150 };
    
    act(() => {
      result.current.startDrawing(startPoint);
    });
    
    act(() => {
      result.current.continueDrawing(movePoint);
    });
    
    expect(result.current.isDrawing).toBe(true);
    expect(result.current.drawingPoints).toEqual([startPoint, movePoint]);
    expect(result.current.currentPoint).toEqual(movePoint);
  });
  
  it('should end drawing and update floor plan when endDrawing is called', () => {
    const { result } = renderHook(() => useFloorPlanDrawing({
      fabricCanvasRef: canvasRef,
      tool: DrawingMode.STRAIGHT_LINE,
      floorPlan: mockFloorPlan,
      setFloorPlan: mockSetFloorPlan
    }));
    
    const startPoint = { x: 100, y: 100 };
    const endPoint = { x: 200, y: 200 };
    
    act(() => {
      result.current.startDrawing(startPoint);
    });
    
    act(() => {
      result.current.endDrawing(endPoint);
    });
    
    expect(result.current.isDrawing).toBe(false);
    expect(result.current.drawingPoints).toEqual([startPoint, endPoint]);
    expect(result.current.currentPoint).toBeNull();
  });
  
  it('should add a stroke when addStroke is called', () => {
    const { result } = renderHook(() => useFloorPlanDrawing({
      fabricCanvasRef: canvasRef,
      tool: DrawingMode.STRAIGHT_LINE,
      floorPlan: mockFloorPlan,
      setFloorPlan: mockSetFloorPlan
    }));
    
    const mockStroke = {
      id: 'test-stroke',
      points: [{ x: 100, y: 100 }, { x: 200, y: 200 }],
      type: 'line' as const,
      color: '#000000',
      thickness: 2,
      width: 2
    };
    
    act(() => {
      result.current.addStroke(mockStroke);
    });
  });
  
  it('should calculate areas when calculateAreas is called', () => {
    const { result } = renderHook(() => useFloorPlanDrawing({
      fabricCanvasRef: canvasRef,
      tool: DrawingMode.STRAIGHT_LINE,
      floorPlan: mockFloorPlan,
      setFloorPlan: mockSetFloorPlan
    }));
    
    const areas = result.current.calculateAreas();
    
    // Currently returns a mock value of 100
    expect(areas).toEqual([100]);
  });
  
  it('should cancel drawing when cancelDrawing is called', () => {
    const { result } = renderHook(() => useFloorPlanDrawing({
      fabricCanvasRef: canvasRef,
      tool: DrawingMode.STRAIGHT_LINE,
      floorPlan: mockFloorPlan,
      setFloorPlan: mockSetFloorPlan
    }));
    
    const startPoint = { x: 100, y: 100 };
    
    act(() => {
      result.current.startDrawing(startPoint);
    });
    
    // Verify drawing started
    expect(result.current.isDrawing).toBe(true);
    
    act(() => {
      result.current.cancelDrawing();
    });
    
    // Verify drawing was canceled
    expect(result.current.isDrawing).toBe(false);
    expect(result.current.drawingPoints).toEqual([]);
    expect(result.current.currentPoint).toBeNull();
  });
  
  it('should draw a floor plan to canvas', () => {
    const mockFloorPlanWithRooms = {
      ...mockFloorPlan,
      rooms: [{ id: 'room-1', name: 'Living Room', points: [], area: 100, color: '#ff0000', level: 0, type: 'living', walls: [] }],
      walls: [{ id: 'wall-1', start: { x: 0, y: 0 }, end: { x: 100, y: 0 }, points: [], thickness: 5, color: '#000000', roomIds: [], length: 100 }]
    };
    
    const { result } = renderHook(() => useFloorPlanDrawing({
      fabricCanvasRef: canvasRef,
      tool: DrawingMode.STRAIGHT_LINE,
      floorPlan: mockFloorPlanWithRooms,
      setFloorPlan: mockSetFloorPlan
    }));
    
    // Make canvas have getObjects method
    canvasRef.current = {
      ...canvasRef.current,
      getObjects: jest.fn().mockReturnValue([]),
      remove: jest.fn(),
      requestRenderAll: jest.fn()
    };
    
    act(() => {
      result.current.drawFloorPlan(canvasRef.current as any, mockFloorPlanWithRooms);
    });
  });
});
