
import { useCallback } from 'react';
import { Canvas as FabricCanvas, Line } from 'fabric';
import { Point } from '@/types/core/Point';
import { MeasurementData } from '@/types/measurement/MeasurementData';
import { GRID_CONSTANTS } from '@/types/fabric-unified';
import { calculateDistance } from '@/utils/geometryUtils';

interface UseLineEventsProps {
  canvas: FabricCanvas | null;
  lineColor: string;
  lineThickness: number;
}

export const useLineEvents = ({ canvas, lineColor, lineThickness }: UseLineEventsProps) => {
  // Create a line between two points
  const createLine = useCallback((start: Point, end: Point): Line | null => {
    if (!canvas) return null;
    
    const line = new Line([start.x, start.y, end.x, end.y], {
      stroke: lineColor,
      strokeWidth: lineThickness,
      selectable: false,
      evented: false
    });
    
    return line;
  }, [canvas, lineColor, lineThickness]);
  
  // Add a line to the canvas
  const addLine = useCallback((line: Line | null): boolean => {
    if (!canvas || !line) return false;
    
    try {
      canvas.add(line);
      canvas.renderAll();
      return true;
    } catch (error) {
      console.error('Error adding line to canvas:', error);
      return false;
    }
  }, [canvas]);
  
  // Update a line's endpoints
  const updateLine = useCallback((line: Line | null, start: Point, end: Point): boolean => {
    if (!canvas || !line) return false;
    
    try {
      line.set({ x1: start.x, y1: start.y, x2: end.x, y2: end.y });
      canvas.renderAll();
      return true;
    } catch (error) {
      console.error('Error updating line:', error);
      return false;
    }
  }, [canvas]);
  
  // Calculate measurement data for a line
  const calculateMeasurementData = useCallback((start: Point, end: Point): MeasurementData => {
    if (!start || !end) {
      return { distance: null, angle: null, unit: 'px' };
    }
    
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    
    // Use PIXELS_PER_METER from GRID_CONSTANTS with fallback
    const pixelsPerMeter = GRID_CONSTANTS.PIXELS_PER_METER || 100;
    const distanceInMeters = distance / pixelsPerMeter;
    
    return {
      distance: distance,
      angle: angle,
      startPoint: start,
      endPoint: end,
      start: start,
      end: end,
      midPoint: {
        x: (start.x + end.x) / 2,
        y: (start.y + end.y) / 2
      },
      unit: 'px',
      units: 'px',
      pixelsPerMeter: pixelsPerMeter
    };
  }, []);
  
  // Create a measurement tooltip for a line
  const createMeasurementTooltip = useCallback((start: Point, end: Point): MeasurementData => {
    if (!start || !end) {
      return { distance: null, angle: null, unit: 'px' };
    }
    
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    
    // Use PIXELS_PER_METER from GRID_CONSTANTS with fallback
    const pixelsPerMeter = GRID_CONSTANTS.PIXELS_PER_METER || 100;
    const distanceInMeters = distance / pixelsPerMeter;
    
    return {
      distance: distance,
      angle: angle,
      startPoint: start,
      endPoint: end,
      start: start,
      end: end,
      midPoint: {
        x: (start.x + end.x) / 2,
        y: (start.y + end.y) / 2
      },
      unit: 'px',
      units: 'px',
      pixelsPerMeter: pixelsPerMeter
    };
  }, []);
  
  return {
    createLine,
    addLine,
    updateLine,
    calculateMeasurementData,
    createMeasurementTooltip
  };
};
