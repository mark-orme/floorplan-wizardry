
/**
 * Hook for enhanced multi-touch gestures
 * Supports advanced gestures beyond standard pinch/zoom
 * @module hooks/useMultiTouchGestures
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import logger from '@/utils/logger';
import { vibrateFeedback } from '@/utils/canvas/pointerEvents';

// Gesture types
export enum GestureType {
  NONE = 'none',
  PINCH = 'pinch',
  ROTATE = 'rotate',
  PAN = 'pan',
  SWIPE = 'swipe',
  TAP = 'tap',
  LONG_PRESS = 'long-press',
  THREE_FINGER = 'three-finger',
  FOUR_FINGER = 'four-finger'
}

// Gesture directions
export enum GestureDirection {
  NONE = 'none',
  UP = 'up',
  DOWN = 'down',
  LEFT = 'left',
  RIGHT = 'right'
}

// Gesture state
export interface GestureState {
  active: boolean;
  type: GestureType;
  direction: GestureDirection;
  touchCount: number;
  scale: number;
  rotation: number;
  x: number;
  y: number;
  deltaX: number;
  deltaY: number;
  velocity: number;
}

// Gesture handlers
export interface GestureHandlers {
  onPinch?: (scale: number, center: { x: number, y: number }) => void;
  onRotate?: (angle: number, center: { x: number, y: number }) => void;
  onPan?: (deltaX: number, deltaY: number) => void;
  onSwipe?: (direction: GestureDirection, velocity: number) => void;
  onTap?: (x: number, y: number, count: number) => void;
  onLongPress?: (x: number, y: number) => void;
  onThreeFingerGesture?: (direction: GestureDirection) => void;
  onFourFingerGesture?: (direction: GestureDirection) => void;
}

// Default gesture state
const DEFAULT_GESTURE_STATE: GestureState = {
  active: false,
  type: GestureType.NONE,
  direction: GestureDirection.NONE,
  touchCount: 0,
  scale: 1,
  rotation: 0,
  x: 0,
  y: 0,
  deltaX: 0,
  deltaY: 0,
  velocity: 0
};

// Constants
const SWIPE_THRESHOLD = 30; // Minimum distance in pixels for a swipe
const SWIPE_VELOCITY_THRESHOLD = 0.5; // Minimum velocity for a swipe
const LONG_PRESS_THRESHOLD = 500; // Milliseconds for long press
const MULTI_FINGER_GESTURE_THRESHOLD = 50; // Minimum distance for multi-finger gestures

/**
 * Hook for handling advanced multi-touch gestures
 * 
 * @param params Hook parameters
 * @returns Gesture state and handlers
 */
