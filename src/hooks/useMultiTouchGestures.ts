import { useState, useEffect, useRef, useCallback } from 'react';
import { Point } from '@/types/core/Point';
import { vibrateFeedback } from '@/utils/canvas/pointerEvents';
import type { GestureType } from '@/types/drawingTypes';
import { GestureStateObject } from '@/types/drawingTypes';

/**
 * Hook to handle multi-touch gestures like pinch zoom
 */
export const useMultiTouchGestures = (
  elementRef: React.RefObject<HTMLElement>,
  onGestureUpdate?: (gestureState: GestureStateObject) => void,
  onGestureEnd?: (gestureState: GestureStateObject) => void
) => {
  // Track points and state
  const [touchPoints, setTouchPoints] = useState<Point[]>([]);
  const [gestureState, setGestureState] = useState<GestureStateObject>({
    type: 'pinch',
    startPoints: [],
    currentPoints: [],
    scale: 1,
    rotation: 0,
    translation: { x: 0, y: 0 },
    center: { x: 0, y: 0 }
  });
  const [isGestureActive, setIsGestureActive] = useState(false);
  
  // Calculate distance between two points
  const getDistance = (p1: Point, p2: Point): number => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  };
  
  // Calculate angle between two points
  const getAngle = (p1: Point, p2: Point): number => {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
  };
  
  // Calculate center point
  const getCenter = (p1: Point, p2: Point): Point => {
    return {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2
    };
  };
  
  // Update gesture state based on new touch points
  const updateGestureState = useCallback((newPoints: Point[]) => {
    if (newPoints.length < 2) return;
    
    setGestureState(prevState => {
      // Get initial values if starting gesture
      const startPoints = prevState.startPoints.length ? prevState.startPoints : newPoints;
      const initialDistance = getDistance(startPoints[0], startPoints[1]);
      const initialAngle = getAngle(startPoints[0], startPoints[1]);
      const initialCenter = getCenter(startPoints[0], startPoints[1]);
      
      // Calculate current values
      const currentDistance = getDistance(newPoints[0], newPoints[1]);
      const currentAngle = getAngle(newPoints[0], newPoints[1]);
      const currentCenter = getCenter(newPoints[0], newPoints[1]);
      
      // Calculate scale, rotation, and translation
      const scale = initialDistance ? currentDistance / initialDistance : 1;
      const rotation = currentAngle - initialAngle;
      const translation = {
        x: currentCenter.x - initialCenter.x,
        y: currentCenter.y - initialCenter.y
      };
      
      return {
        ...prevState,
        type: 'pinch' as GestureType,
        startPoints: startPoints,
        currentPoints: newPoints,
        scale,
        rotation,
        translation,
        center: currentCenter
      };
    });
  }, []);
  
  // Handle touch start
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length < 2) return;
    
    // Prevent default to avoid browser gestures
    e.preventDefault();
    
    // Convert touch points to Point array
    const points: Point[] = Array.from(e.touches).map(touch => ({
      x: touch.clientX,
      y: touch.clientY
    }));
    
    setTouchPoints(points);
    
    // Initialize or update gesture state
    setGestureState({
      type: 'pinch',
      startPoints: points,
      currentPoints: points,
      scale: 1,
      rotation: 0,
      translation: { x: 0, y: 0 },
      center: getCenter(points[0], points[1])
    });
    
    setIsGestureActive(true);
    
    // Provide haptic feedback
    vibrateFeedback();
    
  }, []);
  
  // Handle touch move
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isGestureActive || e.touches.length < 2) return;
    
    e.preventDefault();
    
    // Convert touch points to Point array
    const points = Array.from(e.touches).map(touch => ({
      x: touch.clientX,
      y: touch.clientY
    }));
    
    setTouchPoints(points);
    updateGestureState(points);
    
    // Call callback with current gesture state
    if (onGestureUpdate && gestureState) {
      onGestureUpdate({
        ...gestureState,
        currentPoints: points
      });
    }
  }, [isGestureActive, updateGestureState, onGestureUpdate, gestureState]);
  
  // Handle touch end
  const handleTouchEnd = useCallback((e: TouchEvent) => {
    // If there are still at least 2 touches, update with remaining touches
    if (e.touches.length >= 2) {
      const points = Array.from(e.touches).map(touch => ({
        x: touch.clientX,
        y: touch.clientY
      }));
      setTouchPoints(points);
      updateGestureState(points);
      return;
    }
    
    // Otherwise, end the gesture
    if (isGestureActive && onGestureEnd && gestureState) {
      onGestureEnd(gestureState);
    }
    
    setIsGestureActive(false);
    setTouchPoints([]);
  }, [isGestureActive, updateGestureState, onGestureEnd, gestureState]);
  
  // Set up and clean up event listeners
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd);
    element.addEventListener('touchcancel', handleTouchEnd);
    
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [elementRef, handleTouchStart, handleTouchMove, handleTouchEnd]);
  
  return {
    isGestureActive,
    gestureState,
    touchPoints
  };
};
