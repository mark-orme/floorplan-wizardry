import { useRef, useCallback, useState, useEffect } from 'react';
import { Canvas as FabricCanvas, Point } from 'fabric';
import { toast } from 'sonner';

interface PredictivePoint {
  x: number;
  y: number;
  pressure: number;
  tiltX: number;
  tiltY: number;
  timestamp: number;
}

interface NavigatorWithMemory extends Navigator {
  deviceMemory?: number;
}

export const usePredictiveDrawing = (fabricCanvas: FabricCanvas | null) => {
  const pointHistoryRef = useRef<PredictivePoint[]>([]);
  const predictionRef = useRef<Point | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const [predictionEnabled, setPredictionEnabled] = useState(true);
  const [predictionQuality, setPredictionQuality] = useState<'high' | 'medium' | 'low'>('medium');
  
  useEffect(() => {
    const checkDevicePerformance = async () => {
      const nav = navigator as NavigatorWithMemory;
      
      const highPerformance = (
        (nav.deviceMemory && nav.deviceMemory > 4) || 
        navigator.hardwareConcurrency > 4
      );
      
      if (highPerformance) {
        setPredictionQuality('high');
      } else {
        setPredictionQuality('medium');
      }
    };
    
    checkDevicePerformance().catch(console.error);
  }, []);
  
  const adaptPrediction = useCallback((timestamp: number) => {
    if (lastFrameTimeRef.current === 0) {
      lastFrameTimeRef.current = timestamp;
      return;
    }
    
    const frameTime = timestamp - lastFrameTimeRef.current;
    lastFrameTimeRef.current = timestamp;
    
    if (frameTime > 33) {
      if (predictionQuality !== 'low') {
        setPredictionQuality('low');
      }
    } else if (frameTime < 16) {
      if (predictionQuality !== 'high') {
        setPredictionQuality('high');
      }
    }
  }, [predictionQuality]);
  
  const getPredictionLookahead = useCallback(() => {
    switch (predictionQuality) {
      case 'high': return 32;
      case 'medium': return 16;
      case 'low': return 8;
      default: return 16;
    }
  }, [predictionQuality]);
  
  const predictNextPoint = useCallback((currentPoint: PredictivePoint) => {
    const history = pointHistoryRef.current;
    if (history.length < 2) return null;

    const lastPoint = history[history.length - 1];
    const secondLastPoint = history[history.length - 2];
    
    let velocity = {
      x: (lastPoint.x - secondLastPoint.x) / (lastPoint.timestamp - secondLastPoint.timestamp),
      y: (lastPoint.y - secondLastPoint.y) / (lastPoint.timestamp - secondLastPoint.timestamp),
      pressure: (lastPoint.pressure - secondLastPoint.pressure) / (lastPoint.timestamp - secondLastPoint.timestamp),
      tiltX: (lastPoint.tiltX - secondLastPoint.tiltX) / (lastPoint.timestamp - secondLastPoint.timestamp),
      tiltY: (lastPoint.tiltY - secondLastPoint.tiltY) / (lastPoint.timestamp - secondLastPoint.timestamp)
    };
    
    let acceleration = { x: 0, y: 0 };
    if (history.length >= 3) {
      const thirdLastPoint = history[history.length - 3];
      const prevVelocityX = (secondLastPoint.x - thirdLastPoint.x) / (secondLastPoint.timestamp - thirdLastPoint.timestamp);
      const prevVelocityY = (secondLastPoint.y - thirdLastPoint.y) / (secondLastPoint.timestamp - thirdLastPoint.timestamp);
      
      acceleration = {
        x: (velocity.x - prevVelocityX) / (lastPoint.timestamp - secondLastPoint.timestamp),
        y: (velocity.y - prevVelocityY) / (lastPoint.timestamp - secondLastPoint.timestamp)
      };
    }
    
    const lookahead = getPredictionLookahead();
    const predictedPoint = new Point(
      currentPoint.x + velocity.x * lookahead + 0.5 * acceleration.x * lookahead * lookahead,
      currentPoint.y + velocity.y * lookahead + 0.5 * acceleration.y * lookahead * lookahead
    );

    return predictedPoint;
  }, [getPredictionLookahead]);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!fabricCanvas?.isDrawingMode || !predictionEnabled) return;

    adaptPrediction(performance.now());
    
    const currentPoint = {
      x: e.clientX,
      y: e.clientY,
      pressure: e.pressure || 0.5,
      tiltX: e.tiltX || 0,
      tiltY: e.tiltY || 0,
      timestamp: performance.now()
    };

    pointHistoryRef.current.push(currentPoint);
    const historyLimit = predictionQuality === 'high' ? 10 : (predictionQuality === 'medium' ? 5 : 3);
    
    if (pointHistoryRef.current.length > historyLimit) {
      pointHistoryRef.current.shift();
    }

    predictionRef.current = predictNextPoint(currentPoint);
    
    if (predictionRef.current && fabricCanvas.freeDrawingBrush) {
      const simulatedEvent = {
        e,
        pointer: predictionRef.current
      };
      
      fabricCanvas.freeDrawingBrush.onMouseMove(predictionRef.current, simulatedEvent);
    }
  }, [fabricCanvas, predictNextPoint, predictionEnabled, predictionQuality, adaptPrediction]);

  const togglePrediction = useCallback(() => {
    setPredictionEnabled(prev => !prev);
    toast.info(`Predictive drawing ${predictionEnabled ? 'disabled' : 'enabled'}`);
  }, [predictionEnabled]);
  
  const resetPrediction = useCallback(() => {
    pointHistoryRef.current = [];
    predictionRef.current = null;
  }, []);
  
  useEffect(() => {
    if (!fabricCanvas) return;
    
    const handleDrawingStart = () => {
      resetPrediction();
    };
    
    fabricCanvas.on('mouse:down', handleDrawingStart);
    
    return () => {
      fabricCanvas.off('mouse:down', handleDrawingStart);
    };
  }, [fabricCanvas, resetPrediction]);

  return { 
    handlePointerMove, 
    togglePrediction, 
    predictionEnabled,
    predictionQuality,
    setPredictionQuality 
  };
};
