/**
 * Grid alignment and snapping tests
 * Validates that the grid snapping functionality works as expected
 * @module gridAlignment.test
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { snapToGrid, snapToAngle, snapLineToStandardAngles } from '@/utils/grid/snapping';
import { GRID_SPACING, PIXELS_PER_METER } from '@/constants/numerics';
import { Point, createPoint } from '@/types/core/Point';

describe('Grid Alignment', () => {
  describe('Wall endpoints snapping', () => {
    // Wall endpoint should snap to 0.1m increments
    it('should snap wall endpoints to 0.1m increments', () => {
      // Given points with various positions
      const testPoints = [
        { x: 12, y: 36 },
        { x: 19, y: 21 },
        { x: 25.4, y: 48.9 },
        { x: 33.3, y: 67.8 }
      ];
      
      // When we snap them to grid
      const snappedPoints = testPoints.map(point => snapToGrid(point, GRID_SPACING.SMALL));
      
      // Then all coordinates should be multiples of GRID_SPACING.SMALL
      snappedPoints.forEach(point => {
        expect(point.x % GRID_SPACING.SMALL).toBe(0);
        expect(point.y % GRID_SPACING.SMALL).toBe(0);
      });
    });
    
    it('should preserve exact grid points when snapping', () => {
      // Given points already on grid intersections
      const gridPoints = [
        { x: 10, y: 20 },
        { x: 30, y: 40 },
        { x: 100, y: 200 }
      ];
      
      // When we snap them to grid
      const snappedPoints = gridPoints.map(point => snapToGrid(point, GRID_SPACING.SMALL));
      
      // Then they should remain unchanged
      snappedPoints.forEach((point, index) => {
        expect(point.x).toBe(gridPoints[index].x);
        expect(point.y).toBe(gridPoints[index].y);
      });
    });
    
    it('should snap to pixel values that represent 0.1m increments', () => {
      // Given points at various positions
      const testPoints = [
        { x: 97, y: 103 },
        { x: 152, y: 199 }
      ];
      
      // When we snap them to grid
      const snappedPoints = testPoints.map(point => snapToGrid(point, GRID_SPACING.SMALL));
      
      // Then they should be at 0.1m increments in our pixel scale
      // (where PIXELS_PER_METER defines how many pixels = 1 meter)
      snappedPoints.forEach(point => {
        const meterX = point.x / PIXELS_PER_METER;
        const meterY = point.y / PIXELS_PER_METER;
        
        // Check that the values in meters are multiples of 0.1
        expect(Math.abs(Math.round(meterX * 10) - meterX * 10)).toBeLessThan(0.001);
        expect(Math.abs(Math.round(meterY * 10) - meterY * 10)).toBeLessThan(0.001);
      });
    });
  });
  
  describe('Line straightening', () => {
    it('should straighten lines to standard angles', () => {
      // Given start and end points that form approximately 43° angle
      const startPoint = { x: 100, y: 100 };
      const endPoint = { x: 150, y: 140 }; // ~43° angle
      
      // When we snap to standard angles
      const snappedEndPoint = snapLineToStandardAngles(startPoint, endPoint);
      
      // Calculate the angle of the snapped line
      const dx = snappedEndPoint.x - startPoint.x;
      const dy = snappedEndPoint.y - startPoint.y;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      
      // Round to nearest whole degree for comparison
      const roundedAngle = Math.round(angle);
      
      // Then the angle should be snapped to 45°
      expect(roundedAngle).toBe(45);
    });
    
    it('should preserve horizontal and vertical lines', () => {
      // Given perfectly horizontal and vertical lines
      const start = { x: 100, y: 100 };
      const horizontal = { x: 200, y: 100 };
      const vertical = { x: 100, y: 200 };
      
      // When we snap them
      const snappedH = snapLineToStandardAngles(start, horizontal);
      const snappedV = snapLineToStandardAngles(start, vertical);
      
      // Then they should remain unchanged
      expect(snappedH.x).toBe(horizontal.x);
      expect(snappedH.y).toBe(horizontal.y);
      expect(snappedV.x).toBe(vertical.x);
      expect(snappedV.y).toBe(vertical.y);
    });
    
    it('should snap angles to 45° increments', () => {
      // Test angles should snap to 0, 45, 90, 135, 180, 225, 270, or 315 degrees
      const testAngles = [12, 38, 89, 101, 160, 200, 250, 300, 340];
      const expectedSnaps = [0, 45, 90, 90, 180, 180, 270, 315, 0];
      
      testAngles.forEach((angle, index) => {
        // Create a Point object from the angle value
        const snapped = snapToAngle(createPoint(angle, 0), 45);
        expect(snapped.x).toBe(expectedSnaps[index]);
      });
    });
  });
});
