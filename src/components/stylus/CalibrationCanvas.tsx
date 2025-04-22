
import React, { useRef, useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { provideFeedback, initializeAudio } from '@/utils/feedback/drawingFeedback';
import { TOUCH } from '@/constants/gestureConstants';
import { useLatencyOptimizedCanvas } from '@/hooks/useLatencyOptimizedCanvas';
import { PERFORMANCE_TARGETS } from '@/utils/canvas/latencyOptimizer';

interface CalibrationCanvasProps {
  onPressureSample: (pressure: number, thickness: number) => void;
  onTiltSample?: (tiltX: number, tiltY: number) => void;
}

export const CalibrationCanvas: React.FC<CalibrationCanvasProps> = ({
  onPressureSample,
  onTiltSample
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [frameTime, setFrameTime] = useState<number | null>(null);
  const [isLowLatency, setIsLowLatency] = useState(false);

  // Use our latency optimization hook
  const latencyOptimizer = useLatencyOptimizedCanvas(fabricCanvasRef, {
    onLatencyUpdate: (measurement) => {
      setFrameTime(Math.round(measurement.totalLatency));
      setIsLowLatency(measurement.totalLatency <= PERFORMANCE_TARGETS.OPTIMAL_FRAME_TIME);
    }
  });

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize audio context
    initializeAudio();

    // Create canvas with optimized settings
    const canvas = new FabricCanvas(canvasRef.current, {
      width: 400,
      height: 200,
      backgroundColor: '#f8f9fa',
      renderOnAddRemove: false, // Optimize for performance
      enableRetinaScaling: window.devicePixelRatio < 2, // Only for low DPI screens
    });
    
    // Store reference for our hook
    fabricCanvasRef.current = canvas;

    let lastTapTime = 0;

    // Use requestAnimationFrame for pointer processing to reduce latency
    let pointerPosition: { x: number, y: number, pressure: number, tiltX?: number, tiltY?: number } | null = null;
    let rafId: number | null = null;
    
    const processPointerInRaf = () => {
      if (pointerPosition && isDrawing) {
        // Process pointer data in animation frame
        onPressureSample(pointerPosition.pressure, pointerPosition.pressure * 10);
        
        if (onTiltSample && (pointerPosition.tiltX !== undefined || pointerPosition.tiltY !== undefined)) {
          onTiltSample(pointerPosition.tiltX || 0, pointerPosition.tiltY || 0);
        }
      }
      
      // Schedule next frame
      rafId = requestAnimationFrame(processPointerInRaf);
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'pen') {
        setIsDrawing(true);
        provideFeedback('start');
        
        // Start RAF loop
        rafId = requestAnimationFrame(processPointerInRaf);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (isDrawing && e.pointerType === 'pen') {
        // Update pointer data for RAF processing
        pointerPosition = {
          x: e.offsetX,
          y: e.offsetY,
          pressure: e.pressure,
          tiltX: e.tiltX,
          tiltY: e.tiltY
        };
        
        provideFeedback('stroke');
      }
    };

    const handlePointerUp = () => {
      if (isDrawing) {
        provideFeedback('end');
        
        // Stop RAF loop
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }
      setIsDrawing(false);
      pointerPosition = null;
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

    // Add passive event listeners where possible for better scrolling performance
    canvasRef.current.addEventListener('pointerdown', handlePointerDown);
    canvasRef.current.addEventListener('pointermove', handlePointerMove, { passive: true });
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
      
      // Stop RAF loop if active
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [onPressureSample, onTiltSample, isDrawing]);

  return (
    <div className="border rounded-md p-4 bg-background">
      <canvas ref={canvasRef} className="w-full touch-none" />
      <div className="flex justify-between mt-2">
        <p className="text-sm text-muted-foreground">
          Draw a line while gradually increasing pressure and varying tilt angle
        </p>
        
        {frameTime !== null && (
          <div className={`text-xs px-2 py-1 rounded ${isLowLatency ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            Latency: {frameTime}ms {isLowLatency ? '✓' : ''}
          </div>
        )}
      </div>
    </div>
  );
};
