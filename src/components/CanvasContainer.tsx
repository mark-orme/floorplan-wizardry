
/**
 * Container component for the canvas element
 * Wraps the canvas element and provides a reference to it
 * Also displays debug information
 */
import { Card } from "./ui/card";
import { DebugInfo } from "./DebugInfo";
import { useRef } from "react";

interface CanvasContainerProps {
  debugInfo: {
    canvasInitialized: boolean;
    gridCreated: boolean;
    dimensionsSet: boolean;
    brushInitialized: boolean;
  };
  canvasRef?: React.RefObject<HTMLCanvasElement>;
}

/**
 * Container component for the canvas element
 * @param {CanvasContainerProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
export const CanvasContainer = ({ debugInfo, canvasRef }: CanvasContainerProps) => {
  // Create a local ref if one is not provided
  const localCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasReference = canvasRef || localCanvasRef;

  return (
    <Card className="p-6 bg-white shadow-md rounded-lg">
      <canvas ref={canvasReference} className="w-full h-full border-0" />
      <DebugInfo debugInfo={debugInfo} />
    </Card>
  );
};
