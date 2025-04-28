
import { useEffect, useState, MutableRefObject } from 'react';
import { Canvas as FabricCanvas } from 'fabric';

type Point = {
  x: number;
  y: number;
};

export const useApplePencilSupport = (
  canvasRef: MutableRefObject<FabricCanvas | null>
) => {
  const [isPencilMode, setIsPencilMode] = useState(false);
  const [stylusDetected, setStylusDetected] = useState(false);
  const [pressure, setPressure] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'pen') {
        setStylusDetected(true);
        setIsPencilMode(true);
        const pressure = e.pressure || 0.5;
        setPressure(pressure);
      } else {
        setStylusDetected(false);
        setIsPencilMode(false);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'pen') {
        const pressure = e.pressure || 0.5;
        setPressure(pressure);
      }
    };

    const canvasElement = canvas.getElement?.();
    if (canvasElement) {
      canvasElement.addEventListener('pointerdown', handlePointerDown);
      canvasElement.addEventListener('pointermove', handlePointerMove);
    }

    return () => {
      if (canvasElement) {
        canvasElement.removeEventListener('pointerdown', handlePointerDown);
        canvasElement.removeEventListener('pointermove', handlePointerMove);
      }
    };
  }, [canvasRef]);

  // Adjust brush width based on pressure when in pencil mode
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isPencilMode || !canvas.freeDrawingBrush) return;

    const baseWidth = canvas.freeDrawingBrush.width || 3;
    const pressureWidth = baseWidth * (pressure * 2); // Scale pressure effect
    
    canvas.freeDrawingBrush.width = pressureWidth;
  }, [canvasRef, isPencilMode, pressure]);

  return {
    stylusDetected,
    isPencilMode,
    pressure
  };
};
