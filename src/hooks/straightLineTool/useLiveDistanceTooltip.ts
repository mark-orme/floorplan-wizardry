
import { useCallback, useState, useEffect } from 'react';
import type { MeasurementData } from './useStraightLineTool';
import { Point } from '@/types/core/Point';

interface UseLiveDistanceTooltipProps {
  isDrawing: boolean;
  startPoint: Point | null;
  currentPoint: Point | null;
  onMeasurement?: (measurement: MeasurementData) => void;
}

/**
 * Hook for managing live distance tooltip during line drawing
 */
export const useLiveDistanceTooltip = ({
  isDrawing,
  startPoint,
  currentPoint,
  onMeasurement
}: UseLiveDistanceTooltipProps) => {
  const [tooltipPosition, setTooltipPosition] = useState<Point | null>(null);
  const [measurement, setMeasurement] = useState<MeasurementData>({ distance: 0, angle: 0 });
  const [visible, setVisible] = useState<boolean>(false);
  
  /**
   * Calculate distance and angle between two points
   */
  const calculateMeasurement = useCallback((start: Point, end: Point): MeasurementData => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Calculate angle in degrees
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    if (angle < 0) angle += 360; // Normalize to 0-360
    
    return { distance, angle };
  }, []);
  
  // Update tooltip when drawing
  useEffect(() => {
    if (isDrawing && startPoint && currentPoint) {
      // Calculate midpoint for tooltip position
      const midPoint = {
        x: (startPoint.x + currentPoint.x) / 2,
        y: (startPoint.y + currentPoint.y) / 2 - 20 // Offset above the line
      };
      
      setTooltipPosition(midPoint);
      
      // Calculate measurement
      const newMeasurement = calculateMeasurement(startPoint, currentPoint);
      setMeasurement(newMeasurement);
      setVisible(true);
      
      if (onMeasurement) {
        onMeasurement(newMeasurement);
      }
    } else {
      setVisible(false);
    }
  }, [isDrawing, startPoint, currentPoint, calculateMeasurement, onMeasurement]);
  
  return {
    tooltipPosition,
    measurement,
    visible
  };
};
