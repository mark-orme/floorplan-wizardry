
/**
 * Basic Canvas Element Component
 * Provides a reliable canvas HTML element for Fabric.js
 * @module BasicCanvasElement
 */
import React, { useRef, useEffect } from 'react';

interface BasicCanvasElementProps {
  width?: number;
  height?: number;
  className?: string;
  id?: string;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

/**
 * A simple canvas element that guarantees existence in the DOM
 * Uses multiple strategies to ensure the canvas is properly rendered
 */
export const BasicCanvasElement: React.FC<BasicCanvasElementProps> = ({
  width = 800,
  height = 600,
  className = '',
  id = 'fabric-canvas',
  onCanvasReady
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Report that canvas is ready
  useEffect(() => {
    if (canvasRef.current && onCanvasReady) {
      // Use requestAnimationFrame to ensure the element is rendered
      const frameId = requestAnimationFrame(() => {
        if (canvasRef.current) {
          console.log('BasicCanvasElement: Canvas element ready in DOM');
          onCanvasReady(canvasRef.current);
        }
      });
      
      return () => cancelAnimationFrame(frameId);
    }
  }, [onCanvasReady]);

  return (
    <canvas
      ref={canvasRef}
      id={id}
      width={width}
      height={height}
      className={`w-full h-full ${className}`}
      data-testid="canvas-element"
      style={{
        // Force display to ensure canvas is visible
        display: 'block',
        // Set direct dimensions to ensure proper initialization
        width: `${width}px`,
        height: `${height}px`
      }}
    />
  );
};
