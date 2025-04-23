
import { useState, useCallback } from 'react';
import type { GestureType, GestureState, GestureStateObject } from '@/types/drawingTypes';
import { Point } from '@/types/core/Point';

export const useMultiTouchGestures = () => {
  const [gestureState, setGestureState] = useState<GestureStateObject>({
    type: 'pinch',
    startPoints: [],
    currentPoints: [],
    scale: 1,
    rotation: 0,
    translation: { x: 0, y: 0 },
    center: { x: 0, y: 0 }
  });

  const handleGestureStart = useCallback((type: GestureType, points: Point[]) => {
    setGestureState(prevState => ({
      ...prevState,
      type: type,
      startPoints: points,
      currentPoints: points,
      scale: 1,
      rotation: 0,
      translation: { x: 0, y: 0 },
      center: getCenterPoint(points)
    }));
  }, []);

  const handleGestureMove = useCallback((currentPoints: Point[]) => {
    setGestureState(prevState => {
      const newScale = calculateScale(prevState.startPoints, currentPoints);
      const newRotation = calculateRotation(prevState.startPoints, currentPoints);
      const newTranslation = calculateTranslation(prevState.startPoints, currentPoints);
      
      return {
        ...prevState,
        currentPoints: currentPoints,
        scale: newScale,
        rotation: newRotation,
        translation: newTranslation,
        center: getCenterPoint(currentPoints)
      };
    });
  }, []);

  const handleGestureEnd = useCallback(() => {
    // Reset gesture state
    setGestureState({
      type: 'pan',
      startPoints: [],
      currentPoints: [],
      scale: 1,
      rotation: 0,
      translation: { x: 0, y: 0 },
      center: { x: 0, y: 0 }
    });
  }, []);

  // Helper functions
  const getCenterPoint = (points: Point[]): Point => {
    if (points.length === 0) return { x: 0, y: 0 };
    
    let sumX = 0;
    let sumY = 0;
    for (const point of points) {
      sumX += point.x;
      sumY += point.y;
    }
    
    return {
      x: sumX / points.length,
      y: sumY / points.length
    };
  };

  const calculateScale = (startPoints: Point[], currentPoints: Point[]): number => {
    if (startPoints.length < 2 || currentPoints.length < 2) return 1;

    const initialDistance = Math.hypot(startPoints[1].x - startPoints[0].x, startPoints[1].y - startPoints[0].y);
    const currentDistance = Math.hypot(currentPoints[1].x - currentPoints[0].x, currentPoints[1].y - currentPoints[0].y);

    return currentDistance / initialDistance;
  };

  const calculateRotation = (startPoints: Point[], currentPoints: Point[]): number => {
    if (startPoints.length < 2 || currentPoints.length < 2) return 0;

    const initialAngle = Math.atan2(startPoints[1].y - startPoints[0].y, startPoints[1].x - startPoints[0].x) * 180 / Math.PI;
    const currentAngle = Math.atan2(currentPoints[1].y - currentPoints[0].y, currentPoints[1].x - currentPoints[0].x) * 180 / Math.PI;

    return currentAngle - initialAngle;
  };

  const calculateTranslation = (startPoints: Point[], currentPoints: Point[]): Point => {
    if (startPoints.length === 0 || currentPoints.length === 0) return { x: 0, y: 0 };

    const startCenter = getCenterPoint(startPoints);
    const currentCenter = getCenterPoint(currentPoints);

    return {
      x: currentCenter.x - startCenter.x,
      y: currentCenter.y - startCenter.y
    };
  };

  return {
    gestureState,
    handleGestureStart,
    handleGestureMove,
    handleGestureEnd
  };
};
