
import React, { useRef, useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { provideFeedback } from '@/utils/feedback/drawingFeedback';
import { TOUCH } from '@/constants/gestureConstants';

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

    let lastTapTime = 0;

    const handlePointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'pen') {
        setIsDrawing(true);
        provideFeedback('start');
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (isDrawing && e.pointerType === 'pen') {
        onPressureSample(e.pressure, e.pressure * 10);
        provideFeedback('stroke');
        
        if (onTiltSample && (e.tiltX !== undefined || e.tiltY !== undefined)) {
          onTiltSample(e.tiltX || 0, e.tiltY || 0);
        }
      }
    };

    const handlePointerUp = () => {
      if (isDrawing) {
        provideFeedback('end');
      }
      setIsDrawing(false);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const now = Date.now();
        if (now - lastTapTime < TOUCH.DEBOUNCE) {
          // Double tap with two fingers detected
          provideFeedback([20, 50, 20]); // Pass array directly for vibration pattern
          if (window.history.state?.lastStroke) {
            window.history.back(); // Undo last stroke
          }
        }
        lastTapTime = now;
      }
    };

    canvasRef.current.addEventListener('pointerdown', handlePointerDown);
    canvasRef.current.addEventListener('pointermove', handlePointerMove);
    canvasRef.current.addEventListener('pointerup', handlePointerUp);
    canvasRef.current.addEventListener('touchstart', handleTouchStart);

    return () => {
      canvas.dispose();
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('pointerdown', handlePointerDown);
        canvasRef.current.removeEventListener('pointermove', handlePointerMove);
        canvasRef.current.removeEventListener('pointerup', handlePointerUp);
        canvasRef.current.removeEventListener('touchstart', handleTouchStart);
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
