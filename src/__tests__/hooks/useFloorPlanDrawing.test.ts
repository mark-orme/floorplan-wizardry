
/**
 * Tests for the floor plan drawing hook
 * @module __tests__/hooks/useFloorPlanDrawing.test
 */
import { renderHook, act } from '@testing-library/react-hooks';
import { useFloorPlanDrawing } from '@/hooks/floor-plan/useFloorPlanDrawing';
import { Canvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { FloorPlan, Stroke, StrokeTypeLiteral, PaperSize } from '@/types/floorPlanTypes';
import { adaptFloorPlan } from '@/utils/floorPlanAdapter';

// Mock fabric.js
jest.mock('fabric');

// Create a mock floor plan that matches the FloorPlan interface
const mockFloorPlan = adaptFloorPlan({
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
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  metadata: {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    paperSize: PaperSize.A4,
    level: 0
  }
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
    
    // Should update floor plan with the new stroke
    expect(mockSetFloorPlan).toHaveBeenCalled();
    
    // Get the call argument (the function passed to setFloorPlan)
    const updateFn = mockSetFloorPlan.mock.calls[0][0];
    
    // Call the update function with the mock floor plan
    const updatedFloorPlan = updateFn(mockFloorPlan);
    
    // Verify the updated floor plan includes a new stroke with our points
    expect(updatedFloorPlan.strokes?.length).toBe(1);
    expect(updatedFloorPlan.strokes?.[0].points).toEqual([startPoint, endPoint]);
  });
  
  it('should add a stroke when addStroke is called', () => {
    const { result } = renderHook(() => useFloorPlanDrawing({
      fabricCanvasRef: canvasRef,
      tool: DrawingMode.STRAIGHT_LINE,
      floorPlan: mockFloorPlan,
      setFloorPlan: mockSetFloorPlan
    }));
    
    const mockStroke: Stroke = {
      id: 'test-stroke',
      points: [{ x: 100, y: 100 }, { x: 200, y: 200 }],
      type: 'line' as StrokeTypeLiteral,
      color: '#000000',
      thickness: 2,
      width: 2
    };
    
    act(() => {
      result.current.addStroke(mockStroke);
    });
    
    // Should update floor plan with the new stroke
    expect(mockSetFloorPlan).toHaveBeenCalled();
    
    // Get the call argument (the function passed to setFloorPlan)
    const updateFn = mockSetFloorPlan.mock.calls[0][0];
    
    // Call the update function with the mock floor plan
    const updatedFloorPlan = updateFn(mockFloorPlan);
    
    // Verify the updated floor plan includes our stroke
    expect(updatedFloorPlan.strokes?.length).toBe(1);
    expect(updatedFloorPlan.strokes?.[0]).toEqual(mockStroke);
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
});
