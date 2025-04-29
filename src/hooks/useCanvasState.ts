
import { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas } from 'fabric';
import { UseCanvasStateResult } from '@/types/fabric-unified';

export const useCanvasState = (): UseCanvasStateResult => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize the canvas
  const initializeCanvas = useCallback(() => {
    if (!canvasRef.current) return;

    try {
      // Clean up any existing canvas
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
      }

      // Create a new canvas
      const canvas = new Canvas(canvasRef.current, {
        width: canvasRef.current.width,
        height: canvasRef.current.height,
        backgroundColor: '#ffffff',
        selection: true
      });

      fabricCanvasRef.current = canvas;
      setIsInitialized(true);

      console.log('Canvas initialized successfully');
    } catch (error) {
      console.error('Failed to initialize canvas:', error);
      setIsInitialized(false);
    }
  }, []);

  // Dispose the canvas
  const disposeCanvas = useCallback(() => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.dispose();
      fabricCanvasRef.current = null;
      setIsInitialized(false);
    }
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      disposeCanvas();
    };
  }, [disposeCanvas]);

  return {
    canvasRef,
    fabricCanvasRef,
    initializeCanvas,
    disposeCanvas,
    isInitialized
  };
};
