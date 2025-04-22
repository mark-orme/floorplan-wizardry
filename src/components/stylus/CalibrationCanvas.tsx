import React, { useRef, useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';

interface CalibrationCanvasProps {
  onPressureSample: (pressure: number, thickness: number) => void;
  onTiltSample?: (tiltX: number, tiltY: number) => void;
}

export const CalibrationCanvas: React.FC<CalibrationCanvasProps> = ({
  onPressureSample,
  onTiltSample
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 400,
      height: 200,
      backgroundColor: '#f8f9fa'
    });

    const handlePointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'pen') {
        setIsDrawing(true);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (isDrawing && e.pointerType === 'pen') {
        onPressureSample(e.pressure, e.pressure * 10); // Scale thickness for visualization
        if (onTiltSample && (e.tiltX !== undefined || e.tiltY !== undefined)) {
          onTiltSample(e.tiltX || 0, e.tiltY || 0);
        }
      }
    };

    const handlePointerUp = () => {
      setIsDrawing(false);
    };

    canvasRef.current.addEventListener('pointerdown', handlePointerDown);
    canvasRef.current.addEventListener('pointermove', handlePointerMove);
    canvasRef.current.addEventListener('pointerup', handlePointerUp);

    return () => {
      canvas.dispose();
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('pointerdown', handlePointerDown);
        canvasRef.current.removeEventListener('pointermove', handlePointerMove);
        canvasRef.current.removeEventListener('pointerup', handlePointerUp);
      }
    };
  }, [onPressureSample, onTiltSample, isDrawing]);

  return (
    <div className="border rounded-md p-4 bg-background">
      <canvas ref={canvasRef} className="w-full touch-none" />
      <p className="text-sm text-muted-foreground mt-2">
        Draw a line while gradually increasing pressure and varying tilt angle
      </p>
    </div>
  );
};
