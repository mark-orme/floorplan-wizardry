import { useState, useCallback, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { Point } from '@/types/core/Point';

interface UseDrawingGesturesProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  onZoom?: (scale: number, point: Point) => void;
  onPan?: (point: Point) => void;
  onRotate?: (angle: number) => void;
}

export const useDrawingGestures = ({
  fabricCanvasRef,
  onZoom,
  onPan,
  onRotate
}: UseDrawingGesturesProps = {}) => {
  const [isGesturing, setIsGesturing] = useState(false);
  const [initialDistance, setInitialDistance] = useState(0);
  const [initialAngle, setInitialAngle] = useState(0);
  const [initialCenter, setInitialCenter] = useState<Point>({ x: 0, y: 0 });
  const lastCenterRef = useRef<Point>({ x: 0, y: 0 });
  
  const calculateDistance = (touch1?: Touch, touch2?: Touch): number => {
    // Add null checks to prevent errors
    if (!touch1 || !touch2) return 0;
    
    const dx = (touch2?.clientX ?? 0) - (touch1?.clientX ?? 0);
    const dy = (touch2?.clientY ?? 0) - (touch1?.clientY ?? 0);
    return Math.sqrt(dx * dx + dy * dy);
  };
  
  const calculateCenter = (touch1?: Touch, touch2?: Touch): { x: number, y: number } => {
    // Add null checks to prevent errors
    if (!touch1 || !touch2) {
      return { x: 0, y: 0 };
    }
    
    return {
      x: ((touch1?.clientX ?? 0) + (touch2?.clientX ?? 0)) / 2,
      y: ((touch1?.clientY ?? 0) + (touch2?.clientY ?? 0)) / 2
    };
  };
  
  const calculateAngle = (touch1?: Touch, touch2?: Touch): number => {
    if (!touch1 || !touch2) return 0;
    
    return Math.atan2(
      (touch2.clientY ?? 0) - (touch1.clientY ?? 0),
      (touch2.clientX ?? 0) - (touch1.clientX ?? 0)
    ) * (180 / Math.PI);
  };
  
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length !== 2) return;
    
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    
    if (!touch1 || !touch2) return;
    
    setIsGesturing(true);
    setInitialDistance(calculateDistance(touch1, touch2));
    setInitialAngle(calculateAngle(touch1, touch2));
    
    const center = calculateCenter(touch1, touch2);
    setInitialCenter(center);
    lastCenterRef.current = center;
    
    // Safely call functions with null checks
    if (touch1 && touch2 && fabricCanvasRef.current) {
      fabricCanvasRef.current.requestRenderAll();
    }
  }, [fabricCanvasRef]);
  
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isGesturing || e.touches.length !== 2) return;
    
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    
    if (!touch1 || !touch2) return;
    
    // Calculate current values
    const currentDistance = calculateDistance(touch1, touch2);
    const currentAngle = calculateAngle(touch1, touch2);
    const currentCenter = calculateCenter(touch1, touch2);
    
    // Calculate scale factor
    if (initialDistance > 0) {
      const scaleFactor = currentDistance / initialDistance;
      
      if (onZoom) {
        onZoom(scaleFactor, currentCenter);
      } else if (fabricCanvasRef.current) {
        // Default zoom behavior
        const canvas = fabricCanvasRef.current;
        const zoom = canvas.getZoom() * scaleFactor;
        
        // Limit zoom level
        const limitedZoom = Math.min(Math.max(0.1, zoom), 10);
        
        canvas.zoomToPoint(
          { x: currentCenter.x, y: currentCenter.y },
          limitedZoom
        );
      }
    }
    
    // Calculate rotation angle
    const angleDiff = currentAngle - initialAngle;
    if (onRotate) {
      onRotate(angleDiff);
    }
    
    // Calculate pan offset
    const dx = currentCenter.x - lastCenterRef.current.x;
    const dy = currentCenter.y - lastCenterRef.current.y;
    
    if (onPan) {
      onPan({ x: dx, y: dy });
    } else if (fabricCanvasRef.current) {
      // Default pan behavior
      const canvas = fabricCanvasRef.current;
      const vpt = canvas.viewportTransform;
      
      if (vpt) {
        vpt[4] += dx;
        vpt[5] += dy;
        canvas.requestRenderAll();
      }
    }
    
    // Update last center
    lastCenterRef.current = currentCenter;
    
    // Prevent default to avoid page scrolling
    e.preventDefault();
  }, [isGesturing, initialDistance, initialAngle, onZoom, onPan, onRotate, fabricCanvasRef]);
  
  const handleTouchEnd = useCallback(() => {
    setIsGesturing(false);
  }, []);
  
  const attachGestureHandlers = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !canvas.wrapperEl) return;
    
    const wrapperEl = canvas.wrapperEl;
    
    wrapperEl.addEventListener('touchstart', handleTouchStart);
    wrapperEl.addEventListener('touchmove', handleTouchMove);
    wrapperEl.addEventListener('touchend', handleTouchEnd);
    wrapperEl.addEventListener('touchcancel', handleTouchEnd);
    
    return () => {
      wrapperEl.removeEventListener('touchstart', handleTouchStart);
      wrapperEl.removeEventListener('touchmove', handleTouchMove);
      wrapperEl.removeEventListener('touchend', handleTouchEnd);
      wrapperEl.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [fabricCanvasRef, handleTouchStart, handleTouchMove, handleTouchEnd]);
  
  return {
    isGesturing,
    attachGestureHandlers,
    calculateDistance,
    calculateCenter,
    calculateAngle
  };
};

export default useDrawingGestures;
