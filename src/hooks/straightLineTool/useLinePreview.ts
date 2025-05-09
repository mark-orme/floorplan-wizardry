
import { useCallback } from 'react';
import { Point } from '@/types/core/Point';
import { Line } from 'fabric';

interface UseLinePreviewOptions {
  fabricCanvasRef: React.MutableRefObject<any>;
  lineColor?: string;
  lineThickness?: number;
  startPoint: Point | null;
  currentPoint: Point | null;
  snapEnabled: boolean;
  snapToGrid: (point: Point) => Point;
  anglesEnabled: boolean;
  snapToAngle: (start: Point, end: Point) => { point: Point; wasSnapped: boolean; angle: number; };
  isDrawing: boolean;
}

export const useLinePreview = ({
  fabricCanvasRef,
  lineColor = '#000000',
  lineThickness = 1,
  startPoint,
  currentPoint,
  snapEnabled,
  snapToGrid,
  anglesEnabled,
  snapToAngle,
  isDrawing
}: UseLinePreviewOptions) => {
  const updatePreview = useCallback((line: any) => {
    if (!fabricCanvasRef.current || !line || !startPoint || !currentPoint) return;
    
    let endPoint = currentPoint;
    
    // Apply grid snapping if enabled
    if (snapEnabled) {
      endPoint = snapToGrid(currentPoint);
    }
    
    // Apply angle snapping if enabled
    let snappedAngleResult = { point: endPoint, wasSnapped: false, angle: 0 };
    if (anglesEnabled) {
      snappedAngleResult = snapToAngle(startPoint, endPoint);
      endPoint = snappedAngleResult.point;
    }
    
    // Update the line with new coordinates
    line.set({
      x1: startPoint.x,
      y1: startPoint.y,
      x2: endPoint.x,
      y2: endPoint.y
    });
    
    fabricCanvasRef.current.renderAll();
    
    return {
      adjustedEndPoint: endPoint,
      wasAngleSnapped: snappedAngleResult.wasSnapped,
      snappedAngle: snappedAngleResult.angle
    };
  }, [fabricCanvasRef, startPoint, currentPoint, snapEnabled, snapToGrid, anglesEnabled, snapToAngle]);
  
  const createPreviewLine = useCallback(() => {
    if (!fabricCanvasRef.current || !startPoint || !currentPoint) return null;
    
    const line = new Line([startPoint.x, startPoint.y, currentPoint.x, currentPoint.y], {
      stroke: lineColor,
      strokeWidth: lineThickness,
      selectable: false,
      evented: false,
      strokeDashArray: [5, 5]
    });
    
    fabricCanvasRef.current.add(line);
    return line;
  }, [fabricCanvasRef, startPoint, currentPoint, lineColor, lineThickness]);
  
  const removePreviewLine = useCallback((line: any) => {
    if (!fabricCanvasRef.current || !line) return;
    fabricCanvasRef.current.remove(line);
    fabricCanvasRef.current.renderAll();
  }, [fabricCanvasRef]);
  
  return {
    updatePreview,
    createPreviewLine,
    removePreviewLine
  };
};

export default useLinePreview;
