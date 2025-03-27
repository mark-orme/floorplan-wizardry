/**
 * Unit tests for useFloorPlanDrawing hook
 * @module floor-plan/__tests__/useFloorPlanDrawing
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { toast } from 'sonner';
import { 
  useFloorPlanDrawing, 
  calculateFloorPlanAreas, 
  pixelToMeterCoordinates,
  meterToPixelCoordinates,
  isPointInPolygon 
} from '../useFloorPlanDrawing';
import { FloorPlan, Point, Stroke } from '@/types/floorPlanTypes';
import { PIXELS_PER_METER } from '@/constants/numerics';
import { createDefaultFloorPlan } from '@/types/floorPlanTypes';

// Mock dependencies
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

vi.mock('@/utils/geometry', () => ({
  calculateGIA: vi.fn().mockReturnValue(15.5)
}));

vi.mock('@/utils/logger', () => ({
  default: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  }
}));

describe('useFloorPlanDrawing', () => {
  // Mock FloorPlan and canvas refs
  const mockFloorPlan: FloorPlan = createDefaultFloorPlan('1', 'Test Floor Plan');
  
  const mockSetFloorPlan = vi.fn();
  const mockSetGia = vi.fn();
  const mockFabricCanvasRef = { current: { add: vi.fn(), clear: vi.fn(), renderAll: vi.fn() } };
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    vi.resetAllMocks();
  });
  
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useFloorPlanDrawing());
    
    expect(result.current.isDrawing).toBe(false);
    expect(result.current.drawingPoints).toEqual([]);
  });
  
  it('should start drawing when startDrawing is called', () => {
    const { result } = renderHook(() => useFloorPlanDrawing());
    
    const startPoint: Point = { x: 10, y: 10 };
    
    act(() => {
      result.current.startDrawing(startPoint);
    });
    
    expect(result.current.isDrawing).toBe(true);
    expect(result.current.drawingPoints).toEqual([startPoint]);
  });
  
  it('should add points when continueDrawing is called', () => {
    const { result } = renderHook(() => useFloorPlanDrawing());
    
    const startPoint: Point = { x: 10, y: 10 };
    const nextPoint: Point = { x: 20, y: 20 };
    
    act(() => {
      result.current.startDrawing(startPoint);
      result.current.continueDrawing(nextPoint);
    });
    
    expect(result.current.isDrawing).toBe(true);
    expect(result.current.drawingPoints).toEqual([startPoint, nextPoint]);
  });
  
  it('should not add points when continueDrawing is called but not drawing', () => {
    const { result } = renderHook(() => useFloorPlanDrawing());
    
    const nextPoint: Point = { x: 20, y: 20 };
    
    act(() => {
      result.current.continueDrawing(nextPoint);
    });
    
    expect(result.current.isDrawing).toBe(false);
    expect(result.current.drawingPoints).toEqual([]);
  });
  
  it('should update floor plan when endDrawing is called for a stroke', () => {
    const { result } = renderHook(() => useFloorPlanDrawing({
      floorPlan: mockFloorPlan,
      setFloorPlan: mockSetFloorPlan,
      setGia: mockSetGia
    }));
    
    const startPoint: Point = { x: 10, y: 10 };
    const endPoint: Point = { x: 20, y: 20 };
    
    act(() => {
      result.current.startDrawing(startPoint);
      result.current.endDrawing(endPoint);
    });
    
    expect(result.current.isDrawing).toBe(false);
    expect(mockSetFloorPlan).toHaveBeenCalled();
  });
  
  it('should calculate area for closed shapes', () => {
    const { result } = renderHook(() => useFloorPlanDrawing({
      floorPlan: mockFloorPlan,
      setFloorPlan: mockSetFloorPlan,
      setGia: mockSetGia
    }));
    
    // Create a closed shape (first point = last point)
    const startPoint: Point = { x: 10, y: 10 };
    
    act(() => {
      result.current.startDrawing(startPoint);
      result.current.continueDrawing({ x: 20, y: 10 });
      result.current.continueDrawing({ x: 20, y: 20 });
      result.current.continueDrawing({ x: 10, y: 20 });
      result.current.endDrawing(startPoint); // Close the shape
    });
    
    expect(mockSetGia).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalled();
  });
  
  it('should cancel drawing when cancelDrawing is called', () => {
    const { result } = renderHook(() => useFloorPlanDrawing());
    
    const startPoint: Point = { x: 10, y: 10 };
    
    act(() => {
      result.current.startDrawing(startPoint);
      result.current.cancelDrawing();
    });
    
    expect(result.current.isDrawing).toBe(false);
    expect(result.current.drawingPoints).toEqual([]);
  });
});

describe('calculateFloorPlanAreas', () => {
  it('should return empty array if no strokes', () => {
    const mockEmptyFloorPlan: FloorPlan = {
      id: '1',
      name: 'Test Floor',
      label: 'Test Floor',
      walls: [],
      rooms: [],
      strokes: [],
      canvasData: null,
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01'
    };
    
    const result = calculateFloorPlanAreas(mockEmptyFloorPlan);
    
    expect(result).toEqual([]);
  });
  
  it('should calculate areas for floor plan with strokes', () => {
    // Create a floor plan with strokes
    const mockFloorPlanWithStrokes: FloorPlan = {
      id: '1',
      name: 'Test Floor',
      label: 'Test Floor',
      walls: [],
      rooms: [],
      strokes: [
        {
          id: 'stroke-1',
          points: [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 }, { x: 0, y: 0 }],
          type: 'room',
          color: '#000000',
          thickness: 2
        }
      ],
      canvasData: null,
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01'
    };
    
    const result = calculateFloorPlanAreas(mockFloorPlanWithStrokes);
    
    // Should use calculateGIA mock which returns 15.5
    expect(result).toEqual([15.5]);
  });
});

describe('coordinate conversions', () => {
  it('should convert pixel to meter coordinates', () => {
    const pixelPoint: Point = { x: 100, y: 200 };
    const result = pixelToMeterCoordinates(pixelPoint);
    
    expect(result.x).toBe(pixelPoint.x / PIXELS_PER_METER);
    expect(result.y).toBe(pixelPoint.y / PIXELS_PER_METER);
  });
  
  it('should convert meter to pixel coordinates', () => {
    const meterPoint: Point = { x: 1.5, y: 2.5 };
    const result = meterToPixelCoordinates(meterPoint);
    
    expect(result.x).toBe(meterPoint.x * PIXELS_PER_METER);
    expect(result.y).toBe(meterPoint.y * PIXELS_PER_METER);
  });
});

describe('isPointInPolygon', () => {
  it('should return false for polygons with less than 3 points', () => {
    const point: Point = { x: 5, y: 5 };
    const polygon: Point[] = [{ x: 0, y: 0 }, { x: 10, y: 10 }];
    
    const result = isPointInPolygon(point, polygon);
    
    expect(result).toBe(false);
  });
  
  it('should return true for points inside polygons', () => {
    const point: Point = { x: 5, y: 5 };
    const polygon: Point[] = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
      { x: 0, y: 10 }
    ];
    
    const result = isPointInPolygon(point, polygon);
    
    expect(result).toBe(true);
  });
  
  it('should return false for points outside polygons', () => {
    const point: Point = { x: 15, y: 15 };
    const polygon: Point[] = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
      { x: 0, y: 10 }
    ];
    
    const result = isPointInPolygon(point, polygon);
    
    expect(result).toBe(false);
  });
});
