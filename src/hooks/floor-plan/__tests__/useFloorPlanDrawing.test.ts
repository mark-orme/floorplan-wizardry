
/**
 * Tests for useFloorPlanDrawing hook
 * @module hooks/floor-plan/__tests__/useFloorPlanDrawing.test
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFloorPlanDrawing } from '@/hooks/floor-plan/useFloorPlanDrawing';
import { DrawingMode } from '@/constants/drawingModes';
import { createMockFloorPlan, createMockStroke, createMockRoom, createMockWall } from '@/utils/test/mockUtils';
import type { StrokeTypeLiteral, RoomTypeLiteral } from '@/types/floor-plan/unifiedTypes';

describe('useFloorPlanDrawing', () => {
  let mockCanvas: any;

  beforeEach(() => {
    // Create a mock canvas for testing
    mockCanvas = {
      add: vi.fn(),
      renderAll: vi.fn(),
      getObjects: vi.fn().mockReturnValue([]),
      remove: vi.fn(),
      clear: vi.fn(),
      discardActiveObject: vi.fn()
    };
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useFloorPlanDrawing({
      canvas: mockCanvas,
      floorPlan: createMockFloorPlan()
    }));

    expect(result.current.isDrawing).toBe(false);
    expect(result.current.tool).toBe('select');
  });

  it('should handle tool change', () => {
    const { result } = renderHook(() => useFloorPlanDrawing({
      canvas: mockCanvas,
      floorPlan: createMockFloorPlan()
    }));

    act(() => {
      result.current.setTool(DrawingMode.WALL);
    });

    expect(result.current.tool).toBe(DrawingMode.WALL);
  });

  it('should create strokes with the correct type', () => {
    // Arrange
    const testFloorPlan = createMockFloorPlan();
    const { result } = renderHook(() => useFloorPlanDrawing({
      canvas: mockCanvas,
      floorPlan: testFloorPlan
    }));

    // Act
    act(() => {
      result.current.setTool(DrawingMode.WALL);
      const myStroke = createMockStroke();
      result.current.addStroke(myStroke);
    });

    // Assert
    expect(mockCanvas.add).toHaveBeenCalled();
  });

  it('should update floor plan when changes occur', () => {
    // Arrange
    const updateFloorPlan = vi.fn();
    const testFloorPlan = createMockFloorPlan();

    // Act
    const { result } = renderHook(() => useFloorPlanDrawing({
      canvas: mockCanvas,
      floorPlan: testFloorPlan,
      onFloorPlanUpdate: updateFloorPlan
    }));

    act(() => {
      // Adding a stroke with the correct type
      const stroke = createMockStroke();
      result.current.addStroke(stroke);
    });

    // Assert
    expect(updateFloorPlan).toHaveBeenCalled();
  });

  it('should handle adding a room', () => {
    // Arrange
    const testFloorPlan = createMockFloorPlan({
      rooms: [],
      walls: [createMockWall()]
    });

    const { result } = renderHook(() => useFloorPlanDrawing({
      canvas: mockCanvas,
      floorPlan: testFloorPlan
    }));

    // Act
    act(() => {
      const room = createMockRoom();
      result.current.addRoom(room);
    });

    // Assert
    expect(mockCanvas.add).toHaveBeenCalled();
  });
});
