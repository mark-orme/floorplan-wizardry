
import { useCallback, useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { Point } from '@/types/core/Point';

interface UseCanvasPanProps {
  canvasRef: React.MutableRefObject<FabricCanvas | null>;
  enabled?: boolean;
}

export const useCanvasPan = ({ canvasRef, enabled = false }: UseCanvasPanProps) => {
  const [isPanning, setIsPanning] = useState(false);
  const [lastPoint, setLastPoint] = useState<Point | null>(null);

  const startPan = useCallback((point: Point) => {
    setIsPanning(true);
    setLastPoint(point);
  }, []);

  const pan = useCallback((point: Point) => {
    const canvas = canvasRef.current;
    if (!canvas || !lastPoint || !isPanning) return;

    // Calculate delta
    const deltaX = point.x - lastPoint.x;
    const deltaY = point.y - lastPoint.y;

    // Update viewport transform with null check
    if (canvas.viewportTransform) {
      canvas.viewportTransform[4] = (canvas.viewportTransform[4] || 0) + deltaX;
      canvas.viewportTransform[5] = (canvas.viewportTransform[5] || 0) + deltaY;
    }

    canvas.requestRenderAll();
    
    // Update last point
    setLastPoint(point);
  }, [canvasRef, lastPoint, isPanning]);

  const endPan = useCallback(() => {
    setIsPanning(false);
    setLastPoint(null);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !enabled) return;

    // Set cursor for panning
    canvas.defaultCursor = 'grab';

    return () => {
      if (canvas) {
        canvas.defaultCursor = 'default';
      }
    };
  }, [canvasRef, enabled]);

  return {
    isPanning,
    startPan,
    pan,
    endPan
  };
};

export default useCanvasPan;
