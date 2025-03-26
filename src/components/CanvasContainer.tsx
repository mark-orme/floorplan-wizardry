
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
  
  // Force initialization after render to ensure canvas has dimensions
  useEffect(() => {
    if (canvasReference.current && containerRef.current) {
      // Get container dimensions
      const containerRect = containerRef.current.getBoundingClientRect();
      
      // Set canvas dimensions explicitly based on container
      if (containerRect.width > 0 && containerRect.height > 0) {
        canvasReference.current.width = containerRect.width;
        canvasReference.current.height = Math.max(containerRect.height, 850); // Increased from 700 to 850
        
        // Also set style dimensions to match
        canvasReference.current.style.width = `${containerRect.width}px`;
        canvasReference.current.style.height = `${Math.max(containerRect.height, 850)}px`; // Increased from 700 to 850
        
        // Force a reflow to ensure dimensions are applied
        canvasReference.current.getBoundingClientRect();
        
        console.log("Canvas sized to dimensions:", 
          containerRect.width, "x", Math.max(containerRect.height, 850));
      } else {
        // Fallback sizes if container dimensions are not available
        canvasReference.current.width = 900;
        canvasReference.current.height = 850; // Increased from 700 to 850
        canvasReference.current.style.width = "900px";
        canvasReference.current.style.height = "850px"; // Increased from 700 to 850
        console.log("Using fallback canvas dimensions: 900x850");
      }
    }
  }, [canvasReference]);

  return (
    <Card className="p-2 bg-white shadow-md rounded-lg"> {/* Reduced padding from p-4 to p-2 */}
      <div 
        ref={containerRef} 
        className="w-full h-[850px] md:h-[900px] relative" // Increased heights from 700/800 to 850/900
      >
        <canvas 
          ref={canvasReference} 
          className="w-full h-full border border-gray-100 focus:outline-blue-500 focus:border-blue-500 rounded-md" 
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

