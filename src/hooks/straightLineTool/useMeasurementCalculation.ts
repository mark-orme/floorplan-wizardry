
import { useCallback } from 'react';
import { Point } from '@/types/core/Point';
import { Text } from 'fabric';

/**
 * Hook for handling measurement calculations
 */
export const useMeasurementCalculation = () => {
  /**
   * Calculate distance between two points
   * @param start - Start point
   * @param end - End point
   * @returns Distance in pixels
   */
  const calculateDistance = useCallback((
    start: Point, 
    end: Point
  ): number => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);
  
  /**
   * Calculate and update measurement information
   * @param start - Start point
   * @param end - End point
   * @returns Measurement information
   */
  const calculateMeasurement = useCallback((
    start: Point, 
    end: Point
  ) => {
    // Calculate distance
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Calculate angle from horizontal
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    // Convert to meters (100px = 1m)
    const distanceInMeters = (distance / 100).toFixed(1);
    
    // Position for tooltip (midpoint of line)
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2 - 10; // Position slightly above the line
    
    return {
      distance,
      distanceInMeters,
      angle,
      tooltipPosition: { x: midX, y: midY }
    };
  }, []);
  
  /**
   * Update tooltip text and position
   * @param tooltip - Tooltip to update
   * @param text - New text
   * @param position - New position
   */
  const updateTooltip = useCallback((
    tooltip: Text | null,
    text: string,
    position: Point
  ) => {
    if (!tooltip) return;
    
    tooltip.set({
      text,
      left: position.x,
      top: position.y
    });
  }, []);

  return {
    calculateDistance,
    calculateMeasurement,
    updateTooltip
  };
};
