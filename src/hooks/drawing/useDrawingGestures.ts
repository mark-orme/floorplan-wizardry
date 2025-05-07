
import { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, Point } from 'fabric';

interface UseDrawingGesturesProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  isEnabled?: boolean;
  onGestureStart?: (point: Point) => void;
  onGestureMove?: (point: Point) => void;
  onGestureEnd?: (point: Point) => void;
  onTwoFingerGesture?: (scale: number, rotation: number) => void;
}

export const useDrawingGestures = ({
  fabricCanvasRef,
  isEnabled = true,
  onGestureStart,
  onGestureMove,
  onGestureEnd,
  onTwoFingerGesture
}: UseDrawingGesturesProps) => {
  const lastPointRef = useRef<Point | null>(null);
  const initialDistanceRef = useRef<number>(0);
  const initialAngleRef = useRef<number>(0);
  const [gesturing, setGesturing] = useState(false);
  
  useEffect(() => {
    if (!isEnabled) return;
    
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Touch start handler
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault(); // Prevent scrolling
      
      if (e.touches.length === 1) {
        // Single touch - drawing
        const touch = e.touches[0];
        if (!touch) return;
        
        const point = new Point(
          touch.clientX - canvas.upperCanvasEl!.getBoundingClientRect().left,
          touch.clientY - canvas.upperCanvasEl!.getBoundingClientRect().top
        );
        
        lastPointRef.current = point;
        setGesturing(true);
        
        if (onGestureStart) {
          onGestureStart(point);
        }
      } else if (e.touches.length === 2) {
        // Two finger gesture - pinch zoom and rotate
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        
        if (!touch1 || !touch2) return;
        
        // Calculate initial distance and angle for reference
        const dx = touch2.clientX - touch1.clientX;
        const dy = touch2.clientY - touch1.clientY;
        
        initialDistanceRef.current = Math.sqrt(dx * dx + dy * dy);
        initialAngleRef.current = Math.atan2(dy, dx);
      }
    };
    
    // Touch move handler
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault(); // Prevent scrolling
      
      if (e.touches.length === 1 && gesturing) {
        // Single touch - drawing
        const touch = e.touches[0];
        if (!touch) return;
        
        const point = new Point(
          touch.clientX - canvas.upperCanvasEl!.getBoundingClientRect().left,
          touch.clientY - canvas.upperCanvasEl!.getBoundingClientRect().top
        );
        
        lastPointRef.current = point;
        
        if (onGestureMove) {
          onGestureMove(point);
        }
      } else if (e.touches.length === 2) {
        // Two finger gesture - pinch zoom and rotate
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        
        if (!touch1 || !touch2) return;
        
        // Calculate current distance and angle
        const dx = touch2.clientX - touch1.clientX;
        const dy = touch2.clientY - touch1.clientY;
        
        const currentDistance = Math.sqrt(dx * dx + dy * dy);
        const currentAngle = Math.atan2(dy, dx);
        
        // Calculate scale and rotation changes
        const scale = currentDistance / initialDistanceRef.current;
        const rotation = (currentAngle - initialAngleRef.current) * (180 / Math.PI);
        
        if (onTwoFingerGesture) {
          onTwoFingerGesture(scale, rotation);
        }
      }
    };
    
    // Touch end handler
    const handleTouchEnd = (e: TouchEvent) => {
      if (gesturing && lastPointRef.current && onGestureEnd) {
        onGestureEnd(lastPointRef.current);
      }
      
      if (e.touches.length === 0) {
        // All touches ended
        setGesturing(false);
        lastPointRef.current = null;
        initialDistanceRef.current = 0;
        initialAngleRef.current = 0;
      } else if (e.touches.length === 1) {
        // One finger left - update last point
        const touch = e.touches[0];
        if (touch && canvas.upperCanvasEl) {
          const point = new Point(
            touch.clientX - canvas.upperCanvasEl.getBoundingClientRect().left,
            touch.clientY - canvas.upperCanvasEl.getBoundingClientRect().top
          );
          
          lastPointRef.current = point;
        }
      }
    };
    
    // Attach event listeners to the canvas element
    if (canvas.upperCanvasEl) {
      canvas.upperCanvasEl.addEventListener('touchstart', handleTouchStart, { passive: false });
      canvas.upperCanvasEl.addEventListener('touchmove', handleTouchMove, { passive: false });
      canvas.upperCanvasEl.addEventListener('touchend', handleTouchEnd);
      canvas.upperCanvasEl.addEventListener('touchcancel', handleTouchEnd);
    }
    
    // Cleanup
    return () => {
      if (canvas.upperCanvasEl) {
        canvas.upperCanvasEl.removeEventListener('touchstart', handleTouchStart);
        canvas.upperCanvasEl.removeEventListener('touchmove', handleTouchMove);
        canvas.upperCanvasEl.removeEventListener('touchend', handleTouchEnd);
        canvas.upperCanvasEl.removeEventListener('touchcancel', handleTouchEnd);
      }
    };
  }, [fabricCanvasRef, isEnabled, gesturing, onGestureStart, onGestureMove, onGestureEnd, onTwoFingerGesture]);
  
  return {
    isGesturing: gesturing,
    lastPoint: lastPointRef.current
  };
};
