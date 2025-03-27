
/**
 * Reliable Canvas Container Component
 * Ensures canvas element exists and is properly initialized
 * @module ReliableCanvasContainer
 */
import React, { useState, useEffect } from 'react';
import { BasicCanvasElement } from './BasicCanvasElement';
import { createFabricCanvas, validateFabricCanvas } from '@/utils/fabricCanvasCreator';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';

// Constants
const CANVAS_CHECK_INTERVAL = 1000; // ms
const MAX_ATTEMPTS = 5;

interface ReliableCanvasContainerProps {
  width?: number;
  height?: number;
  onCanvasReady?: (canvas: FabricCanvas) => void;
  onCanvasError?: (error: Error) => void;
  children?: React.ReactNode;
}

/**
 * A container that ensures a valid Fabric.js canvas exists
 */
export const ReliableCanvasContainer: React.FC<ReliableCanvasContainerProps> = ({
  width = 800,
  height = 600,
  onCanvasReady,
  onCanvasError,
  children
}) => {
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  // Handler for when HTML canvas element is ready
  const handleCanvasElementReady = (canvasElement: HTMLCanvasElement) => {
    console.log('ReliableCanvasContainer: Canvas element received, initializing Fabric.js');
    
    try {
      // Create Fabric.js canvas instance
      const canvas = createFabricCanvas(canvasElement, width, height);
      
      if (canvas && validateFabricCanvas(canvas)) {
        setFabricCanvas(canvas);
        console.log('ReliableCanvasContainer: Fabric.js canvas initialized successfully');
        
        if (onCanvasReady) {
          onCanvasReady(canvas);
        }
      } else {
        console.error('ReliableCanvasContainer: Canvas creation failed validation');
        setAttempts(prev => prev + 1);
        setError(new Error('Canvas validation failed'));
      }
    } catch (err) {
      console.error('ReliableCanvasContainer: Error creating Fabric.js canvas', err);
      setAttempts(prev => prev + 1);
      setError(err instanceof Error ? err : new Error('Canvas initialization error'));
    }
  };

  // Effect to handle errors
  useEffect(() => {
    if (error && onCanvasError) {
      onCanvasError(error);
    }
  }, [error, onCanvasError]);

  // Effect to retry canvas initialization if it fails
  useEffect(() => {
    if (!fabricCanvas && attempts > 0 && attempts < MAX_ATTEMPTS) {
      const timer = setTimeout(() => {
        console.log(`ReliableCanvasContainer: Retrying canvas initialization (attempt ${attempts + 1}/${MAX_ATTEMPTS})`);
        // Force re-render to try again
        setAttempts(prev => prev + 1);
      }, CANVAS_CHECK_INTERVAL);
      
      return () => clearTimeout(timer);
    } else if (attempts >= MAX_ATTEMPTS && !fabricCanvas) {
      console.error('ReliableCanvasContainer: Maximum attempts reached, canvas initialization failed');
      setError(new Error('Canvas initialization failed after maximum attempts'));
    }
  }, [attempts, fabricCanvas]);

  return (
    <div 
      className="relative w-full h-full"
      data-canvas-ready={!!fabricCanvas}
      data-attempts={attempts}
    >
      <BasicCanvasElement 
        width={width}
        height={height}
        onCanvasReady={handleCanvasElementReady}
      />
      
      {/* Only render children if canvas is ready */}
      {fabricCanvas && children}
      
      {/* Show error message if maximum attempts reached */}
      {attempts >= MAX_ATTEMPTS && !fabricCanvas && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-600 text-center">
            <p className="font-bold">Canvas initialization failed</p>
            <p className="text-sm">{error?.message || 'Unknown error'}</p>
            <button 
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md"
              onClick={() => {
                setAttempts(0);
                setError(null);
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