export function useMultiTouchGestures({
  fabricCanvasRef,
  enabled = true,
  handlers = {},
  applyToCanvas = true,
  provideFeedback = true
}: {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  enabled?: boolean;
  handlers?: GestureHandlers;
  applyToCanvas?: boolean;
  provideFeedback?: boolean;
}) {
  // State and refs
  const [gestureState, setGestureState] = useState<GestureState>(DEFAULT_GESTURE_STATE);
  const touchesRef = useRef<Touch[]>([]);
  const startPointsRef = useRef<{ [id: number]: { x: number; y: number; time: number } }>({});
  const lastPointsRef = useRef<{ [id: number]: { x: number; y: number; time: number } }>({});
  const initialDistanceRef = useRef<number>(0);
  const initialAngleRef = useRef<number>(0);
  const longPressTimeoutRef = useRef<number | null>(null);
  
  // Helper to get the center of two touches
  const getTouchCenter = useCallback((touches: Touch[]): { x: number; y: number } => {
    if (touches.length === 0) return { x: 0, y: 0 };
    
    let sumX = 0;
    let sumY = 0;
    
    for (const touch of touches) {
      sumX += touch.clientX;
      sumY += touch.clientY;
    }
    
    return {
      x: sumX / touches.length,
      y: sumY / touches.length
    };
  }, []);
  
  // Calculate distance between two points
  const getDistance = useCallback((p1: Touch, p2: Touch): number => {
    const dx = p1.clientX - p2.clientX;
    const dy = p1.clientY - p2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);
  
  // Calculate angle between two points
  const getAngle = useCallback((p1: Touch, p2: Touch): number => {
    return Math.atan2(p2.clientY - p1.clientY, p2.clientX - p1.clientX) * 180 / Math.PI;
  }, []);
  
  // Get swipe direction
  const getSwipeDirection = useCallback((dx: number, dy: number): GestureDirection => {
    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? GestureDirection.RIGHT : GestureDirection.LEFT;
    } else {
      return dy > 0 ? GestureDirection.DOWN : GestureDirection.UP;
    }
  }, []);
  
  // Apply gesture to canvas
  const applyGestureToCanvas = useCallback((type: GestureType, data: any) => {
    if (!applyToCanvas || !fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    
    switch (type) {
      case GestureType.PINCH: {
        const { scale, center } = data;
        // Convert client coordinates to canvas coordinates
        const rect = canvas.getElement().getBoundingClientRect();
        const point = {
          x: (center.x - rect.left) / canvas.getZoom(),
          y: (center.y - rect.top) / canvas.getZoom()
        };
        
        // Apply zoom at point
        const newZoom = canvas.getZoom() * scale;
        canvas.zoomToPoint(point, newZoom);
        break;
      }
      case GestureType.PAN: {
        const { deltaX, deltaY } = data;
        // Pan the canvas
        const viewportTransform = canvas.viewportTransform;
        if (viewportTransform) {
          viewportTransform[4] += deltaX;
          viewportTransform[5] += deltaY;
          canvas.requestRenderAll();
        }
        break;
      }
      case GestureType.THREE_FINGER: {
        const { direction } = data;
        // Three finger gestures - undo/redo
        if (direction === GestureDirection.LEFT) {
          // Trigger undo
          document.dispatchEvent(new CustomEvent('fabric:undo'));
        } else if (direction === GestureDirection.RIGHT) {
          // Trigger redo
          document.dispatchEvent(new CustomEvent('fabric:redo'));
        }
        break;
      }
      case GestureType.FOUR_FINGER: {
        const { direction } = data;
        // Four finger gestures - special actions
        if (direction === GestureDirection.UP) {
          // Reset zoom and center canvas
          canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
        } else if (direction === GestureDirection.DOWN) {
          // Save canvas state
          document.dispatchEvent(new CustomEvent('fabric:save'));
        }
        break;
      }
    }
  }, [applyToCanvas, fabricCanvasRef]);
  
  // Touch handlers
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled) return;
    
    // Store touches
    touchesRef.current = Array.from(e.touches);
    
    // Save starting positions
    for (const touch of e.touches) {
      startPointsRef.current[touch.identifier] = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
      };
      lastPointsRef.current[touch.identifier] = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
      };
    }
    
    // Update state
    setGestureState({
      ...DEFAULT_GESTURE_STATE,
      active: true,
      touchCount: e.touches.length,
      x: getTouchCenter(Array.from(e.touches)).x,
      y: getTouchCenter(Array.from(e.touches)).y
    });
    
    // Initialize gesture data
    if (e.touches.length === 2) {
      // Two-finger gesture - initialize distance and angle
      initialDistanceRef.current = getDistance(e.touches[0], e.touches[1]);
      initialAngleRef.current = getAngle(e.touches[0], e.touches[1]);
    }
    
    // Set up long press timer
    if (e.touches.length === 1) {
      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current);
      }
      
      longPressTimeoutRef.current = window.setTimeout(() => {
        // Only trigger if still one finger and hasn't moved much
        if (touchesRef.current.length === 1) {
          const startPoint = startPointsRef.current[touchesRef.current[0].identifier];
          const currentPoint = {
            x: touchesRef.current[0].clientX,
            y: touchesRef.current[0].clientY
          };
          
          const dx = currentPoint.x - startPoint.x;
          const dy = currentPoint.y - startPoint.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 10) {
            // Long press detected
            setGestureState(prev => ({
              ...prev,
              type: GestureType.LONG_PRESS
            }));
            
            // Call handler
            if (handlers.onLongPress) {
              handlers.onLongPress(currentPoint.x, currentPoint.y);
            }
            
            // Provide feedback
            if (provideFeedback) {
              vibrateFeedback(50);
            }
          }
        }
      }, LONG_PRESS_THRESHOLD);
    }
    
    // Prevent default to avoid browser handling
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  }, [enabled, getTouchCenter, getDistance, getAngle, handlers, provideFeedback]);
  
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!enabled || touchesRef.current.length === 0) return;
    
    // Update touches
    touchesRef.current = Array.from(e.touches);
    
    // Calculate center point
    const center = getTouchCenter(Array.from(e.touches));
    
    // Cancel long press if moved
    if (longPressTimeoutRef.current && e.touches.length === 1) {
      const startPoint = startPointsRef.current[e.touches[0].identifier];
      if (startPoint) {
        const dx = e.touches[0].clientX - startPoint.x;
        const dy = e.touches[0].clientY - startPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 10) {
          clearTimeout(longPressTimeoutRef.current);
          longPressTimeoutRef.current = null;
        }
      }
    }
    
    // Calculate changes since last update
    const lastCenter = getTouchCenter(
      Object.keys(lastPointsRef.current).map(id => {
        const touch = Array.from(e.touches).find(t => t.identifier === parseInt(id));
        return touch!;
      }).filter(Boolean)
    );
    
    const deltaX = center.x - lastCenter.x;
    const deltaY = center.y - lastCenter.y;
    
    // Update last points
    for (const touch of e.touches) {
      lastPointsRef.current[touch.identifier] = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
      };
    }
    
    // Handle different gestures
    if (e.touches.length === 2) {
      // Two-finger gesture - pinch/zoom and rotation
      const currentDistance = getDistance(e.touches[0], e.touches[1]);
      const currentAngle = getAngle(e.touches[0], e.touches[1]);
      
      const scale = currentDistance / initialDistanceRef.current;
      const rotation = currentAngle - initialAngleRef.current;
      
      if (Math.abs(scale - 1) > 0.01) {
        // Pinch gesture
        setGestureState(prev => ({
          ...prev,
          type: GestureType.PINCH,
          scale,
          x: center.x,
          y: center.y
        }));
        
        // Call handler
        if (handlers.onPinch) {
          handlers.onPinch(scale, center);
        }
        
        // Apply to canvas
        applyGestureToCanvas(GestureType.PINCH, { scale, center });
      }
      
      if (Math.abs(rotation) > 1) {
        // Rotation gesture
        setGestureState(prev => ({
          ...prev,
          type: GestureType.ROTATE,
          rotation,
          x: center.x,
          y: center.y
        }));
        
        // Call handler
        if (handlers.onRotate) {
          handlers.onRotate(rotation, center);
        }
      }
      
      // Pan gesture with two fingers
      if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
        setGestureState(prev => ({
          ...prev,
          type: GestureType.PAN,
          deltaX,
          deltaY
        }));
        
        // Call handler
        if (handlers.onPan) {
          handlers.onPan(deltaX, deltaY);
        }
        
        // Apply to canvas
        applyGestureToCanvas(GestureType.PAN, { deltaX, deltaY });
      }
    } else if (e.touches.length === 3) {
      // Three-finger gesture
      const startPoints = Object.values(startPointsRef.current);
      const currentPoints = Array.from(e.touches).map(t => ({ x: t.clientX, y: t.clientY }));
      
      const avgStartX = startPoints.reduce((sum, p) => sum + p.x, 0) / startPoints.length;
      const avgStartY = startPoints.reduce((sum, p) => sum + p.y, 0) / startPoints.length;
      const avgCurrentX = currentPoints.reduce((sum, p) => sum + p.x, 0) / currentPoints.length;
      const avgCurrentY = currentPoints.reduce((sum, p) => sum + p.y, 0) / currentPoints.length;
      
      const dx = avgCurrentX - avgStartX;
      const dy = avgCurrentY - avgStartY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > MULTI_FINGER_GESTURE_THRESHOLD) {
        const direction = getSwipeDirection(dx, dy);
        
        setGestureState(prev => ({
          ...prev,
          type: GestureType.THREE_FINGER,
          direction,
          deltaX: dx,
          deltaY: dy
        }));
        
        // Call handler
        if (handlers.onThreeFingerGesture) {
          handlers.onThreeFingerGesture(direction);
        }
        
        // Apply to canvas
        applyGestureToCanvas(GestureType.THREE_FINGER, { direction });
        
        // Provide feedback
        if (provideFeedback) {
          vibrateFeedback([10, 20, 10]);
        }
        
        // Reset start points to prevent repeated triggers
        for (const touch of e.touches) {
          startPointsRef.current[touch.identifier] = {
            x: touch.clientX,
            y: touch.clientY,
            time: Date.now()
          };
        }
      }
    } else if (e.touches.length === 4) {
      // Four-finger gesture
      const startPoints = Object.values(startPointsRef.current);
      const currentPoints = Array.from(e.touches).map(t => ({ x: t.clientX, y: t.clientY }));
      
      const avgStartX = startPoints.reduce((sum, p) => sum + p.x, 0) / startPoints.length;
      const avgStartY = startPoints.reduce((sum, p) => sum + p.y, 0) / startPoints.length;
      const avgCurrentX = currentPoints.reduce((sum, p) => sum + p.x, 0) / currentPoints.length;
      const avgCurrentY = currentPoints.reduce((sum, p) => sum + p.y, 0) / currentPoints.length;
      
      const dx = avgCurrentX - avgStartX;
      const dy = avgCurrentY - avgStartY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > MULTI_FINGER_GESTURE_THRESHOLD) {
        const direction = getSwipeDirection(dx, dy);
        
        setGestureState(prev => ({
          ...prev,
          type: GestureType.FOUR_FINGER,
          direction,
          deltaX: dx,
          deltaY: dy
        }));
        
        // Call handler
        if (handlers.onFourFingerGesture) {
          handlers.onFourFingerGesture(direction);
        }
        
        // Apply to canvas
        applyGestureToCanvas(GestureType.FOUR_FINGER, { direction });
        
        // Provide feedback
        if (provideFeedback) {
          vibrateFeedback([10, 20, 10, 20, 10]);
        }
        
        // Reset start points to prevent repeated triggers
        for (const touch of e.touches) {
          startPointsRef.current[touch.identifier] = {
            x: touch.clientX,
            y: touch.clientY,
            time: Date.now()
          };
        }
      }
    }
    
    // Prevent default for multi-touch gestures
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  }, [enabled, getTouchCenter, getDistance, getAngle, getSwipeDirection, 
      handlers, applyGestureToCanvas, provideFeedback]);
  
  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!enabled) return;
    
    // Clear long press timeout
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
    
    // Calculate swipe if ended with one touch
    if (touchesRef.current.length === 1 && e.touches.length === 0) {
      const touchId = touchesRef.current[0].identifier;
      const startPoint = startPointsRef.current[touchId];
      const lastPoint = lastPointsRef.current[touchId];
      
      if (startPoint && lastPoint) {
        const dx = lastPoint.x - startPoint.x;
        const dy = lastPoint.y - startPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const time = lastPoint.time - startPoint.time;
        const velocity = distance / time;
        
        if (distance > SWIPE_THRESHOLD && velocity > SWIPE_VELOCITY_THRESHOLD) {
          // Swipe detected
          const direction = getSwipeDirection(dx, dy);
          
          setGestureState(prev => ({
            ...prev,
            type: GestureType.SWIPE,
            direction,
            deltaX: dx,
            deltaY: dy,
            velocity
          }));
          
          // Call handler
          if (handlers.onSwipe) {
            handlers.onSwipe(direction, velocity);
          }
        } else if (distance < 10 && time < 300) {
          // Tap detected
          setGestureState(prev => ({
            ...prev,
            type: GestureType.TAP,
            x: lastPoint.x,
            y: lastPoint.y
          }));
          
          // Call handler
          if (handlers.onTap) {
            handlers.onTap(lastPoint.x, lastPoint.y, 1);
          }
        }
      }
    }
    
    // Update touches
    touchesRef.current = Array.from(e.touches);
    
    // Reset state if no more touches
    if (e.touches.length === 0) {
      setGestureState({
        ...DEFAULT_GESTURE_STATE,
        active: false
      });
      
      // Clear start and last points
      startPointsRef.current = {};
      lastPointsRef.current = {};
    } else {
      // Update state with remaining touches
      setGestureState(prev => ({
        ...prev,
        touchCount: e.touches.length
      }));
    }
  }, [enabled, getSwipeDirection, handlers]);
  
  // Attach event listeners
  useEffect(() => {
    if (!enabled || !fabricCanvasRef.current) return;
    
    const canvasEl = fabricCanvasRef.current.getElement();
    
    canvasEl.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvasEl.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvasEl.addEventListener('touchend', handleTouchEnd);
    canvasEl.addEventListener('touchcancel', handleTouchEnd);
    
    return () => {
      canvasEl.removeEventListener('touchstart', handleTouchStart);
      canvasEl.removeEventListener('touchmove', handleTouchMove);
      canvasEl.removeEventListener('touchend', handleTouchEnd);
      canvasEl.removeEventListener('touchcancel', handleTouchEnd);
      
      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current);
      }
    };
  }, [enabled, fabricCanvasRef, handleTouchStart, handleTouchMove, handleTouchEnd]);
  
  return {
    gestureState,
    isActive: gestureState.active,
    gestureType: gestureState.type,
    touchCount: gestureState.touchCount
  };
}
