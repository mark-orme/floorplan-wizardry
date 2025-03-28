/**
 * Tests for the useSnapToGrid hook
 * @module hooks/__tests__/useSnapToGrid.test
 */
import { renderHook } from '@testing-library/react-hooks';
import { useSnapToGrid } from '../useSnapToGrid';
import { Point } from '@/types/core/Point';
import { GRID_SPACING } from '@/constants/numerics';

describe('useSnapToGrid', () => {
  const gridSize = GRID_SPACING;
  
  test('should snap a point to the nearest grid point', () => {
    const { result } = renderHook(() => useSnapToGrid({
      gridSize: gridSize
    }));
    
    // Test point that needs snapping
    const point = { x: 22, y: 37 } as Point;
    
    // Expected snapped point
    const expectedPoint = { x: 20, y: 40 };
    
    // Call the snap function
    const snappedPoint = result.current.snapPointToGrid(point);
    
    // Verify snapping
    expect(snappedPoint.x).toBe(expectedPoint.x);
    expect(snappedPoint.y).toBe(expectedPoint.y);
  });
  
  test('should not change a point already on the grid', () => {
    const { result } = renderHook(() => useSnapToGrid({
      gridSize: gridSize
    }));
    
    // Test point already on grid
    const point = { x: 20, y: 30 } as Point;
    
    // Call the snap function
    const snappedPoint = result.current.snapPointToGrid(point);
    
    // Verify point is unchanged
    expect(snappedPoint.x).toBe(point.x);
    expect(snappedPoint.y).toBe(point.y);
  });
  
  test('should snap multiple points to the grid', () => {
    const { result } = renderHook(() => useSnapToGrid({
      gridSize: gridSize
    }));
    
    // Test points
    const points: Point[] = [
      { x: 22, y: 37 } as Point,
      { x: 45, y: 12 } as Point,
      { x: 30, y: 30 } as Point // Already on grid
    ];
    
    // Expected snapped points
    const expectedPoints = [
      { x: 20, y: 40 },
      { x: 40, y: 10 },
      { x: 30, y: 30 } // Unchanged
    ];
    
    // Call the snap function for multiple points
    const snappedPoints = points.map(point => result.current.snapPointToGrid(point));
    
    // Verify all points
    snappedPoints.forEach((point, index) => {
      expect(point.x).toBe(expectedPoints[index].x);
      expect(point.y).toBe(expectedPoints[index].y);
    });
  });
});
