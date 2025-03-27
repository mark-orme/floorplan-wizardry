/**
 * Tests for the useSnapToGrid hook
 * @module hooks/__tests__/useSnapToGrid.test
 */
import { renderHook } from '@testing-library/react-hooks';
import { useSnapToGrid } from '../useSnapToGrid';
import { Point } from '@/types/drawingTypes';

describe('useSnapToGrid', () => {
  const gridSize = 10;
  
  test('should snap a point to the nearest grid point', () => {
    const { result } = renderHook(() => useSnapToGrid());
    
    // Test point that needs snapping
    const point: { x: number; y: number } = { x: 22, y: 37 };
    
    // Expected snapped point
    const expectedPoint = { x: 20, y: 40 };
    
    // Call the snap function
    const snappedPoint = result.current.snapPointToGrid(point, gridSize);
    
    // Verify snapping
    expect(snappedPoint.x).toBe(expectedPoint.x);
    expect(snappedPoint.y).toBe(expectedPoint.y);
  });
  
  test('should not change a point already on the grid', () => {
    const { result } = renderHook(() => useSnapToGrid());
    
    // Test point already on grid
    const point: { x: number; y: number } = { x: 20, y: 30 };
    
    // Call the snap function
    const snappedPoint = result.current.snapPointToGrid(point, gridSize);
    
    // Verify point is unchanged
    expect(snappedPoint.x).toBe(point.x);
    expect(snappedPoint.y).toBe(point.y);
  });
  
  test('should snap multiple points to the grid', () => {
    const { result } = renderHook(() => useSnapToGrid());
    
    // Test points
    const points: { x: number; y: number }[] = [
      { x: 22, y: 37 },
      { x: 45, y: 12 },
      { x: 30, y: 30 } // Already on grid
    ];
    
    // Expected snapped points
    const expectedPoints = [
      { x: 20, y: 40 },
      { x: 50, y: 10 },
      { x: 30, y: 30 } // Unchanged
    ];
    
    // Call the snap function
    const snappedPoints = result.current.snapPointsToGrid(points, gridSize);
    
    // Verify all points
    snappedPoints.forEach((point, index) => {
      expect(point.x).toBe(expectedPoints[index].x);
      expect(point.y).toBe(expectedPoints[index].y);
    });
  });
});
