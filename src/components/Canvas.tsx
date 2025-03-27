
/**
 * Canvas Component
 * Primary canvas component for fabric.js rendering
 * @module Canvas
 */
import React, { useEffect, useRef } from 'react';
import { useCanvasInit } from '@/hooks/useCanvasInit';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';

interface CanvasProps {
  onError?: () => void;
  width?: number;
  height?: number;
  onCanvasReady?: (canvas: FabricCanvas) => void;
}

/**
 * Canvas component that handles fabric.js canvas rendering
 * @param {CanvasProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
export const Canvas: React.FC<CanvasProps> = ({ 
  onError, 
  width = 800,
  height = 600,
  onCanvasReady 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  
  // Initialize fabric.js canvas when the HTML canvas is available
  useEffect(() => {
    if (!canvasRef.current) return;
    
    try {
      console.log("Canvas: Creating Fabric.js instance");
      
      // Create the Fabric.js canvas instance
      const canvas = new FabricCanvas(canvasRef.current, {
        width,
        height,
        backgroundColor: '#FFFFFF'
      });
      
      // Store the canvas reference
      fabricCanvasRef.current = canvas;
      
      // Store it in a global registry for debugging/recovery
      if (!window.fabricCanvasInstances) {
        window.fabricCanvasInstances = [];
      }
      window.fabricCanvasInstances.push(canvas);
      
      // Also store a reference on the canvas element itself for debugging
      (canvasRef.current as any)._fabric = canvas;
      
      console.log("Canvas: Fabric.js canvas created successfully");
      
      // Call the onCanvasReady callback if provided
      if (onCanvasReady) {
        onCanvasReady(canvas);
      }
      
    } catch (error) {
      console.error("Canvas: Error creating Fabric.js canvas", error);
      
      // Show error toast
      toast.error("Error initializing canvas");
      
      // Call onError callback if provided
      if (onError) {
        onError();
      }
      
      // Dispatch canvas-init-error event
      window.dispatchEvent(new CustomEvent('canvas-init-error', { 
        detail: error instanceof Error ? error : new Error('Canvas initialization failed') 
      }));
    }
    
    // Cleanup function
    return () => {
      if (fabricCanvasRef.current) {
        try {
          fabricCanvasRef.current.dispose();
          console.log("Canvas: Fabric.js canvas disposed");
        } catch (error) {
          console.error("Canvas: Error disposing canvas", error);
        }
        
        fabricCanvasRef.current = null;
      }
    };
  }, [width, height, onCanvasReady, onError]);
  
  // Use our hook for any additional initialization logic
  useCanvasInit({ onError });
  
  return (
    <canvas 
      ref={canvasRef}
      width={width}
      height={height}
      className="w-full h-full border border-gray-200"
      style={{ border: '1px solid #eee' }}
      data-testid="fabric-canvas"
    />
  );
};

// Add TypeScript typings for window - properly typed to prevent conflicts
declare global {
  interface Window {
    // Important: Use the proper FabricCanvas type here, not just 'Canvas'
    fabricCanvasInstances?: FabricCanvas[];
  }
  
  interface HTMLCanvasElement {
    // Use any type for _fabric to match existing declarations
    _fabric?: any;
  }
}
