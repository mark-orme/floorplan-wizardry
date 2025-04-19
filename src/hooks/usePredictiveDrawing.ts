import { useRef, useCallback } from 'react';
import { Canvas as FabricCanvas, Point } from 'fabric';

interface PredictivePoint {
  x: number;
  y: number;
  pressure: number;
  timestamp: number;
}

export const usePredictiveDrawing = (fabricCanvas: FabricCanvas | null) => {
  const pointHistoryRef = useRef<PredictivePoint[]>([]);
  const predictionRef = useRef<Point | null>(null);
  
  const predictNextPoint = useCallback((currentPoint: PredictivePoint) => {
    const history = pointHistoryRef.current;
    if (history.length < 2) return null;

    const lastPoint = history[history.length - 1];
    const secondLastPoint = history[history.length - 2];

    // Calculate velocity vector
    const dx = lastPoint.x - secondLastPoint.x;
    const dy = lastPoint.y - secondLastPoint.y;
    const dt = lastPoint.timestamp - secondLastPoint.timestamp;
    
    if (dt === 0) return null;

    // Predict next point based on current velocity
    const velocity = {
      x: dx / dt,
      y: dy / dt
    };

    // Predict 16ms ahead (assuming 60fps)
    const predictedPoint = new Point(
      currentPoint.x + velocity.x * 16,
      currentPoint.y + velocity.y * 16
    );

    return predictedPoint;
  }, []);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!fabricCanvas?.isDrawingMode) return;

    const currentPoint = {
      x: e.clientX,
      y: e.clientY,
      pressure: e.pressure || 0.5,
      timestamp: performance.now()
    };

    // Keep last 5 points for prediction
    pointHistoryRef.current.push(currentPoint);
    if (pointHistoryRef.current.length > 5) {
      pointHistoryRef.current.shift();
    }

    // Generate prediction
    predictionRef.current = predictNextPoint(currentPoint);
    
    // Use prediction if available
    if (predictionRef.current && fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.onMouseMove(predictionRef.current, {
        e,
        pointer: predictionRef.current
      });
    }
  }, [fabricCanvas, predictNextPoint]);

  return { handlePointerMove };
};
