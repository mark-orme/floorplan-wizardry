
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
}

/**
 * Container component for the canvas element
 */
export const CanvasContainer = ({ debugInfo }: CanvasContainerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <Card className="p-6 bg-white shadow-md rounded-lg">
      <canvas ref={canvasRef} />
      <DebugInfo debugInfo={debugInfo} />
    </Card>
  );
};
