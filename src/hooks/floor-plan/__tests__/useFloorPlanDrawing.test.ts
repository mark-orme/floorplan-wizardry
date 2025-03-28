
/**
 * Tests for the useFloorPlanDrawing hook
 * @module hooks/floor-plan/__tests__/useFloorPlanDrawing.test
 */
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useFloorPlanDrawing } from '../useFloorPlanDrawing';
import { FloorPlan, Stroke, StrokeType, PaperSize } from '@/types/floorPlanTypes';
import { Point } from '@/types/core/Point';

describe('useFloorPlanDrawing', () => {
  // Mock FloorPlan type for testing
  const mockFloorPlan: FloorPlan = {
    id: '1',
    name: 'Floor 1',
    label: 'First Floor', 
    strokes: [],
    walls: [],
    rooms: [],
    level: 0,
    index: 0, // Added missing index property
    gia: 0,
    canvasData: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata: {
      createdAt: Date.now(),
      updatedAt: Date.now(),
      paperSize: PaperSize.A4,
      level: 0
    }
  };
  
  // Mock setFloorPlan for testing
  const mockSetFloorPlan = vi.fn();
  const mockSetGia = vi.fn();
  
  it('initializes with the correct state', () => {
    const { result } = renderHook(() => useFloorPlanDrawing({
      floorPlan: mockFloorPlan,
      setFloorPlan: mockSetFloorPlan,
      setGia: mockSetGia
    }));
    
    expect(result.current.isDrawing).toBe(false);
    expect(result.current.drawingPoints).toEqual([]);
    expect(result.current.currentPoint).toBeNull();
  });
  
  it('updates state when starting drawing', () => {
    const { result } = renderHook(() => useFloorPlanDrawing({
      floorPlan: mockFloorPlan,
      setFloorPlan: mockSetFloorPlan,
      setGia: mockSetGia
    }));
    
    const testPoint: Point = { x: 100, y: 100 } as Point;
    
    act(() => {
      result.current.startDrawing(testPoint);
    });
    
    expect(result.current.isDrawing).toBe(true);
    expect(result.current.drawingPoints).toContainEqual(testPoint);
    expect(result.current.currentPoint).toEqual(testPoint);
  });
  
  it('continues drawing by adding points', () => {
    const { result } = renderHook(() => useFloorPlanDrawing({
      floorPlan: mockFloorPlan,
      setFloorPlan: mockSetFloorPlan,
      setGia: mockSetGia
    }));
    
    const startPoint: Point = { x: 100, y: 100 } as Point;
    const nextPoint: Point = { x: 150, y: 150 } as Point;
    
    act(() => {
      result.current.startDrawing(startPoint);
      result.current.continueDrawing(nextPoint);
    });
    
    expect(result.current.isDrawing).toBe(true);
    expect(result.current.drawingPoints.length).toBe(2);
    expect(result.current.currentPoint).toEqual(nextPoint);
  });
  
  it('ends drawing and updates the floor plan', () => {
    const { result } = renderHook(() => useFloorPlanDrawing({
      floorPlan: mockFloorPlan,
      setFloorPlan: mockSetFloorPlan,
      setGia: mockSetGia
    }));
    
    const startPoint: Point = { x: 100, y: 100 } as Point;
    const endPoint: Point = { x: 200, y: 200 } as Point;
    
    act(() => {
      result.current.startDrawing(startPoint);
      result.current.endDrawing(endPoint);
    });
    
    expect(result.current.isDrawing).toBe(false);
    expect(mockSetFloorPlan).toHaveBeenCalled();
  });
  
  it('cancels drawing correctly', () => {
    const { result } = renderHook(() => useFloorPlanDrawing({
      floorPlan: mockFloorPlan,
      setFloorPlan: mockSetFloorPlan,
      setGia: mockSetGia
    }));
    
    const testPoint: Point = { x: 100, y: 100 } as Point;
    
    act(() => {
      result.current.startDrawing(testPoint);
      result.current.cancelDrawing();
    });
    
    expect(result.current.isDrawing).toBe(false);
    expect(result.current.drawingPoints).toEqual([]);
    expect(result.current.currentPoint).toBeNull();
  });
  
  it('can add strokes directly', () => {
    // Setup mock floor plans array
    const mockFloorPlans = [mockFloorPlan];
    const mockSetFloorPlans = vi.fn();
    
    const { result } = renderHook(() => useFloorPlanDrawing({
      floorPlans: mockFloorPlans,
      currentFloor: 0,
      setFloorPlans: mockSetFloorPlans
    }));
    
    const newStroke = {
      id: "test-stroke-1",
      points: [{ x: 10, y: 10 }, { x: 20, y: 20 }],
      type: "line" as StrokeType,
      color: "#000000",
      thickness: 2,
      width: 2 // Add width property
    };
    
    act(() => {
      result.current.addStroke(newStroke);
    });
    
    expect(mockSetFloorPlans).toHaveBeenCalled();
  });
  
  it('can start drawing at a point (alias method)', () => {
    const { result } = renderHook(() => useFloorPlanDrawing({
      floorPlan: mockFloorPlan,
      setFloorPlan: mockSetFloorPlan
    }));
    
    const testPoint: Point = { x: 100, y: 100 } as Point;
    
    act(() => {
      result.current.startDrawingAt(testPoint);
    });
    
    expect(result.current.isDrawing).toBe(true);
    expect(result.current.currentPoint).toEqual(testPoint);
  });
  
  it('can calculate areas for the floor plan', () => {
    const floorPlanWithStrokes = {
      ...mockFloorPlan,
      strokes: [{
        id: "test-stroke-1",
        points: [{ x: 10, y: 10 }, { x: 20, y: 20 }],
        type: "line" as StrokeType,
        color: "#000000",
        thickness: 2,
        width: 2 // Add width property
      }]
    };
    
    const { result } = renderHook(() => useFloorPlanDrawing({
      floorPlan: floorPlanWithStrokes,
      setFloorPlan: mockSetFloorPlan
    }));
    
    const areas = result.current.calculateAreas();
    expect(areas.length).toBeGreaterThan(0);
  });
});
