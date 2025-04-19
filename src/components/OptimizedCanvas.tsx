
import React, { useRef, useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { usePointerEvents } from '@/hooks/usePointerEvents';
import { useWebGLContext } from '@/hooks/useWebGLContext';
import { toast } from 'sonner';
import { isPressureSupported, isTiltSupported } from '@/utils/canvas/pointerEvents';

interface OptimizedCanvasProps {
  width?: number;
  height?: number;
  onCanvasReady?: (canvas: FabricCanvas) => void;
  fabricCanvasRef?: React.MutableRefObject<FabricCanvas | null>;
}

export const OptimizedCanvas: React.FC<OptimizedCanvasProps> = ({
  width = 800,
  height = 600,
  onCanvasReady,
  fabricCanvasRef: externalFabricCanvasRef
}) => {
  const internalCanvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [pressure, setPressure] = useState<number>(0);
  const [tilt, setTilt] = useState<{x: number, y: number}>({x: 0, y: 0});
  const [deviceCapabilities, setDeviceCapabilities] = useState({
    pressureSupported: false,
    tiltSupported: false,
    webglSupported: false
  });

  // Initialize fabric canvas
  useEffect(() => {
    if (!internalCanvasRef.current) return;

    try {
      const canvas = new FabricCanvas(internalCanvasRef.current, {
        width,
        height,
        enableRetinaScaling: true,
        renderOnAddRemove: true,
        isDrawingMode: false
      });

      // Detect support for advanced input features
      setDeviceCapabilities({
        pressureSupported: isPressureSupported(),
        tiltSupported: isTiltSupported(),
        webglSupported: !!window.WebGLRenderingContext
      });

      // Initialize the canvas
      setFabricCanvas(canvas);
      
      // Update both internal state and external ref if provided
      if (externalFabricCanvasRef) {
        externalFabricCanvasRef.current = canvas;
      }
      
      if (onCanvasReady) {
        onCanvasReady(canvas);
      }

      return () => {
        canvas.dispose();
      };
    } catch (error) {
      console.error('Error initializing canvas:', error);
      toast.error('Failed to initialize canvas. Please refresh the page.');
    }
  }, [width, height, onCanvasReady, externalFabricCanvasRef]);

  // Use our enhanced pointer events with pressure and tilt
  usePointerEvents({
    canvasRef: internalCanvasRef,
    fabricCanvas,
    onPressureChange: (newPressure) => {
      setPressure(newPressure);
      console.log('Pressure:', newPressure);
    },
    onTiltChange: (tiltX, tiltY) => {
      setTilt({x: tiltX, y: tiltY});
      console.log('Tilt:', {x: tiltX, y: tiltY});
    }
  });

  // Initialize WebGL context
  const { glContext, brushSystem } = useWebGLContext({
    canvasRef: internalCanvasRef,
    fabricCanvas
  });

  // Display pressure and tilt indicators for debug purposes
  const showDebugInfo = true;

  return (
    <div className="relative">
      <canvas
        ref={internalCanvasRef}
        className="border border-gray-200 rounded shadow-sm"
        style={{ touchAction: 'none' }}
        data-pressure-supported={deviceCapabilities.pressureSupported}
        data-tilt-supported={deviceCapabilities.tiltSupported}
        data-webgl-supported={deviceCapabilities.webglSupported}
      />
      
      {showDebugInfo && (
        <div className="absolute bottom-2 left-2 bg-white/80 p-2 rounded text-xs">
          <div>Pressure: {pressure.toFixed(2)}</div>
          <div>Tilt X: {tilt.x.toFixed(2)}</div>
          <div>Tilt Y: {tilt.y.toFixed(2)}</div>
          <div>WebGL: {glContext ? 'Active' : 'Not active'}</div>
          <div className="mt-1 text-xs">
            <span className={deviceCapabilities.pressureSupported ? 'text-green-600' : 'text-gray-400'}>
              Pressure: {deviceCapabilities.pressureSupported ? '✓' : '✗'}
            </span>
            {' • '}
            <span className={deviceCapabilities.tiltSupported ? 'text-green-600' : 'text-gray-400'}>
              Tilt: {deviceCapabilities.tiltSupported ? '✓' : '✗'}
            </span>
            {' • '}
            <span className={deviceCapabilities.webglSupported ? 'text-green-600' : 'text-gray-400'}>
              WebGL: {deviceCapabilities.webglSupported ? '✓' : '✗'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
