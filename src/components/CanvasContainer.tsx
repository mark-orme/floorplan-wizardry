
/**
 * Container component for the canvas element
 * Wraps the canvas element and provides a reference to it
 * Also displays debug information
 * @module CanvasContainer
 */
import { useEffect, useRef } from "react";
import { Card } from "./ui/card";
import { DebugInfo } from "./DebugInfo";
import { DebugInfoState } from "@/types/drawingTypes";
import { useDomRef } from "@/hooks/useDomRef";

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
  // Create a local ref that auto-focuses if one is not provided
  const localCanvasRef = useDomRef<HTMLCanvasElement>(true);
  const canvasReference = canvasRef || localCanvasRef;
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Ensure the canvas has proper dimensions after rendering
  useEffect(() => {
    if (canvasReference.current && containerRef.current) {
      // Get container dimensions
      const containerRect = containerRef.current.getBoundingClientRect();
      
      // Set canvas dimensions explicitly based on container
      if (containerRect.width > 0 && containerRect.height > 0) {
        canvasReference.current.style.width = `${containerRect.width}px`;
        canvasReference.current.style.height = `${Math.max(containerRect.height, 500)}px`;
        
        // Force a reflow to ensure dimensions are applied
        canvasReference.current.getBoundingClientRect();
        
        console.log("Canvas sized to container dimensions:", 
          containerRect.width, "x", Math.max(containerRect.height, 500));
      } else {
        // Fallback sizes if container dimensions are not available
        canvasReference.current.style.width = "800px";
        canvasReference.current.style.height = "600px";
        console.log("Using fallback canvas dimensions: 800x600");
      }
    }
  }, [canvasReference]);

  return (
    <Card className="p-6 bg-white shadow-md rounded-lg">
      <div 
        ref={containerRef} 
        className="w-full h-[500px] md:h-[600px] relative"
      >
        <canvas 
          ref={canvasReference} 
          className="w-full h-full border-2 border-gray-100 focus:outline-blue-500 focus:border-blue-500 rounded-md" 
          tabIndex={0}
          aria-label="Floor plan drawing canvas"
          role="application"
          style={{ display: "block" }} // Ensure canvas is visible
        />
      </div>
      <DebugInfo debugInfo={debugInfo} />
    </Card>
  );
};
