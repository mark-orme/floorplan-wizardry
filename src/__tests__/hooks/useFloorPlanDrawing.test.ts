
/**
 * Tests for useFloorPlanDrawing hook
 * @module __tests__/hooks/useFloorPlanDrawing.test
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFloorPlanDrawing } from '@/hooks/useFloorPlanDrawing';
import { Canvas } from 'fabric';
import { asMockCanvas } from '@/types/testing/ICanvasMock';
import { createWithImplementationMock } from '@/utils/canvasMockUtils';
import {
  FloorPlan,
  Stroke,
  asStrokeType,
  asRoomType,
  createTestFloorPlan,
  createTestStroke,
  createTestRoom,
  createTestWall
} from '@/types/floor-plan/unifiedTypes';

// Mock the canvas
vi.mock('fabric', () => {
  return {
    Canvas: vi.fn().mockImplementation(() => ({
      add: vi.fn(),
      remove: vi.fn(),
      getObjects: vi.fn().mockReturnValue([]),
      renderAll: vi.fn(),
      requestRenderAll: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
      // Fix: Ensure withImplementation returns Promise<void>
      withImplementation: createWithImplementationMock()
    }))
  };
});

describe('useFloorPlanDrawing', () => {
  let mockCanvas: any;
  
  beforeEach(() => {
    mockCanvas = {
      add: vi.fn(),
      remove: vi.fn(),
      getObjects: vi.fn().mockReturnValue([]),
      renderAll: vi.fn(),
      requestRenderAll: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
      // Fix: Ensure withImplementation returns Promise<void>
      withImplementation: createWithImplementationMock()
    };
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useFloorPlanDrawing({
      canvas: asMockCanvas(mockCanvas),
      floorPlan: createTestFloorPlan()
    }));
    
    expect(result.current.isDrawing).toBe(false);
    expect(result.current.tool).toBe('select');
  });

  it('should handle tool change', () => {
    const { result } = renderHook(() => useFloorPlanDrawing({
      canvas: asMockCanvas(mockCanvas),
      floorPlan: createTestFloorPlan()
    }));
    
    act(() => {
      result.current.setTool('wall');
    });
    
    expect(result.current.tool).toBe('wall');
  });

  it('should create strokes with the correct type', () => {
    // Arrange
    const testFloorPlan = createTestFloorPlan();
    const { result } = renderHook(() => useFloorPlanDrawing({
      canvas: asMockCanvas(mockCanvas),
      floorPlan: testFloorPlan
    }));
    
    // Act
    act(() => {
      result.current.setTool('wall');
      const myStroke = createTestStroke({
        type: asStrokeType('wall')
      });
      result.current.addStroke(myStroke);
    });
    
    // Assert
    expect(mockCanvas.add).toHaveBeenCalled();
  });

  it('should update floor plan when changes occur', () => {
    // Arrange
    const updateFloorPlan = vi.fn();
    const testFloorPlan = createTestFloorPlan();
    
    // Act
    const { result } = renderHook(() => useFloorPlanDrawing({
      canvas: asMockCanvas(mockCanvas),
      floorPlan: testFloorPlan,
      onFloorPlanUpdate: updateFloorPlan
    }));
    
    act(() => {
      // Adding a stroke with the correct type
      const stroke = createTestStroke({
        type: asStrokeType('line')
      });
      result.current.addStroke(stroke);
    });
    
    // Assert
    expect(updateFloorPlan).toHaveBeenCalled();
  });
  
  it('should handle adding a room', () => {
    // Arrange
    const testFloorPlan = createTestFloorPlan({
      rooms: [],
      walls: [createTestWall()]
    });
    
    const { result } = renderHook(() => useFloorPlanDrawing({
      canvas: asMockCanvas(mockCanvas),
      floorPlan: testFloorPlan
    }));
    
    // Act
    act(() => {
      const room = createTestRoom({
        type: asRoomType('living')
      });
      result.current.addRoom(room);
    });
    
    // Assert
    expect(mockCanvas.add).toHaveBeenCalled();
  });
});
