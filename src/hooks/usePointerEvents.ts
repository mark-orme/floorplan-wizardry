import { useEffect, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';
import { vibrateFeedback } from '@/utils/canvas/pointerEvents';

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
  const handlePointerDown = useCallback((event: PointerEvent) => {
    if (!fabricCanvas?.isDrawingMode) return;

    // Prevent default to avoid touch scrolling
    event.preventDefault();
    
    // Apply pressure sensitivity if available
    if (event.pressure > 0 && event.pressure <= 1) {
      const width = Math.max(1, event.pressure * 10);
      if (fabricCanvas.freeDrawingBrush) {
        fabricCanvas.freeDrawingBrush.width = width;
      }
      onPressureChange?.(event.pressure);
      console.log('Pressure detected:', event.pressure);
      
      // Apply haptic feedback based on pressure
      if (event.pointerType === 'pen' && navigator.vibrate) {
        vibrateFeedback(Math.round(event.pressure * 20));
      }
    }

    // Apply tilt if available
    if (event.tiltX !== undefined && event.tiltY !== undefined) {
      console.log('Tilt detected:', { x: event.tiltX, y: event.tiltY });
      
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

  const handlePointerMove = useCallback((event: PointerEvent) => {
    if (!fabricCanvas?.isDrawingMode) return;
    
    // Continue applying pressure and tilt during movement
    if (event.pressure > 0 && event.pressure <= 1) {
      const width = Math.max(1, event.pressure * 10);
      if (fabricCanvas.freeDrawingBrush) {
        fabricCanvas.freeDrawingBrush.width = width;
      }
      onPressureChange?.(event.pressure);
    }
    
    if (event.tiltX !== undefined && event.tiltY !== undefined) {
      onTiltChange?.(event.tiltX, event.tiltY);
      
      // Adjust brush dynamically during movement based on tilt
      if (fabricCanvas.freeDrawingBrush) {
        const tiltX = event.tiltX || 0;
        const tiltY = event.tiltY || 0;
        
        // Calculate a direction offset based on tilt
        const angle = Math.atan2(tiltY, tiltX);
        
        // Apply dynamic adjustments to brush properties
        if ('angle' in fabricCanvas.freeDrawingBrush) {
          (fabricCanvas.freeDrawingBrush as any).angle = angle * (180 / Math.PI);
        }
      }
    }
    
    // Prevent default to avoid touch scrolling during drawing
    event.preventDefault();
  }, [fabricCanvas, onPressureChange, onTiltChange]);

  const handlePointerUp = useCallback((event: PointerEvent) => {
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
    
    // Add direct pointer event listeners for low-latency input
    canvas.addEventListener('pointerdown', handlePointerDown, { passive: false });
    canvas.addEventListener('pointermove', handlePointerMove, { passive: false });
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointercancel', handlePointerUp);
    canvas.addEventListener('pointerleave', handlePointerUp);

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
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointercancel', handlePointerUp);
      canvas.removeEventListener('pointerleave', handlePointerUp);
    };
  }, [canvasRef, handlePointerDown, handlePointerMove, handlePointerUp]);
};
