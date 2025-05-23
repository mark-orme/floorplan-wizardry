
import { useState, useCallback, useRef } from 'react';

// Define the GestureStateObject interface with startPoints
interface GestureStateObject {
  active: boolean;
  startDistance: number;
  currentDistance: number;
  startAngle: number;
  currentAngle: number;
  startPoints: { point1: { x: number; y: number }; point2: { x: number; y: number } } | null;
}

export const useMultiTouchGestures = () => {
  const [gestureState, setGestureState] = useState<GestureStateObject>({
    active: false,
    startDistance: 0,
    currentDistance: 0,
    startAngle: 0,
    currentAngle: 0,
    startPoints: null
  });
  
  const touchesRef = useRef<Touch[]>([]);
  
  // Calculate distance between two points
  const calculateDistance = useCallback((point1: Touch, point2: Touch) => {
    const dx = point2.clientX - point1.clientX;
    const dy = point2.clientY - point1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);
  
  // Calculate angle between two points
  const calculateAngle = useCallback((point1: Touch, point2: Touch) => {
    return Math.atan2(
      point2.clientY - point1.clientY,
      point2.clientX - point1.clientX
    ) * (180 / Math.PI);
  }, []);
  
  // Start tracking a gesture
  const startGesture = useCallback((touches: TouchList) => {
    if (touches.length >= 2) {
      const touch1 = touches[0];
      const touch2 = touches[1];
      const distance = calculateDistance(touch1, touch2);
      const angle = calculateAngle(touch1, touch2);
      
      // Store the touches for later reference
      touchesRef.current = [touch1, touch2];
      
      // Initialize gesture state
      setGestureState({
        active: true,
        startDistance: distance,
        currentDistance: distance,
        startAngle: angle,
        currentAngle: angle,
        startPoints: {
          point1: { x: touch1.clientX, y: touch1.clientY },
          point2: { x: touch2.clientX, y: touch2.clientY }
        }
      });
    }
  }, [calculateDistance, calculateAngle]);
  
  // Update an active gesture
  const updateGesture = useCallback((touches: TouchList) => {
    if (!gestureState.active || touches.length < 2) return;
    
    const touch1 = touches[0];
    const touch2 = touches[1];
    
    // Calculate new distance and angle
    const distance = calculateDistance(touch1, touch2);
    const angle = calculateAngle(touch1, touch2);
    
    // Update gesture state
    setGestureState(prev => ({
      ...prev,
      currentDistance: distance,
      currentAngle: angle
    }));
    
    // Update stored touches
    touchesRef.current = [touch1, touch2];
  }, [gestureState.active, calculateDistance, calculateAngle]);
  
  // End the current gesture
  const endGesture = useCallback(() => {
    setGestureState({
      active: false,
      startDistance: 0,
      currentDistance: 0,
      startAngle: 0,
      currentAngle: 0,
      startPoints: null
    });
    
    // Clear stored touches
    touchesRef.current = [];
  }, []);
  
  // Calculate scale change
  const getScale = useCallback(() => {
    if (!gestureState.active || gestureState.startDistance === 0) return 1;
    
    return gestureState.currentDistance / gestureState.startDistance;
  }, [gestureState.active, gestureState.currentDistance, gestureState.startDistance]);
  
  // Calculate rotation change in degrees
  const getRotation = useCallback(() => {
    if (!gestureState.active) return 0;
    
    // Ensure we have valid start points for calculation
    const sp = gestureState.startPoints;
    if (!sp) return 0;
    
    // Calculate the change in angle
    let angleDiff = gestureState.currentAngle - gestureState.startAngle;
    
    // Normalize to -180 to 180 range
    while (angleDiff > 180) angleDiff -= 360;
    while (angleDiff < -180) angleDiff += 360;
    
    return angleDiff;
  }, [
    gestureState.active, 
    gestureState.currentAngle, 
    gestureState.startAngle,
    gestureState.startPoints
  ]);
  
  return {
    gestureState,
    isGestureActive: gestureState.active,
    startGesture,
    updateGesture,
    endGesture,
    getScale,
    getRotation
  };
};
