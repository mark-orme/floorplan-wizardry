
import { useEffect, useCallback, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';
import { vibrateFeedback } from '@/utils/canvas/pointerEvents';
import { throttleRAF } from '@/utils/canvas/throttle';

interface UsePointerEventsProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  fabricCanvas: FabricCanvas | null;
  onPressureChange?: (pressure: number) => void;
  onTiltChange?: (tiltX: number, tiltY: number) => void;
}

export const usePointerEvents = ({ 
  canvasRef, 
  fabricCanvas,
  onPressureChange,
  onTiltChange
}: UsePointerEventsProps) => {
  // Store the last pointer position for optimization
  const lastPositionRef = useRef({ x: 0, y: 0, pressure: 0, tiltX: 0, tiltY: 0 });
  const activePointerId = useRef<number | null>(null);
  const isDrawingRef = useRef(false);

  // Use a non-throttled handler for pointer down to minimize initial latency
  const handlePointerDown = useCallback((event: PointerEvent) => {
    if (!fabricCanvas?.isDrawingMode) return;

    // Prevent default to avoid touch scrolling
    event.preventDefault();
    
    // Store the pointer ID for tracking
    activePointerId.current = event.pointerId;
    isDrawingRef.current = true;
    
    // Apply pressure sensitivity if available
    if (event.pressure > 0 && event.pressure <= 1) {
      const width = Math.max(1, event.pressure * 10);
      if (fabricCanvas.freeDrawingBrush) {
        fabricCanvas.freeDrawingBrush.width = width;
      }
      onPressureChange?.(event.pressure);
      
      // Store the last values
      lastPositionRef.current = {
        x: event.clientX,
        y: event.clientY,
        pressure: event.pressure,
        tiltX: event.tiltX || 0,
        tiltY: event.tiltY || 0
      };
      
      // Apply haptic feedback based on pressure
      if (event.pointerType === 'pen' && navigator.vibrate) {
        vibrateFeedback(Math.round(event.pressure * 20));
      }
    }

    // Apply tilt if available
    if (event.tiltX !== undefined && event.tiltY !== undefined) {
      // Adjust brush based on tilt angle
      if (fabricCanvas.freeDrawingBrush && Math.abs(event.tiltX) + Math.abs(event.tiltY) > 0) {
        // Calculate brush rotation or shape change based on tilt
        const tiltMagnitude = Math.sqrt(event.tiltX * event.tiltX + event.tiltY * event.tiltY);
        const opacity = Math.min(1, 0.7 + tiltMagnitude / 90 * 0.3);
        
        // Some brushes support opacity
        if ('opacity' in fabricCanvas.freeDrawingBrush) {
          (fabricCanvas.freeDrawingBrush as any).opacity = opacity;
        }
      }
      
      onTiltChange?.(event.tiltX, event.tiltY);
    }
  }, [fabricCanvas, onPressureChange, onTiltChange]);

  // Use RAF-based throttling for pointer move to optimize performance while maintaining smoothness
  const handlePointerMove = useCallback(throttleRAF((event: PointerEvent) => {
    if (!fabricCanvas?.isDrawingMode || !isDrawingRef.current) return;
    if (activePointerId.current !== event.pointerId) return;
    
    // Continue applying pressure and tilt during movement
    if (event.pressure > 0 && event.pressure <= 1) {
      // Only update if pressure changed significantly to reduce overhead
      if (Math.abs(event.pressure - lastPositionRef.current.pressure) > 0.01) {
        const width = Math.max(1, event.pressure * 10);
        if (fabricCanvas.freeDrawingBrush) {
          fabricCanvas.freeDrawingBrush.width = width;
        }
        onPressureChange?.(event.pressure);
        lastPositionRef.current.pressure = event.pressure;
      }
    }
    
    if (event.tiltX !== undefined && event.tiltY !== undefined) {
      // Only update if tilt changed significantly to reduce overhead
      const tiltDelta = Math.abs(event.tiltX - lastPositionRef.current.tiltX) + 
                         Math.abs(event.tiltY - lastPositionRef.current.tiltY);
      
      if (tiltDelta > 1) {
        onTiltChange?.(event.tiltX, event.tiltY);
        lastPositionRef.current.tiltX = event.tiltX;
        lastPositionRef.current.tiltY = event.tiltY;
        
        // Apply dynamic adjustments to brush properties
        if (fabricCanvas.freeDrawingBrush) {
          const angle = Math.atan2(event.tiltY, event.tiltX);
          
          if ('angle' in fabricCanvas.freeDrawingBrush) {
            (fabricCanvas.freeDrawingBrush as any).angle = angle * (180 / Math.PI);
          }
        }
      }
    }
    
    // Update position reference
    lastPositionRef.current.x = event.clientX;
    lastPositionRef.current.y = event.clientY;
    
    // Prevent default to avoid touch scrolling during drawing
    event.preventDefault();
  }), [fabricCanvas, onPressureChange, onTiltChange]);

  const handlePointerUp = useCallback((event: PointerEvent) => {
    if (activePointerId.current !== event.pointerId) return;
    
    // Reset active pointer and drawing state
    activePointerId.current = null;
    isDrawingRef.current = false;
    
    // Reset to default states if needed
    if (fabricCanvas?.freeDrawingBrush) {
      // Keep the width as is, just reset other dynamic properties
      if ('opacity' in fabricCanvas.freeDrawingBrush) {
        (fabricCanvas.freeDrawingBrush as any).opacity = 1.0;
      }
      if ('angle' in fabricCanvas.freeDrawingBrush) {
        (fabricCanvas.freeDrawingBrush as any).angle = 0;
      }
    }
  }, [fabricCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Enable touch events
    canvas.style.touchAction = 'none';
    
    // Add optimized event listeners with capture phase for better responsiveness
    canvas.addEventListener('pointerdown', handlePointerDown, { passive: false, capture: true });
    canvas.addEventListener('pointermove', handlePointerMove, { passive: false, capture: true });
    canvas.addEventListener('pointerup', handlePointerUp, { capture: true });
    canvas.addEventListener('pointercancel', handlePointerUp, { capture: true });
    canvas.addEventListener('pointerleave', handlePointerUp, { capture: true });

    // Set high-priority touch action handling
    if ('highPriority' in navigator && 'scheduling' in navigator) {
      try {
        (navigator as any).scheduling.highPriority();
      } catch (err) {
        console.log('High priority scheduling not supported');
      }
    }

    // Log if pressure is supported
    if (window.PointerEvent) {
      console.log('Pointer events supported');
      
      // Check for pressure support
      const pressureSupported = 'pressure' in new PointerEvent('pointerdown');
      const tiltSupported = 'tiltX' in new PointerEvent('pointerdown') && 'tiltY' in new PointerEvent('pointerdown');
      
      if (pressureSupported && tiltSupported) {
        toast.success('Enhanced pressure and tilt sensitivity enabled', {
          id: 'pressure-support'
        });
      } else if (pressureSupported) {
        toast.success('Enhanced pressure sensitivity enabled', {
          id: 'pressure-support'
        });
      }
    }

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown, { capture: true } as EventListenerOptions);
      canvas.removeEventListener('pointermove', handlePointerMove, { capture: true } as EventListenerOptions);
      canvas.removeEventListener('pointerup', handlePointerUp, { capture: true } as EventListenerOptions);
      canvas.removeEventListener('pointercancel', handlePointerUp, { capture: true } as EventListenerOptions);
      canvas.removeEventListener('pointerleave', handlePointerUp, { capture: true } as EventListenerOptions);
    };
  }, [canvasRef, handlePointerDown, handlePointerMove, handlePointerUp]);
};
