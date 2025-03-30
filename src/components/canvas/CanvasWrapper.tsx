
import React from 'react';
import { useCanvasController } from './controller/CanvasController';

/**
 * Canvas wrapper component that renders the canvas element
 * @returns {JSX.Element} Rendered component
 */
export const CanvasWrapper: React.FC = () => {
  const { canvasRef } = useCanvasController();

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-50">
      <canvas 
        ref={canvasRef}
        id="fabric-canvas"
        data-testid="canvas-element"
        className="border border-gray-200 shadow-md"
      />
    </div>
  );
};
