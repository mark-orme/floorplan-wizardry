
/**
 * Canvas Element Component
 * Simple wrapper for the raw canvas HTML element
 * @module canvas/CanvasElement
 */
import React from 'react';

interface CanvasElementProps {
  /** Whether the canvas is ready to render */
  canvasReady: boolean;
  /** Number of dimension setup attempts */
  dimensionsSetupAttempt: number;
  /** Reference to the canvas element */
  canvasReference: React.RefObject<HTMLCanvasElement>;
}

/**
 * Canvas Element component
 * Provides the actual canvas HTML element with proper attributes
 * @param {CanvasElementProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
export const CanvasElement: React.FC<CanvasElementProps> = ({
  canvasReady,
  dimensionsSetupAttempt,
  canvasReference
}) => {
  return (
    <canvas
      ref={canvasReference}
      id="fabric-canvas"
      data-testid="canvas-element"
      data-ready={canvasReady ? "true" : "false"}
      data-attempt={dimensionsSetupAttempt}
      className="w-full h-full border border-gray-200 touch-none"
      style={{ touchAction: 'none' }} // This ensures scroll blocking is well-defined
    />
  );
};
