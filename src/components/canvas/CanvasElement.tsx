
/**
 * Canvas element component
 * Renders the actual canvas element with proper attributes
 * @module canvas/CanvasElement
 */
import { forwardRef } from "react";

interface CanvasElementProps {
  canvasReady: boolean;
  dimensionsSetupAttempt: number;
  canvasReference: React.RefObject<HTMLCanvasElement>;
}

/**
 * Component for rendering the canvas element with proper attributes
 * @param {CanvasElementProps} props - Component properties
 * @returns {JSX.Element} Rendered canvas element
 */
export const CanvasElement = forwardRef<HTMLCanvasElement, CanvasElementProps>(
  ({ canvasReady, dimensionsSetupAttempt, canvasReference }, ref) => {
    return (
      <canvas 
        ref={canvasReference} 
        className="w-full h-full border border-gray-100 focus:outline-blue-500 focus:border-blue-500 rounded-md" 
        tabIndex={0}
        aria-label="Floor plan drawing canvas"
        role="application"
        style={{ display: "block" }}
        data-testid="canvas-element"
        id="fabric-canvas"
        data-canvas-ready={canvasReady ? "true" : "false"}
        data-dimension-attempts={dimensionsSetupAttempt}
      />
    );
  }
);

// Add display name for debugging
CanvasElement.displayName = "CanvasElement";
