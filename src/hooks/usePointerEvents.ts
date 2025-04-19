
import { useEffect, useRef, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';

interface UsePointerEventsProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  fabricCanvas: FabricCanvas | null;
  onPressureChange?: (pressure: number) => void;
  onTiltChange?: (tiltX: number, tiltY: number) => void;
  onPointerMove?: (e: PointerEvent) => void;
}

export const usePointerEvents = ({
  canvasRef,
  fabricCanvas,
  onPressureChange,
  onTiltChange,
  onPointerMove
}: UsePointerEventsProps) => {
  const lastPressure = useRef<number>(0.5);
  const lastTilt = useRef<{x: number, y: number}>({x: 0, y: 0});
  const pointerIdRef = useRef<number | null>(null);
  
  // Handle pointer events with pressure and tilt
  const handlePointerEvent = useCallback((e: PointerEvent) => {
    // Only process events from the primary pointer or the pointer we're tracking
    if (pointerIdRef.current !== null && e.pointerId !== pointerIdRef.current) {
      return;
    }
    
    // Track pointer ID on pointerdown
    if (e.type === 'pointerdown' && pointerIdRef.current === null) {
      pointerIdRef.current = e.pointerId;
    }
    
    // Release tracking on pointerup
    if (e.type === 'pointerup' || e.type === 'pointercancel') {
      pointerIdRef.current = null;
    }
    
    // Palm rejection - ignore touches that are likely palm contacts
    if (e.width > 20 || e.height > 20) {
      return; // Likely a palm touch
    }
    
    // Get pressure (normalize between 0 and 1)
    const pressure = e.pressure || 0.5;
    if (Math.abs(pressure - lastPressure.current) > 0.05) {
      lastPressure.current = pressure;
      if (onPressureChange) {
        onPressureChange(pressure);
      }
    }
    
    // Get tilt data
    const tiltX = e.tiltX || 0;
    const tiltY = e.tiltY || 0;
    if (Math.abs(tiltX - lastTilt.current.x) > 2 || Math.abs(tiltY - lastTilt.current.y) > 2) {
      lastTilt.current = {x: tiltX, y: tiltY};
      if (onTiltChange) {
        onTiltChange(tiltX, tiltY);
      }
    }
    
    // Forward the event to the onPointerMove callback if provided
    if (e.type === 'pointermove' && onPointerMove) {
      onPointerMove(e);
    }
    
    // Try to provide tactile feedback on iOS devices for Apple Pencil
    if (e.type === 'pointerdown' && 'vibrate' in navigator) {
      try {
        // Use very short, subtle vibration
        navigator.vibrate(1);
      } catch (err) {
        // Ignore errors - not all devices support vibration
      }
    }
  }, [onPressureChange, onTiltChange, onPointerMove]);

  // Set up event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Add all necessary pointer events
    canvas.addEventListener('pointerdown', handlePointerEvent, { passive: false });
    canvas.addEventListener('pointermove', handlePointerEvent, { passive: false });
    canvas.addEventListener('pointerup', handlePointerEvent, { passive: false });
    canvas.addEventListener('pointercancel', handlePointerEvent, { passive: false });
    
    // Configure the canvas for optimal stylus input
    canvas.style.touchAction = 'none';
    
    // Enable stylus-specific options
    if ('setPointerCapture' in canvas) {
      const capturePointer = (e: PointerEvent) => {
        if (e.pointerType === 'pen') {
          try {
            canvas.setPointerCapture(e.pointerId);
          } catch (err) {
            console.warn('Could not capture pointer:', err);
          }
        }
      };
      
      canvas.addEventListener('pointerdown', capturePointer);
      
      // Fix: Return a proper cleanup function
      return () => {
        canvas.removeEventListener('pointerdown', capturePointer);
        canvas.removeEventListener('pointerdown', handlePointerEvent);
        canvas.removeEventListener('pointermove', handlePointerEvent);
        canvas.removeEventListener('pointerup', handlePointerEvent);
        canvas.removeEventListener('pointercancel', handlePointerEvent);
      };
    }
    
    // Fix: Return a cleanup function even when setPointerCapture isn't used
    return () => {
      canvas.removeEventListener('pointerdown', handlePointerEvent);
      canvas.removeEventListener('pointermove', handlePointerEvent);
      canvas.removeEventListener('pointerup', handlePointerEvent);
      canvas.removeEventListener('pointercancel', handlePointerEvent);
    };
  }, [canvasRef, handlePointerEvent]);

  return {
    lastPressure: lastPressure.current,
    lastTilt: lastTilt.current
  };
};
