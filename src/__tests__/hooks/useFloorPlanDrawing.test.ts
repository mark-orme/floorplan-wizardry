
/**
 * Tests for useFloorPlanDrawing hook
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react-hooks';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useFloorPlanDrawing } from '@/hooks/floor-plan/useFloorPlanDrawing';
import { DrawingMode } from '@/constants/drawingModes';
import { createMockFloorPlan } from '@/utils/testing/mockFloorPlanFactory';
import { asCanvasMock, createCanvasRef } from '@/__tests__/utils/typeHelpers';
import { ICanvasMock, createMinimalCanvasMock } from '@/types/testing/ICanvasMock';
import { FloorPlan } from '@/types/floorPlanTypes';

describe('useFloorPlanDrawing', () => {
  let mockCanvas: ICanvasMock;
  let mockCanvasRef: React.MutableRefObject<ICanvasMock>;
  let mockFloorPlan: FloorPlan;
  let setFloorPlan: jest.Mock;

  beforeEach(() => {
    // Set up mock canvas
    mockCanvas = createMinimalCanvasMock();
    mockCanvasRef = createCanvasRef(mockCanvas);
    
    // Create a test floor plan
    mockFloorPlan = createMockFloorPlan();
    
    // Mock setFloorPlan function
    setFloorPlan = vi.fn();
  });

  it('should initialize with default values', () => {
    // Render the hook
    const { result } = renderHook(() => useFloorPlanDrawing({
      fabricCanvasRef: mockCanvasRef as any,
      tool: DrawingMode.SELECT,
      floorPlan: mockFloorPlan,
      setFloorPlan
    }));

    // Check initial state
    expect(result.current.isDrawing).toBe(false);
    expect(result.current.drawingPoints).toEqual([]);
    expect(result.current.currentPoint).toBeNull();
  });

  it('should handle startDrawing', () => {
    // Render the hook
    const { result } = renderHook(() => useFloorPlanDrawing({
      fabricCanvasRef: mockCanvasRef as any,
      tool: DrawingMode.LINE,
      floorPlan: mockFloorPlan,
      setFloorPlan
    }));

    // Start drawing
    act(() => {
      result.current.startDrawing({ x: 10, y: 20 });
    });

    // Check that drawing state is updated
    expect(result.current.isDrawing).toBe(true);
    expect(result.current.drawingPoints).toEqual([{ x: 10, y: 20 }]);
    expect(result.current.currentPoint).toEqual({ x: 10, y: 20 });
  });

  it('should handle continueDrawing', () => {
    // Render the hook
    const { result } = renderHook(() => useFloorPlanDrawing({
      fabricCanvasRef: mockCanvasRef as any,
      tool: DrawingMode.LINE,
      floorPlan: mockFloorPlan,
      setFloorPlan
    }));

    // Start and continue drawing
    act(() => {
      result.current.startDrawing({ x: 10, y: 20 });
      result.current.continueDrawing({ x: 30, y: 40 });
    });

    // Check that drawing state is updated
    expect(result.current.isDrawing).toBe(true);
    expect(result.current.drawingPoints).toEqual([{ x: 10, y: 20 }, { x: 30, y: 40 }]);
    expect(result.current.currentPoint).toEqual({ x: 30, y: 40 });
  });

  it('should handle endDrawing and create a new stroke', () => {
    // Render the hook
    const { result } = renderHook(() => useFloorPlanDrawing({
      fabricCanvasRef: mockCanvasRef as any,
      tool: DrawingMode.LINE,
      floorPlan: mockFloorPlan,
      setFloorPlan
    }));

    // Complete a drawing sequence
    act(() => {
      result.current.startDrawing({ x: 10, y: 20 });
      result.current.continueDrawing({ x: 30, y: 40 });
      result.current.endDrawing({ x: 50, y: 60 });
    });

    // Check that drawing state is reset
    expect(result.current.isDrawing).toBe(false);
    expect(result.current.currentPoint).toBeNull();
    
    // Check that setFloorPlan was called
    expect(setFloorPlan).toHaveBeenCalled();
    
    // Get the function passed to setFloorPlan
    const updateFn = setFloorPlan.mock.calls[0][0];
    const updatedFloorPlan = updateFn(mockFloorPlan);
    
    // Check that a new stroke was added
    expect(updatedFloorPlan.strokes.length).toBe(mockFloorPlan.strokes.length + 1);
    
    // Check the new stroke properties
    const newStroke = updatedFloorPlan.strokes[updatedFloorPlan.strokes.length - 1];
    expect(newStroke.type).toBe('line');
    expect(newStroke.points).toEqual([{ x: 10, y: 20 }, { x: 30, y: 40 }, { x: 50, y: 60 }]);
  });

  it('should handle cancelDrawing', () => {
    // Render the hook
    const { result } = renderHook(() => useFloorPlanDrawing({
      fabricCanvasRef: mockCanvasRef as any,
      tool: DrawingMode.LINE,
      floorPlan: mockFloorPlan,
      setFloorPlan
    }));

    // Start drawing then cancel
    act(() => {
      result.current.startDrawing({ x: 10, y: 20 });
      result.current.continueDrawing({ x: 30, y: 40 });
      result.current.cancelDrawing();
    });

    // Check that drawing state is reset
    expect(result.current.isDrawing).toBe(false);
    expect(result.current.drawingPoints).toEqual([]);
    expect(result.current.currentPoint).toBeNull();
    
    // Check that setFloorPlan was not called
    expect(setFloorPlan).not.toHaveBeenCalled();
  });

  it('should handle addStroke', () => {
    // Render the hook
    const { result } = renderHook(() => useFloorPlanDrawing({
      fabricCanvasRef: mockCanvasRef as any,
      tool: DrawingMode.LINE,
      floorPlan: mockFloorPlan,
      setFloorPlan
    }));

    // Add a stroke directly
    const newStroke = {
      id: 'test-stroke-id',
      points: [{ x: 10, y: 20 }, { x: 30, y: 40 }],
      type: 'line',
      color: '#ff0000',
      thickness: 3,
      width: 3
    };
    
    act(() => {
      result.current.addStroke(newStroke);
    });

    // Check that setFloorPlan was called
    expect(setFloorPlan).toHaveBeenCalled();
    
    // Get the function passed to setFloorPlan
    const updateFn = setFloorPlan.mock.calls[0][0];
    const updatedFloorPlan = updateFn(mockFloorPlan);
    
    // Check that a new stroke was added
    expect(updatedFloorPlan.strokes.length).toBe(mockFloorPlan.strokes.length + 1);
    
    // Check the new stroke properties
    const addedStroke = updatedFloorPlan.strokes[updatedFloorPlan.strokes.length - 1];
    expect(addedStroke).toEqual(newStroke);
  });

  it('should calculate areas', () => {
    // Create a floor plan with rooms
    const floorPlanWithRooms = {
      ...mockFloorPlan,
      rooms: [
        { id: 'room1', name: 'Room 1', area: 50, points: [], color: '#cccccc', level: 0, type: 'living', walls: [] },
        { id: 'room2', name: 'Room 2', area: 75, points: [], color: '#dddddd', level: 0, type: 'bedroom', walls: [] }
      ]
    };
    
    // Render the hook
    const { result } = renderHook(() => useFloorPlanDrawing({
      fabricCanvasRef: mockCanvasRef as any,
      tool: DrawingMode.SELECT,
      floorPlan: floorPlanWithRooms,
      setFloorPlan
    }));

    // Calculate areas
    const areas = result.current.calculateAreas();
    
    // Check that areas were calculated correctly
    expect(areas).toEqual([50, 75]);
  });

  it('should drawFloorPlan to canvas', () => {
    // Render the hook
    const { result } = renderHook(() => useFloorPlanDrawing({
      fabricCanvasRef: mockCanvasRef as any,
      tool: DrawingMode.SELECT,
      floorPlan: mockFloorPlan,
      setFloorPlan
    }));

    // Draw floor plan
    act(() => {
      result.current.drawFloorPlan(mockCanvas as any, mockFloorPlan);
    });
    
    // Check that canvas methods were called
    expect(mockCanvas.getObjects).toHaveBeenCalled();
    expect(mockCanvas.remove).toHaveBeenCalled();
    expect(mockCanvas.requestRenderAll).toHaveBeenCalled();
  });
});
