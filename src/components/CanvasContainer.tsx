
/**
 * Container component for the canvas element
 * Wraps the canvas element and provides a reference to it
 * Also displays debug information
 * @module CanvasContainer
 */
import { Card } from "./ui/card";
import { DebugInfo } from "./DebugInfo";
import { useRef, useEffect } from "react";
import { DebugInfoState } from "@/types/drawingTypes";

interface CanvasContainerProps {
  debugInfo: DebugInfoState;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
}

/**
 * Container component for the canvas element
 * Provides accessible keyboard focus and proper sizing
 * @param {CanvasContainerProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
export const CanvasContainer = ({ debugInfo, canvasRef }: CanvasContainerProps): JSX.Element => {
  // Create a local ref if one is not provided
  const localCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasReference = canvasRef || localCanvasRef;

  // Ensure canvas gets focus when the component renders
  useEffect(() => {
    if (canvasReference.current) {
      // Set tabIndex to make the canvas focusable
      canvasReference.current.tabIndex = 0;
      
      // Focus the canvas after a short delay to ensure it's rendered
      const focusTimer = setTimeout(() => {
        canvasReference.current?.focus();
      }, 100);
      
      return () => clearTimeout(focusTimer);
    }
  }, [canvasReference]);

  return (
    <Card className="p-6 bg-white shadow-md rounded-lg">
      <canvas 
        ref={canvasReference} 
        className="w-full h-full border-2 border-gray-100 focus:outline-blue-500 focus:border-blue-500 rounded-md" 
        tabIndex={0}
        aria-label="Floor plan drawing canvas"
        role="application"
      />
      <DebugInfo debugInfo={debugInfo} />
    </Card>
  );
};
