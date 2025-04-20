
/**
 * Tests for useFloorPlanDrawing hook
 * @module __tests__/hooks/useFloorPlanDrawing.test
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFloorPlanDrawing } from '@/hooks/useFloorPlanDrawing';
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
import { createTypedMockCanvas } from '@/utils/canvasMockUtils';

describe('useFloorPlanDrawing', () => {
  let mockCanvas: any;
  
  beforeEach(() => {
    mockCanvas = createTypedMockCanvas();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useFloorPlanDrawing({
      canvas: mockCanvas,
      floorPlan: createTestFloorPlan()
    }));
    
    expect(result.current.isDrawing).toBe(false);
    expect(result.current.tool).toBe('select');
  });

  it('should handle tool change', () => {
    const { result } = renderHook(() => useFloorPlanDrawing({
      canvas: mockCanvas,
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
      canvas: mockCanvas,
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
      canvas: mockCanvas,
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
      canvas: mockCanvas,
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
