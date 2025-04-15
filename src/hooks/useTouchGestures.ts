
import { useEffect, useCallback, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { ZOOM_CONSTANTS } from '@/constants/zoomConstants';
import { toast } from 'sonner';

interface UseTouchGesturesProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  onUndo?: () => void;
  onZoom?: (zoomLevel: number) => void;
  minZoom?: number;
  maxZoom?: number;
}

export const useTouchGestures = ({
  fabricCanvasRef,
  onUndo,
  onZoom,
  minZoom = ZOOM_CONSTANTS.MIN_ZOOM,
  maxZoom = ZOOM_CONSTANTS.MAX_ZOOM
}: UseTouchGesturesProps) => {
  const [currentZoom, setCurrentZoom] = useState(1);
  const [lastTapTime, setLastTapTime] = useState(0);
  const [initialDistance, setInitialDistance] = useState<number | null>(null);
  const [isGestureActive, setIsGestureActive] = useState(false);
  
  // Calculate distance between two touch points
  const getDistance = useCallback((touch1: Touch, touch2: Touch): number => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);
  
  // Handle two-finger tap for undo
  const handleTwoFingerTap = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2) {
      const now = Date.now();
      
      // If last tap was less than 300ms ago, consider it a double tap
      if (now - lastTapTime < 300) {
        if (onUndo) {
          onUndo();
          toast.info('Undo');
        }
      }
      
      setLastTapTime(now);
    }
  }, [lastTapTime, onUndo]);
  
  // Handle pinch to zoom
  const handlePinch = useCallback((e: TouchEvent) => {
    if (!fabricCanvasRef.current || e.touches.length !== 2) return;
    
    const canvas = fabricCanvasRef.current;
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    const distance = getDistance(touch1, touch2);
    
    if (!initialDistance) {
      setInitialDistance(distance);
      setIsGestureActive(true);
      return;
    }
    
    // Calculate zoom
    const scale = distance / initialDistance;
    let newZoom = currentZoom * scale;
    
    // Constrain zoom
    newZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));
    
    // Get center point between touches
    const centerX = (touch1.clientX + touch2.clientX) / 2;
    const centerY = (touch1.clientY + touch2.clientY) / 2;
    
    // Convert to canvas coordinates
    const rect = canvas.getElement().getBoundingClientRect();
    const canvasCenterX = (centerX - rect.left) / currentZoom;
    const canvasCenterY = (centerY - rect.top) / currentZoom;
    
    // Apply zoom
    canvas.zoomToPoint({ x: canvasCenterX, y: canvasCenterY }, newZoom);
    
    // Notify zoom callback
    if (onZoom) {
      onZoom(newZoom);
    }
    
    setCurrentZoom(newZoom);
    setInitialDistance(distance);
  }, [fabricCanvasRef, currentZoom, initialDistance, getDistance, minZoom, maxZoom, onZoom]);
  
  // Handle touch end
  const handleTouchEnd = useCallback(() => {
    setInitialDistance(null);
    setIsGestureActive(false);
  }, []);
  
  // Set up event listeners
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const canvasElement = canvas.getElement();
    
    const touchStartHandler = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        handleTwoFingerTap(e);
      }
    };
    
    const touchMoveHandler = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault(); // Prevent default scrolling
        handlePinch(e);
      }
    };
    
    canvasElement.addEventListener('touchstart', touchStartHandler, { passive: false });
    canvasElement.addEventListener('touchmove', touchMoveHandler, { passive: false });
    canvasElement.addEventListener('touchend', handleTouchEnd);
    canvasElement.addEventListener('touchcancel', handleTouchEnd);
    
    return () => {
      canvasElement.removeEventListener('touchstart', touchStartHandler);
      canvasElement.removeEventListener('touchmove', touchMoveHandler);
      canvasElement.removeEventListener('touchend', handleTouchEnd);
      canvasElement.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [fabricCanvasRef, handleTwoFingerTap, handlePinch, handleTouchEnd]);
  
  return {
    currentZoom,
    isGestureActive
  };
};
