
import { useCallback, useState } from 'react';
import { Canvas } from 'fabric';
import { Point } from '@/types/fabric-unified';

export interface UseCanvasPanProps {
  fabricCanvasRef: React.MutableRefObject<Canvas | null>;
  enabled?: boolean;
  onPanStart?: () => void;
  onPanEnd?: () => void;
  onPan?: (delta: Point) => void;
}

export const useCanvasPan = ({
  fabricCanvasRef,
  enabled = true,
  onPanStart,
  onPanEnd,
  onPan
}: UseCanvasPanProps) => {
  const [isPanning, setIsPanning] = useState(false);
  const [lastPoint, setLastPoint] = useState<Point | null>(null);
  
  const startPan = useCallback((point: Point) => {
    if (!enabled) return;
    
    setIsPanning(true);
    setLastPoint(point);
    onPanStart?.();
  }, [enabled, onPanStart]);
  
  const pan = useCallback((point: Point) => {
    if (!isPanning || !lastPoint) return;
    
    const delta = {
      x: point.x - lastPoint.x,
      y: point.y - lastPoint.y
    };
    
    const canvas = fabricCanvasRef.current;
    if (canvas && canvas.viewportTransform) {
      // Update viewport transform
      canvas.viewportTransform[4] += delta.x;
      canvas.viewportTransform[5] += delta.y;
      canvas.requestRenderAll();
      
      // Call onPan callback
      onPan?.(delta);
    }
    
    setLastPoint(point);
  }, [isPanning, lastPoint, fabricCanvasRef, onPan]);
  
  const endPan = useCallback(() => {
    if (!isPanning) return;
    
    setIsPanning(false);
    setLastPoint(null);
    onPanEnd?.();
  }, [isPanning, onPanEnd]);
  
  return {
    isPanning,
    startPan,
    pan,
    endPan,
    setIsPanning
  };
};

export default useCanvasPan;
