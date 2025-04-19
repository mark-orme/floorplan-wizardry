/**
 * Custom hook for handling multi-touch gestures on a canvas
 * @module hooks/useMultiTouchGestures
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { Point } from '@/types/core/Point';
import { GestureType, GestureState } from '@/types/drawingTypes';
import { vibrateFeedback } from '@/utils/canvas/pointerEvents';

interface UseMultiTouchGesturesProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

/**
 * Custom hook for handling multi-touch gestures on a canvas
 */
export const useMultiTouchGestures = ({ canvasRef }: UseMultiTouchGesturesProps) => {
  const [gestureState, setGestureState] = useState<GestureState>({
    type: GestureType.NONE,
    startPoints: [],
    currentPoints: [],
    scale: 1,
    rotation: 0,
    translation: { x: 0, y: 0 }
  });
  
  const touchPoints = useRef<Point[]>([]);
  
  // Utility function to calculate the distance between two points
  const getDistance = (p1: Point, p2: Point): number => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  };
  
  // Utility function to calculate the midpoint between two points
  const getMidpoint = (p1: Point, p2: Point): Point => ({
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2
  });
  
  // Utility function to calculate the angle between two points
  const getAngle = (p1: Point, p2: Point): number => {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
  };
  
  // Handler for pan gesture
  const handlePanGesture = useCallback((e: TouchEvent) => {
    if (e.touches.length !== 1) return;
    
    const currentTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    
    setGestureState(prevState => ({
      type: GestureType.PAN,
      startPoints: [currentTouch],
      currentPoints: [currentTouch],
      scale: 1,
      rotation: 0,
      translation: {
        x: currentTouch.x - (prevState.startPoints[0]?.x || 0),
        y: currentTouch.y - (prevState.startPoints[0]?.y || 0)
      },
      center: currentTouch
    }));
  }, []);
  
  // Handler for pinch gesture start
  const handlePinchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length !== 2) return;
    
    // Get the touch points
    const touch1 = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    const touch2 = { x: e.touches[1].clientX, y: e.touches[1].clientY };
    
    // Calculate center point
    const centerX = (touch1.x + touch2.x) / 2;
    const centerY = (touch1.y + touch2.y) / 2;
    
    // Calculate initial distance
    const dx = touch1.x - touch2.x;
    const dy = touch1.y - touch2.y;
    const initialDistance = Math.sqrt(dx * dx + dy * dy);
    
    setGestureState({
      type: GestureType.PINCH,
      startPoints: [touch1, touch2],
      currentPoints: [touch1, touch2],
      scale: 1,
      rotation: 0,
      translation: { x: 0, y: 0 },
      center: { x: centerX, y: centerY }
    });
  }, []);
  
  // Handler for pinch gesture move
  const handlePinchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length !== 2 || gestureState.type !== GestureType.PINCH) return;
    
    // Get the touch points
    const touch1 = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    const touch2 = { x: e.touches[1].clientX, y: e.touches[1].clientY };
    
    // Calculate current distance
    const dx = touch1.x - touch2.x;
    const dy = touch1.y - touch2.y;
    const currentDistance = Math.sqrt(dx * dx + dy * dy);
    
    // Calculate scale
    const initialDistance = getDistance(gestureState.startPoints[0], gestureState.startPoints[1]);
    const scale = currentDistance / initialDistance;
    
    // Calculate center point
    const centerX = (touch1.x + touch2.x) / 2;
    const centerY = (touch1.y + touch2.y) / 2;
    
    setGestureState(prevState => ({
      ...prevState,
      currentPoints: [touch1, touch2],
      scale: scale,
      center: { x: centerX, y: centerY }
    }));
  }, [gestureState, getDistance]);
  
  // Handler for rotate gesture start
  const handleRotateStart = useCallback((e: TouchEvent) => {
    if (e.touches.length !== 2) return;
    
    // Get the touch points
    const touch1 = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    const touch2 = { x: e.touches[1].clientX, y: e.touches[1].clientY };
    
    // Calculate initial angle
    const initialAngle = getAngle(touch1, touch2);
    
    setGestureState({
      type: GestureType.ROTATE,
      startPoints: [touch1, touch2],
      currentPoints: [touch1, touch2],
      scale: 1,
      rotation: 0,
      translation: { x: 0, y: 0 },
      center: getMidpoint(touch1, touch2)
    });
  }, [getAngle]);
  
  // Handler for rotate gesture move
  const handleRotateMove = useCallback((e: TouchEvent) => {
    if (e.touches.length !== 2 || gestureState.type !== GestureType.ROTATE) return;
    
    // Get the touch points
    const touch1 = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    const touch2 = { x: e.touches[1].clientX, y: e.touches[1].clientY };
    
    // Calculate current angle
    const currentAngle = getAngle(touch1, touch2);
    
    // Calculate rotation
    const initialAngle = getAngle(gestureState.startPoints[0], gestureState.startPoints[1]);
    const rotation = currentAngle - initialAngle;
    
    setGestureState(prevState => ({
      ...prevState,
      currentPoints: [touch1, touch2],
      rotation: rotation,
      center: getMidpoint(touch1, touch2)
    }));
  }, [gestureState, getAngle, getMidpoint]);
  
  // Handler for tap gestures
  const handleTapGesture = useCallback((touchCount: number, duration: number) => {
    let gestureType: GestureType;
    
    switch (touchCount) {
      case 1:
        gestureType = GestureType.TAP;
        vibrateFeedback(duration);
        break;
      case 2:
        gestureType = GestureType.TWOFINGERTAP;
        vibrateFeedback(duration);
        break;
      case 3:
        gestureType = GestureType.THREEFINGERTAP;
        vibrateFeedback(duration);
        break;
      case 4:
        gestureType = GestureType.FOURFINGERTAP;
        vibrateFeedback(duration);
        break;
      default:
        return;
    }
    
    // Calculate the center point of all touches
    const centerX = touchPoints.current.reduce((sum, p) => sum + p.x, 0) / touchCount;
    const centerY = touchPoints.current.reduce((sum, p) => sum + p.y, 0) / touchCount;
    
    setGestureState({
      type: gestureType,
      startPoints: [...touchPoints.current],
      currentPoints: [...touchPoints.current],
      scale: 1,
      rotation: 0,
      translation: { x: 0, y: 0 },
      center: { x: centerX, y: centerY }
    });
  }, []);
  
  // Handler for touch start event
  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchPoints.current = Array.from(e.touches).map(touch => ({
      x: touch.clientX,
      y: touch.clientY
    }));
    
    if (e.touches.length === 1) {
      handlePanGesture(e);
    } else if (e.touches.length === 2) {
      handlePinchStart(e);
      handleRotateStart(e);
    }
  }, [handlePanGesture, handlePinchStart, handleRotateStart]);
  
  // Handler for touch move event
  const handleTouchMove = useCallback((e: TouchEvent) => {
    touchPoints.current = Array.from(e.touches).map(touch => ({
      x: touch.clientX,
      y: touch.clientY
    }));
    
    if (e.touches.length === 1 && gestureState.type === GestureType.PAN) {
      handlePanGesture(e);
    } else if (e.touches.length === 2 && gestureState.type === GestureType.PINCH) {
      handlePinchMove(e);
    } else if (e.touches.length === 2 && gestureState.type === GestureType.ROTATE) {
      handleRotateMove(e);
    }
  }, [gestureState.type, handlePanGesture, handlePinchMove, handleRotateMove]);
  
  // Handler for touch end event
  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (e.touches.length < 2 && gestureState.type === GestureType.PINCH) {
      setGestureState(prevState => ({
        ...prevState,
        type: GestureType.NONE
      }));
    } else if (e.touches.length < 2 && gestureState.type === GestureType.ROTATE) {
      setGestureState(prevState => ({
        ...prevState,
        type: GestureType.NONE
      }));
    } else if (e.touches.length === 0 && gestureState.type === GestureType.PAN) {
      setGestureState(prevState => ({
        ...prevState,
        type: GestureType.NONE
      }));
    }
  }, [gestureState.type]);
  
  // Handler for double tap event
  const handleDoubleTap = useCallback(() => {
    handleTapGesture(2, 50);
  }, [handleTapGesture]);
  
  // Attach event listeners to the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    
    if (!canvas) return;
    
    // Add event listeners
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);
    
    // Add double tap listener
    canvas.addEventListener('dblclick', handleDoubleTap);
    
    // Remove event listeners on cleanup
    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('dblclick', handleDoubleTap);
    };
  }, [canvasRef, handleTouchStart, handleTouchMove, handleTouchEnd, handleDoubleTap]);
  
  return {
    gestureState
  };
};
