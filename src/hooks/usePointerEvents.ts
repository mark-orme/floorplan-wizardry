
import { useEffect, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';

interface UsePointerEventsProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  fabricCanvas: FabricCanvas | null;
  onPressureChange?: (pressure: number) => void;
}

export const usePointerEvents = ({ 
  canvasRef, 
  fabricCanvas,
  onPressureChange 
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
    }

    // Apply tilt if available
    if (event.tiltX !== undefined && event.tiltY !== undefined) {
      console.log('Tilt:', { x: event.tiltX, y: event.tiltY });
    }
  }, [fabricCanvas, onPressureChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Enable touch events
    canvas.style.touchAction = 'none';
    
    // Add pointer event listeners
    canvas.addEventListener('pointerdown', handlePointerDown, { passive: false });

    // Log if pressure is supported
    if (window.PointerEvent) {
      console.log('Pointer events supported');
      toast.success('Enhanced pressure sensitivity enabled', {
        id: 'pressure-support'
      });
    }

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [canvasRef, handlePointerDown]);
};
