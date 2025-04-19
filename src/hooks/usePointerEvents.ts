
import { useEffect, useState, RefObject } from 'react';
import { Canvas as FabricCanvas, Point } from 'fabric';

export interface UsePointerEventsProps {
  canvasRef: RefObject<HTMLCanvasElement>;
  fabricCanvas: FabricCanvas | null;
  onPointerMove?: (e: PointerEvent) => void;
}

interface PointerData {
  pressure: number;
  tiltX: number;
  tiltY: number;
}

export const usePointerEvents = ({ 
  canvasRef, 
  fabricCanvas,
  onPointerMove
}: UsePointerEventsProps) => {
  const [pointerData, setPointerData] = useState<PointerData>({
    pressure: 0.5,
    tiltX: 0,
    tiltY: 0
  });

  useEffect(() => {
    if (!canvasRef.current || !fabricCanvas) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (!canvasRef.current) return;
      
      // Update pointer data
      setPointerData({
        pressure: e.pressure > 0 ? e.pressure : 0.5,
        tiltX: e.tiltX,
        tiltY: e.tiltY
      });
      
      // Create a point from the event coordinates
      const rect = canvasRef.current.getBoundingClientRect();
      const point = new Point(
        e.clientX - rect.left,
        e.clientY - rect.top
      );
      
      // Fire the canvas event
      fabricCanvas.fire('pointer:move', {
        e,
        pointer: point
      });
      
      // Call the provided callback if it exists
      if (onPointerMove) {
        onPointerMove(e);
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (!canvasRef.current) return;
      
      // Create a point from the event coordinates
      const rect = canvasRef.current.getBoundingClientRect();
      const point = new Point(
        e.clientX - rect.left,
        e.clientY - rect.top
      );
      
      // Fire the canvas event
      fabricCanvas.fire('pointer:down', {
        e,
        pointer: point
      });
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!canvasRef.current) return;
      
      // Create a point from the event coordinates
      const rect = canvasRef.current.getBoundingClientRect();
      const point = new Point(
        e.clientX - rect.left,
        e.clientY - rect.top
      );
      
      // Fire the canvas event  
      fabricCanvas.fire('pointer:up', {
        e,
        pointer: point
      });
    };

    // Add event listeners
    const element = canvasRef.current;
    element.addEventListener('pointermove', handlePointerMove);
    element.addEventListener('pointerdown', handlePointerDown);
    element.addEventListener('pointerup', handlePointerUp);

    return () => {
      // Remove event listeners
      element.removeEventListener('pointermove', handlePointerMove);
      element.removeEventListener('pointerdown', handlePointerDown);
      element.removeEventListener('pointerup', handlePointerUp);
    };
  }, [canvasRef, fabricCanvas, onPointerMove]);

  return {
    pointerData
  };
};
