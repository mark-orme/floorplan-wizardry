
import { useCallback, useRef } from 'react';

interface TouchData {
  clientX: number;
  clientY: number;
  identifier: number;
}

export const useMultiTouchGestures = () => {
  const touchStartRef = useRef<TouchData[]>([]);
  const lastDistanceRef = useRef<number>(0);
  
  const getTouchDistance = useCallback((touch1: TouchData, touch2: TouchData): number => {
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);
  
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length >= 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      
      if (touch1 && touch2) {
        touchStartRef.current = [
          { clientX: touch1.clientX, clientY: touch1.clientY, identifier: touch1.identifier },
          { clientX: touch2.clientX, clientY: touch2.clientY, identifier: touch2.identifier }
        ];
        
        const startTouch1 = touchStartRef.current[0];
        const startTouch2 = touchStartRef.current[1];
        if (startTouch1 && startTouch2) {
          lastDistanceRef.current = getTouchDistance(startTouch1, startTouch2);
        }
      }
    }
  }, [getTouchDistance]);
  
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length >= 2 && touchStartRef.current.length >= 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      
      if (touch1 && touch2) {
        const currentTouch1 = { clientX: touch1.clientX, clientY: touch1.clientY, identifier: touch1.identifier };
        const currentTouch2 = { clientX: touch2.clientX, clientY: touch2.clientY, identifier: touch2.identifier };
        
        const currentDistance = getTouchDistance(currentTouch1, currentTouch2);
        const scale = currentDistance / lastDistanceRef.current;
        
        // Handle zoom gesture
        console.log('Zoom scale:', scale);
        
        lastDistanceRef.current = currentDistance;
      }
    }
  }, [getTouchDistance]);
  
  const handleTouchEnd = useCallback(() => {
    touchStartRef.current = [];
    lastDistanceRef.current = 0;
  }, []);
  
  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
};
