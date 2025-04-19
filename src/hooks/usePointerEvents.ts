
import { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, Point } from 'fabric';
import { toFabricPoint } from '@/utils/fabricPointConverter';

interface UsePointerEventsProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  fabricCanvas: FabricCanvas | null;
  enabled?: boolean;
  onPressureChange?: (pressure: number) => void;
  onTiltChange?: (tiltX: number, tiltY: number) => void;
  onPointerMove?: (e: PointerEvent) => void;
}

export const usePointerEvents = ({ 
  canvasRef, 
  fabricCanvas, 
  enabled = true,
  onPressureChange,
  onTiltChange,
  onPointerMove
}: UsePointerEventsProps) => {
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number, y: number } | null>(null);
  const [isPointerDown, setIsPointerDown] = useState(false);

  // Set up pointer event handlers
  useEffect(() => {
    if (!enabled || !fabricCanvas || !canvasRef.current) return;

    const canvas = canvasRef.current;
    
    const handlePointerDown = (e: PointerEvent) => {
      e.preventDefault();
      isDrawingRef.current = true;
      setIsPointerDown(true);
      
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      lastPointRef.current = { x, y };

      // Handle pressure if available
      if (onPressureChange && e.pressure) {
        onPressureChange(e.pressure);
      }
      
      // Handle tilt if available
      if (onTiltChange && (e.tiltX || e.tiltY)) {
        onTiltChange(e.tiltX, e.tiltY);
      }

      // Start path in Fabric
      if (fabricCanvas.isDrawingMode && fabricCanvas.freeDrawingBrush) {
        const fabricPoint = toFabricPoint({ x, y });
        // Correct the FabricJS v6 format
        fabricCanvas.freeDrawingBrush.onMouseDown({ pointer: fabricPoint });
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDrawingRef.current || !lastPointRef.current) return;
      e.preventDefault();
      
      const rect = canvas.getBoundingClientRect();
      const currentPoint = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };

      // Handle pressure if available
      if (onPressureChange && e.pressure) {
        onPressureChange(e.pressure);
      }
      
      // Handle tilt if available
      if (onTiltChange && (e.tiltX || e.tiltY)) {
        onTiltChange(e.tiltX, e.tiltY);
      }
      
      // Call the onPointerMove callback if provided
      if (onPointerMove) {
        onPointerMove(e);
      }

      // Draw point in Fabric
      if (fabricCanvas.isDrawingMode && fabricCanvas.freeDrawingBrush) {
        const fabricPoint = toFabricPoint(currentPoint);
        // Correct the FabricJS v6 format
        fabricCanvas.freeDrawingBrush.onMouseMove({ pointer: fabricPoint });
      }

      lastPointRef.current = currentPoint;
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!isDrawingRef.current) return;
      e.preventDefault();
      
      isDrawingRef.current = false;
      setIsPointerDown(false);
      lastPointRef.current = null;

      // End path in Fabric
      if (fabricCanvas.isDrawingMode && fabricCanvas.freeDrawingBrush) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const fabricPoint = toFabricPoint({ x, y });
        // Correct the FabricJS v6 format
        fabricCanvas.freeDrawingBrush.onMouseUp({ pointer: fabricPoint });
      }
    };

    const handlePointerOut = (e: PointerEvent) => {
      handlePointerUp(e);
    };

    // Add event listeners
    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointerout', handlePointerOut);

    // Set touch-action to none to prevent scrolling
    canvas.style.touchAction = 'none';

    return () => {
      // Only remove event listeners if canvas exists
      if (canvas) {
        canvas.removeEventListener('pointerdown', handlePointerDown);
        canvas.removeEventListener('pointermove', handlePointerMove);
        canvas.removeEventListener('pointerup', handlePointerUp);
        canvas.removeEventListener('pointerout', handlePointerOut);
      }
    };
  }, [canvasRef, fabricCanvas, enabled, onPressureChange, onTiltChange, onPointerMove]);

  return {
    isPointerDown
  };
};

export default usePointerEvents;
