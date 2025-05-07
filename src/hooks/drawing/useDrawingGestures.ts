
import { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { Point } from '@/types/core/Point';

interface UseDrawingGesturesProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  onGesture?: (type: string, data: any) => void;
}

export const useDrawingGestures = (props: UseDrawingGesturesProps = { fabricCanvasRef: { current: null } }) => {
  const { fabricCanvasRef, onGesture } = props;
  const touchesRef = useRef<Record<number, Touch>>({});
  const lastDistanceRef = useRef<number>(0);
  const lastAngleRef = useRef<number>(0);
  
  // Calculate distance between touch points
  const calculateDistance = useCallback((touch1?: Touch, touch2?: Touch): number => {
    if (!touch1 || !touch2) return 0;
    
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);
  
  // Calculate angle between touch points
  const calculateAngle = useCallback((touch1?: Touch, touch2?: Touch): number => {
    if (!touch1 || !touch2) return 0;
    
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.atan2(dy, dx) * 180 / Math.PI;
  }, []);
  
  // Handle touchstart event
  const handleTouchStart = useCallback((e: TouchEvent) => {
    // Store touch points
    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches[i];
      touchesRef.current[touch.identifier] = touch;
    }
    
    // Get touch points
    const touches = Object.values(touchesRef.current);
    const touch1 = touches[0];
    const touch2 = touches[1];
    
    // Handle multi-touch gesture start
    if (touch1 && touch2) {
      lastDistanceRef.current = calculateDistance(touch1, touch2);
      lastAngleRef.current = calculateAngle(touch1, touch2);
      
      if (onGesture) {
        onGesture('gesturestart', {
          distance: lastDistanceRef.current,
          angle: lastAngleRef.current
        });
      }
    }
  }, [calculateDistance, calculateAngle, onGesture]);
  
  // Handle touchmove event
  const handleTouchMove = useCallback((e: TouchEvent) => {
    // Update touch points
    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches[i];
      touchesRef.current[touch.identifier] = touch;
    }
    
    // Get touch points
    const touches = Object.values(touchesRef.current);
    const touch1 = touches[0];
    const touch2 = touches[1];
    
    // Handle multi-touch gesture move
    if (touch1 && touch2) {
      const distance = calculateDistance(touch1, touch2);
      const angle = calculateAngle(touch1, touch2);
      
      // Calculate scaling and rotation
      const scale = distance / (lastDistanceRef.current || 1);
      const rotation = angle - lastAngleRef.current;
      
      lastDistanceRef.current = distance;
      lastAngleRef.current = angle;
      
      if (onGesture) {
        onGesture('gesturemove', {
          scale,
          rotation,
          distance,
          angle
        });
      }
      
      // Apply zoom on pinch gesture
      if (fabricCanvasRef.current && Math.abs(scale - 1) > 0.05) {
        const canvas = fabricCanvasRef.current;
        const center = {
          x: (touch1.clientX + touch2.clientX) / 2,
          y: (touch1.clientY + touch2.clientY) / 2
        };
        
        const pointer = canvas.getPointer ? canvas.getPointer({ clientX: center.x, clientY: center.y } as any) : center;
        
        if (canvas.zoomToPoint && pointer) {
          const currentZoom = canvas.getZoom ? canvas.getZoom() : 1;
          const newZoom = currentZoom * scale;
          canvas.zoomToPoint({ x: pointer.x, y: pointer.y }, newZoom);
          
          if (typeof e.preventDefault === 'function') {
            e.preventDefault();
          }
        }
      }
    }
  }, [calculateDistance, calculateAngle, onGesture, fabricCanvasRef]);
  
  // Handle touchend and touchcancel events
  const handleTouchEnd = useCallback((e: TouchEvent) => {
    // Remove ended touches
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      delete touchesRef.current[touch.identifier];
    }
    
    // Get remaining touches
    const touches = Object.values(touchesRef.current);
    
    // Handle gesture end when less than 2 touches remain
    if (touches.length < 2 && onGesture) {
      onGesture('gestureend', {
        touches: touches.length
      });
    }
  }, [onGesture]);
  
  // Add and remove event listeners
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    
    if (!canvas || !canvas.upperCanvasEl) return;
    
    const el = canvas.upperCanvasEl;
    
    el.addEventListener('touchstart', handleTouchStart);
    el.addEventListener('touchmove', handleTouchMove);
    el.addEventListener('touchend', handleTouchEnd);
    el.addEventListener('touchcancel', handleTouchEnd);
    
    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
      el.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [fabricCanvasRef, handleTouchStart, handleTouchMove, handleTouchEnd]);
  
  return {
    touchCount: Object.keys(touchesRef.current).length
  };
};
