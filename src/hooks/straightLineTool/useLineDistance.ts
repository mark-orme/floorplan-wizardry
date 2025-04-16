
import { useCallback } from 'react';
import { Point } from '@/types/core/Point';
import { Text } from 'fabric';

/**
 * Hook for calculating and displaying line distances
 */
export const useLineDistance = () => {
  // Calculate distance between two points
  const calculateDistance = useCallback((start: Point, end: Point): number => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);
  
  // Update the distance tooltip
  const updateDistanceTooltip = useCallback((
    tooltip: Text | null,
    start: Point,
    end: Point,
    distance: number
  ) => {
    if (!tooltip) return;
    
    // Position the tooltip at the midpoint of the line
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2 - 10;
    
    // Convert distance to meters (assuming 100px = 1m)
    const meters = (distance / 100).toFixed(1);
    
    tooltip.set({
      text: `${meters}m`,
      left: midX,
      top: midY
    });
  }, []);
  
  // Get midpoint of a line
  const getMidpoint = useCallback((start: Point, end: Point): Point => {
    return {
      x: (start.x + end.x) / 2,
      y: (start.y + end.y) / 2
    };
  }, []);

  return {
    calculateDistance,
    updateDistanceTooltip,
    getMidpoint
  };
};
