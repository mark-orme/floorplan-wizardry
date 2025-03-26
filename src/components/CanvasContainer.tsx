
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
        canvasReference.current.height = Math.max(containerRect.height, 1000); // Increased from 950 to 1000
        
        // Also set style dimensions to match
        canvasReference.current.style.width = `${containerRect.width}px`;
        canvasReference.current.style.height = `${Math.max(containerRect.height, 1000)}px`; // Increased from 950 to 1000
        
        // Force a reflow to ensure dimensions are applied
        canvasReference.current.getBoundingClientRect();
        
        console.log("Canvas sized to dimensions:", 
          containerRect.width, "x", Math.max(containerRect.height, 1000));
      } else {
        // Fallback sizes if container dimensions are not available
        canvasReference.current.width = 1400; // Increased from 1200 to 1400
        canvasReference.current.height = 1000; // Increased from 950 to 1000
        canvasReference.current.style.width = "1400px"; // Increased from 1200 to 1400
        canvasReference.current.style.height = "1000px"; // Increased from 950 to 1000
        console.log("Using fallback canvas dimensions: 1400x1000");
      }
    }
  }, [canvasReference]);

  return (
    <Card className="p-0 bg-white shadow-md rounded-lg overflow-visible"> {/* Added overflow-visible to allow tooltips to extend beyond container */}
      <div 
        ref={containerRef} 
        className="w-full h-[1000px] md:h-[1050px] relative overflow-visible" // Added overflow-visible, increased heights from 950/1000 to 1000/1050
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
