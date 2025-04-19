
/**
 * Hook for handling multi-touch gestures on canvas
 * @module hooks/useMultiTouchGestures
 */
import { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { Point, GestureType, GestureState } from '@/types/drawingTypes';
import { vibrateFeedback } from '@/utils/canvas/pointerEvents';
import logger from '@/utils/logger';

interface UseMultiTouchGesturesProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  onZoom?: (scale: number, point: Point) => void;
  onRotate?: (angle: number, point: Point) => void;
  onPan?: (delta: Point) => void;
  onTap?: (point: Point, fingers: number) => void;
  enabled?: boolean;
}

export function useMultiTouchGestures({
  fabricCanvasRef,
  onZoom,
  onRotate,
  onPan,
  onTap,
  enabled = true
}: UseMultiTouchGesturesProps) {
  // Gesture state
  const [activeGesture, setActiveGesture] = useState<GestureState | null>(null);
  
  // Touch tracking references
  const touchesRef = useRef<Record<number, Touch>>({});
  const startTouchesRef = useRef<Record<number, Touch>>({});
  const lastCenterRef = useRef<Point | null>(null);
  const lastDistanceRef = useRef<number | null>(null);
  const lastAngleRef = useRef<number | null>(null);
  const gestureStartTimeRef = useRef<number>(0);
  
  // Calculate center point from touches
  const getCenter = useCallback((touches: Record<number, Touch>): Point => {
    const touchArray = Object.values(touches);
    
    if (touchArray.length === 0) {
      return { x: 0, y: 0 };
    }
    
    const sum = touchArray.reduce(
      (acc, touch) => ({
        x: acc.x + touch.clientX,
        y: acc.y + touch.clientY
      }),
      { x: 0, y: 0 }
    );
    
    return {
      x: sum.x / touchArray.length,
      y: sum.y / touchArray.length
    };
  }, []);
  
  // Calculate distance between touches
  const getDistance = useCallback((touches: Record<number, Touch>): number => {
    const touchArray = Object.values(touches);
    
    if (touchArray.length < 2) {
      return 0;
    }
    
    const dx = touchArray[0].clientX - touchArray[1].clientX;
    const dy = touchArray[0].clientY - touchArray[1].clientY;
    
    return Math.sqrt(dx * dx + dy * dy);
  }, []);
  
  // Calculate angle between touches
  const getAngle = useCallback((touches: Record<number, Touch>): number => {
    const touchArray = Object.values(touches);
    
    if (touchArray.length < 2) {
      return 0;
    }
    
    const dx = touchArray[0].clientX - touchArray[1].clientX;
    const dy = touchArray[0].clientY - touchArray[1].clientY;
    
    return Math.atan2(dy, dx) * (180 / Math.PI);
  }, []);
  
  // Convert client coordinates to canvas coordinates
  const clientToCanvas = useCallback((x: number, y: number): Point => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return { x, y };
    
    const rect = canvas.getElement().getBoundingClientRect();
    const canvasX = x - rect.left;
    const canvasY = y - rect.top;
    
    // Apply canvas zoom and pan
    const point = canvas.getPointer({ clientX: x, clientY: y } as MouseEvent);
    
    return { x: point.x, y: point.y };
  }, [fabricCanvasRef]);
  
  // Handle touch start event
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled) return;
    
    // Store initial touches
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      touchesRef.current[touch.identifier] = touch;
      startTouchesRef.current[touch.identifier] = touch;
    }
    
    const touchCount = Object.keys(touchesRef.current).length;
    
    // Store initial values for gesture tracking
    if (touchCount >= 2) {
      lastCenterRef.current = getCenter(touchesRef.current);
      lastDistanceRef.current = getDistance(touchesRef.current);
      lastAngleRef.current = getAngle(touchesRef.current);
      gestureStartTimeRef.current = Date.now();
      
      // Provide haptic feedback for multi-touch gesture start
      vibrateFeedback(10);
      
      e.preventDefault();
    }
  }, [enabled, getCenter, getDistance, getAngle]);
  
  // Handle touch move event
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!enabled) return;
    
    // Update current touches
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      touchesRef.current[touch.identifier] = touch;
    }
    
    const touchCount = Object.keys(touchesRef.current).length;
    
    if (touchCount >= 2) {
      // Calculate current values
      const currentCenter = getCenter(touchesRef.current);
      const currentDistance = getDistance(touchesRef.current);
      const currentAngle = getAngle(touchesRef.current);
      
      // Process multi-touch gestures
      if (lastCenterRef.current && lastDistanceRef.current && lastAngleRef.current) {
        // Handle pinch-to-zoom
        if (Math.abs(currentDistance - lastDistanceRef.current) > 10) {
          const scale = currentDistance / lastDistanceRef.current;
          
          setActiveGesture({
            type: GestureType.PINCH,
            center: currentCenter,
            scale
          });
          
          if (onZoom) {
            const canvasPoint = clientToCanvas(currentCenter.x, currentCenter.y);
            onZoom(scale, canvasPoint);
          }
          
          lastDistanceRef.current = currentDistance;
        }
        
        // Handle rotation
        const angleDiff = currentAngle - lastAngleRef.current;
        if (Math.abs(angleDiff) > 5) {
          setActiveGesture({
            type: GestureType.ROTATE,
            center: currentCenter,
            rotation: angleDiff
          });
          
          if (onRotate) {
            const canvasPoint = clientToCanvas(currentCenter.x, currentCenter.y);
            onRotate(angleDiff, canvasPoint);
          }
          
          lastAngleRef.current = currentAngle;
        }
        
        // Handle panning
        const deltaX = currentCenter.x - lastCenterRef.current.x;
        const deltaY = currentCenter.y - lastCenterRef.current.y;
        
        if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
          setActiveGesture({
            type: GestureType.PAN,
            center: currentCenter,
            distance: Math.sqrt(deltaX * deltaX + deltaY * deltaY)
          });
          
          if (onPan) {
            onPan({ x: deltaX, y: deltaY });
          }
          
          lastCenterRef.current = currentCenter;
        }
      }
      
      e.preventDefault();
    }
  }, [enabled, getCenter, getDistance, getAngle, onZoom, onRotate, onPan, clientToCanvas]);
  
  // Handle touch end event
  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!enabled) return;
    
    // Remove ended touches
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      delete touchesRef.current[touch.identifier];
      delete startTouchesRef.current[touch.identifier];
    }
    
    const touchCount = Object.keys(touchesRef.current).length;
    
    // If all touches have ended, check for tap gestures
    if (touchCount === 0) {
      // Check how many fingers were used
      const fingerCount = e.changedTouches.length;
      const gestureTime = Date.now() - gestureStartTimeRef.current;
      
      // Detect tap gestures (short duration, little movement)
      if (gestureTime < 300 && onTap) {
        const center = getCenter({
          ...Object.fromEntries(
            Array.from(e.changedTouches).map(touch => [touch.identifier, touch])
          )
        });
        
        const canvasPoint = clientToCanvas(center.x, center.y);
        
        // Determine gesture type based on finger count
        let gestureType: GestureType;
        switch (fingerCount) {
          case 1:
            gestureType = GestureType.TAP;
            break;
          case 2:
            gestureType = GestureType.TWOFINGERTAP;
            vibrateFeedback([10, 20]);
            break;
          case 3:
            gestureType = GestureType.THREEFINGERTAP;
            vibrateFeedback([10, 20, 10]);
            break;
          case 4:
          default:
            gestureType = GestureType.FOURFINGERTAP;
            vibrateFeedback([10, 20, 10, 20]);
            break;
        }
        
        setActiveGesture({
          type: gestureType,
          center,
          fingers: fingerCount
        });
        
        onTap(canvasPoint, fingerCount);
      }
      
      // Reset active gesture
      setActiveGesture(null);
      
      // Reset reference values
      lastCenterRef.current = null;
      lastDistanceRef.current = null;
      lastAngleRef.current = null;
    }
  }, [enabled, getCenter, onTap, clientToCanvas]);
  
  // Attach event listeners
  useEffect(() => {
    if (!enabled) return;
    
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const canvasEl = canvas.getElement();
    
    canvasEl.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvasEl.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvasEl.addEventListener('touchend', handleTouchEnd);
    canvasEl.addEventListener('touchcancel', handleTouchEnd);
    
    logger.info('Multi-touch gesture handlers attached');
    
    return () => {
      canvasEl.removeEventListener('touchstart', handleTouchStart);
      canvasEl.removeEventListener('touchmove', handleTouchMove);
      canvasEl.removeEventListener('touchend', handleTouchEnd);
      canvasEl.removeEventListener('touchcancel', handleTouchEnd);
      
      logger.info('Multi-touch gesture handlers removed');
    };
  }, [
    enabled,
    fabricCanvasRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  ]);
  
  return {
    activeGesture,
    isGestureActive: !!activeGesture
  };
}
