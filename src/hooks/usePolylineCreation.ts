
import { useCallback } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { Point } from '@/types/geometryTypes';
import { POLYLINE_STYLES } from '@/constants/drawingConstants';

interface UsePolylineCreationProps {
  canvas: FabricCanvas | null;
  lineColor?: string;
  lineThickness?: number;
}

export const usePolylineCreation = ({
  canvas,
  lineColor = '#000000',
  lineThickness = 2
}: UsePolylineCreationProps) => {
  
  const createPolyline = useCallback((points: Point[]): FabricObject | null => {
    if (!canvas || !points || points.length < 2) return null;
    
    try {
      // Create a path string from points
      const pathString = points.reduce((path, point, index) => {
        const command = index === 0 ? 'M' : 'L';
        return `${path} ${command} ${point?.x || 0} ${point?.y || 0}`;
      }, '');
      
      // Use fabric.Path to create the polyline since Polyline might not be available
      const pathObject = new fabric.Path(pathString, {
        ...POLYLINE_STYLES.DEFAULT,
        stroke: lineColor,
        strokeWidth: lineThickness,
        fill: 'transparent'
      });
      
      return pathObject;
    } catch (error) {
      console.error('Error creating polyline:', error);
      return null;
    }
  }, [canvas, lineColor, lineThickness]);
  
  const addPolylineToCanvas = useCallback((points: Point[]): FabricObject | null => {
    if (!canvas) return null;
    
    const polyline = createPolyline(points);
    if (polyline) {
      canvas.add(polyline);
      canvas.requestRenderAll();
    }
    
    return polyline;
  }, [canvas, createPolyline]);
  
  return {
    createPolyline,
    addPolylineToCanvas
  };
};
