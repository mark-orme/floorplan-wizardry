
import { useState, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';

export const useCanvasInitialization = (onError?: () => void) => {
  const [isReady, setIsReady] = useState(false);
  const [initAttempt, setInitAttempt] = useState(0);
  const [canvasError, setCanvasError] = useState<string | null>(null);
  const unmountedRef = useRef(false);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const gridLayerRef = useRef<any[]>([]);

  const handleCanvasReady = (canvas: FabricCanvas) => {
    if (unmountedRef.current) return;
    fabricCanvasRef.current = canvas;
    setCanvasError(null);
  };

  const handleCanvasInitError = (error: Error) => {
    console.error('Canvas initialization error:', error);
    setCanvasError(error.message);
    if (onError) onError();
  };

  const handleCanvasRetry = () => {
    setInitAttempt(prev => prev + 1);
    setCanvasError(null);
  };

  return {
    isReady,
    setIsReady,
    initAttempt,
    fabricCanvas: fabricCanvasRef.current,
    canvasError,
    unmountedRef,
    fabricCanvasRef,
    gridLayerRef,
    handleCanvasReady,
    handleCanvasInitError,
    handleCanvasRetry
  };
};
