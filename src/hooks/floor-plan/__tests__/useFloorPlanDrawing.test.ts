
/**
 * Tests for useFloorPlanDrawing hook
 * @module __tests__/hooks/useFloorPlanDrawing.test
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFloorPlanDrawing } from '@/hooks/floor-plan/useFloorPlanDrawing';
import { DrawingMode } from '@/constants/drawingModes';
import { 
  createTestFloorPlan,
  createTestStroke,
  createTestRoom,
  createTestWall
} from '@/types/floor-plan/unifiedTypes';
import { asMockCanvas } from '@/utils/testing/testUtils';
import { adaptFloorPlan } from '@/utils/typeAdapters';
import type { StrokeTypeLiteral, RoomTypeLiteral } from '@/types/floor-plan/unifiedTypes';

describe('useFloorPlanDrawing', () => {
  let mockCanvas: any;

  beforeEach(() => {
    // Use a generic mock object and wrap it for typing safety in tests
    mockCanvas = asMockCanvas({
      add: vi.fn().mockReturnValue(undefined),
      renderAll: vi.fn().mockReturnValue(undefined),
      // Add additional common canvas methods as needed for compatibility
    });
  });

  it('should initialize with default values', () => {
    // Create a valid fully typed test floor plan
    const testFloorPlan = adaptFloorPlan({
      id: 'test-plan',
      name: 'Test Plan',
      walls: [],
      rooms: [],
      strokes: [],
      data: {},
      userId: 'test-user'
    });

    const { result } = renderHook(() => useFloorPlanDrawing({
      canvas: mockCanvas,
      floorPlan: testFloorPlan
    }));

    expect(result.current.isDrawing).toBe(false);
    expect(result.current.tool).toBe('select');
  });

  it('should handle tool change', () => {
    // Create a valid fully typed test floor plan
    const testFloorPlan = adaptFloorPlan({
      id: 'test-plan',
      name: 'Test Plan',
      walls: [],
      rooms: [],
      strokes: [],
      data: {},
      userId: 'test-user'
    });

    const { result } = renderHook(() => useFloorPlanDrawing({
      canvas: mockCanvas,
      floorPlan: testFloorPlan
    }));

    act(() => {
      result.current.setTool(DrawingMode.WALL);
    });

    expect(result.current.tool).toBe(DrawingMode.WALL);
  });

  it('should create strokes with the correct type', () => {
    // Arrange
    const testFloorPlan = adaptFloorPlan({
      id: 'test-plan',
      name: 'Test Plan',
      walls: [],
      rooms: [],
      strokes: [],
      data: {},
      userId: 'test-user'
    });

    const { result } = renderHook(() => useFloorPlanDrawing({
      canvas: mockCanvas,
      floorPlan: testFloorPlan
    }));

    // Act
    act(() => {
      result.current.setTool(DrawingMode.WALL);
      const myStroke = createTestStroke({
        type: 'wall' as StrokeTypeLiteral
      });
      result.current.addStroke(myStroke);
    });

    // Assert
    expect(mockCanvas.add).toHaveBeenCalled();
  });

  it('should update floor plan when changes occur', () => {
    // Arrange
    const updateFloorPlan = vi.fn().mockReturnValue(undefined);
    const testFloorPlan = adaptFloorPlan({
      id: 'test-plan',
      name: 'Test Plan',
      walls: [],
      rooms: [],
      strokes: [],
      data: {},
      userId: 'test-user'
    });

    // Act
    const { result } = renderHook(() => useFloorPlanDrawing({
      canvas: mockCanvas,
      floorPlan: testFloorPlan,
      onFloorPlanUpdate: updateFloorPlan
    }));

    act(() => {
      // Adding a stroke with the correct type
      const stroke = createTestStroke({
        type: 'line' as StrokeTypeLiteral
      });
      result.current.addStroke(stroke);
    });

    // Assert
    expect(updateFloorPlan).toHaveBeenCalled();
  });

  it('should handle adding a room', () => {
    // Arrange
    const testFloorPlan = adaptFloorPlan({
      id: 'test-plan',
      name: 'Test Plan', 
      rooms: [],
      walls: [createTestWall()],
      strokes: [],
      data: {},
      userId: 'test-user'
    });

    const { result } = renderHook(() => useFloorPlanDrawing({
      canvas: mockCanvas,
      floorPlan: testFloorPlan
    }));

    // Act
    act(() => {
      const room = createTestRoom({
        type: 'living' as RoomTypeLiteral
      });
      result.current.addRoom(room);
    });

    // Assert
    expect(mockCanvas.add).toHaveBeenCalled();
  });
});
