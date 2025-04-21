
/**
 * Tests for useFloorPlanDrawing hook
 * @module __tests__/hooks/useFloorPlanDrawing.test
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFloorPlanDrawing } from '@/hooks/useFloorPlanDrawing';
import { DrawingMode } from '@/constants/drawingModes';
import { 
  createTestFloorPlan,
  createTestStroke,
  createTestRoom,
  createTestWall,
  asStrokeType,
  asRoomType
} from '@/utils/test/typedTestFixtures';
import { asMockCanvas } from '@/utils/testing/testUtils';

describe('useFloorPlanDrawing', () => {
  let mockCanvas: any;

  beforeEach(() => {
    // Use a generic mock object and wrap it for typing safety in tests, per ESLint/type safety guidelines.
    mockCanvas = asMockCanvas({
      add: vi.fn().mockReturnValue(undefined),
      renderAll: vi.fn().mockReturnValue(undefined),
      // Add additional common canvas methods as needed for compatibility
    });
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
      result.current.setTool(DrawingMode.WALL);
    });

    expect(result.current.tool).toBe(DrawingMode.WALL);
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
      result.current.setTool(DrawingMode.WALL);
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
    const updateFloorPlan = vi.fn().mockReturnValue(undefined);
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
